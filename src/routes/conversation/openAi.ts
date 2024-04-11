import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { ChatMode, type Conversation } from '$lib/models/Contracts';
import {
  OpenAIClient,
  type ChatRequestMessage,
  AzureKeyCredential,
  type AzureChatExtensionConfiguration,
  type AzureSearchChatExtensionConfiguration,
  type ChatRequestSystemMessage
} from '@azure/openai';
import {Tiktoken, encoding_for_model, type TiktokenModel} from 'tiktoken';

const searchConfiguration: AzureSearchChatExtensionConfiguration = {
  type: 'azure_search',
  endpoint: env.AiSearch_Endpoint,
  authentication: { key: env.AiSearch_Key, type: 'api_key'},
  indexName: env.AiSearch_IndexName,
  semanticConfiguration: env.AiSearch_SemanticConfiguration,
  queryType: env.AiSearch_QueryType,
  roleInformation: env.OpenAi_SystemMessage,
  fieldsMapping: {
    contentFieldsSeparator: '\n',
    contentFields: env.AiSearch_ContentFields.split('|').map((field) => field.trim()),
    filepathField: env.AiSearch_FilePathField,
    titleField: env.AiSearch_TitleField,
    urlField: env.AiSearch_UrlField
  },
  inScope: true,
  strictness: 3,
  topNDocuments: 2, 
  embeddingDependency: { endpoint: `${env.OpenAi_Endpoint}openai/deployments/${env.OpenAi_Embedding}/embeddings?api-version=${env.OpenAi_ApiVersion}`, type: 'endpoint' },
};

const chatModeTemplates = [
  { chatMode: ChatMode.Balanced, value: { temperature: 0.7, topP: 0.95 } },
  { chatMode: ChatMode.Creative, value: { temperature: 1.31, topP: 0.29 } },
  { chatMode: ChatMode.Precise, value: { temperature: 0.1, topP: 0.5 } }
];

export async function streamResponse(conversation: Conversation, chatMode: ChatMode, deployment: string) {
  const maxTokens = Number.parseInt(env.OpenAi_MaxTokens);
  const tokenLimit = Number.parseInt(env.OpenAi_TokenLimit);

  const template = chatModeTemplates.find((t) => t.chatMode === chatMode) ?? chatModeTemplates[0];
  const client = new OpenAIClient(env.OpenAi_Endpoint, new AzureKeyCredential(env.OpenAi_Key));
  let mappedMessages: ChatRequestMessage[] = mapMessages(conversation);
  mappedMessages = trimToTokenLimit(deployment, mappedMessages, maxTokens, tokenLimit);

  const chatStream = await client.streamChatCompletions(deployment, mappedMessages, {
    maxTokens: maxTokens,
    temperature: template.value.temperature,
    frequencyPenalty: Number.parseFloat(env.OpenAi_FrequencyPenalty),
    presencePenalty: Number.parseFloat(env.OpenAi_PresencePenalty),
    topP: template.value.topP,
    stop: [env.OpenAi_StopSequences],
    azureExtensionOptions: {
      extensions:
        publicEnv.PUBLIC_App_UseDocumentSearch === 'true' && conversation.useDocumentSearch
          ? ([searchConfiguration] as AzureChatExtensionConfiguration[])
          : undefined
    }
  });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const update of chatStream) {
          for (const choice of update.choices) {
            const delta = choice.delta;
            if (delta !== undefined) {
              controller.enqueue(JSON.stringify(delta));
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'content-type': 'plain/text'
    }
  });
}

function mapMessages(conversation: Conversation) {
  let mappedMessages: ChatRequestMessage[] = conversation.messages.map((m) => {
    return {
      content: m.content,
      name: m.name,
      role: m.role.toString()
    } as ChatRequestMessage;
  });

  const pastMessagesIncluded = env.OpenAi_PastMessagesIncluded
    ? Number.parseInt(env.OpenAi_PastMessagesIncluded)
    : conversation.messages.length;

  mappedMessages =
    mappedMessages.length > pastMessagesIncluded
      ? mappedMessages.slice(-pastMessagesIncluded)
      : mappedMessages;
  mappedMessages = [
    { content: env.OpenAi_SystemMessage, name: 'system' } as ChatRequestSystemMessage,
    ...mappedMessages
  ];
  return mappedMessages;
}

function trimToTokenLimit(
  model: string,
  messages: ChatRequestMessage[],
  maxTokens: number,
  tokenLimit: number
): ChatRequestMessage[] {
  let numTokens = getTokensForMessages(model, messages) + maxTokens;
  while (numTokens >= tokenLimit) {
    messages = messages.slice(0, -1)
    numTokens = getTokensForMessages(model, messages) + maxTokens
  }
  
  console.log(`sending ${messages.length} messages with ${numTokens} tokens to openai.`);
  return messages;
}

function getTokensForMessages(model: string, messages: ChatRequestMessage[]): number {
  const encoding: Tiktoken = encoding_for_model(model as TiktokenModel);
  const tokenRates = getModelTokenRates(model);
  let numTokens = 0;

  for (const message of messages) {
    numTokens += tokenRates.perMessage;
    for (const [key, value] of Object.entries(message)) {
      numTokens += encoding.encode(value as string).length;
      if (key === 'name') {
        numTokens += tokenRates.perName;
      }
    }
  }
  numTokens += 3; // every reply is primed with <|im_start|>assistant<|im_sep|>
  encoding.free();
  return numTokens;
}

function getModelTokenRates(model: string): { perMessage: number; perName: number } {
  if (
    new Set([
      'gpt-35-turbo-0613',
      'gpt-35-turbo-16k-0613',
      'gpt-4-0314',
      'gpt-4-32k-0314',
      'gpt-4-0613',
      'gpt-4-32k-0613'
    ]).has(model)
  ) {
    return { perMessage: 3, perName: 1 };
  } else if (model === 'gpt-35-turbo-0301') {
    return { perMessage: 4, perName: -1 };
  } else if (model.includes('gpt-35-turbo')) {
    console.warn(
      'Warning: gpt-35-turbo may update over time. Returning num tokens assuming gpt-3.5-turbo-0613.'
    );
    return { perMessage: 3, perName: 1 };
  } else if (model.includes('gpt-4')) {
    console.warn('Warning: gpt-4 may update over time. Returning num tokens assuming gpt-4-0613.');
    return { perMessage: 3, perName: 1 };
  } else {
    throw new Error(
      `getModelTokenRates() is not implemented for model ${model}. See https://github.com/openai/openai-python/blob/main/chatml.md for information on how messages are converted to tokens.`
    );
  }
}
