import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { ChatRole, ChatMode, type Conversation } from '$lib/models/Contracts';
import {
  OpenAIClient,
  type ChatRequestMessage,
  AzureKeyCredential,
  type AzureChatExtensionConfiguration,
  type AzureCognitiveSearchQueryType,
  type AzureCognitiveSearchChatExtensionConfiguration
} from '@azure/openai';

const searchConfiguration: AzureCognitiveSearchChatExtensionConfiguration = {
  type: 'AzureCognitiveSearch',
  endpoint: env.AiSearch_Endpoint,
  key: env.AiSearch_Key,
  indexName: env.AiSearch_IndexName,
  semanticConfiguration: env.AiSearch_SemanticConfiguration,
  queryType: env.AiSearch_QueryType as AzureCognitiveSearchQueryType,
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
  embeddingKey: env.OpenAi_Key,
  embeddingEndpoint: `${env.OpenAi_Endpoint}openai/deployments/${env.OpenAi_Embedding}/embeddings?api-version=${env.OpenAi_ApiVersion}`
};

const chatModeTemplates = [
  { chatMode: ChatMode.Balanced, value: { temperature: 0.7, topP: 0.95 } },
  { chatMode: ChatMode.Creative, value: { temperature: 1.31, topP: 0.29 } },
  { chatMode: ChatMode.Precise, value: { temperature: 0.1, topP: 0.5 } },
];

export async function streamResponse(conversation: Conversation, chatMode: ChatMode, deployment: string) {
  const template = chatModeTemplates.find((t) => t.chatMode === chatMode) ?? chatModeTemplates[0];
  const client = new OpenAIClient(env.OpenAi_Endpoint, new AzureKeyCredential(env.OpenAi_Key));
  const mappedMessages: ChatRequestMessage[] = mapMessages(conversation);

  const chatStream = await client.streamChatCompletions(deployment, mappedMessages, {
    maxTokens: Number.parseInt(env.OpenAi_MaxTokens),
    temperature: env.OpenAi_Temperature ? Number.parseFloat(env.OpenAi_Temperature) : template.value.temperature,
    frequencyPenalty: Number.parseFloat(env.OpenAi_FrequencyPenalty),
    presencePenalty: Number.parseFloat(env.OpenAi_PresencePenalty),
    topP: env.OpenAi_NucleusSamplingFactor ? Number.parseFloat(env.OpenAi_NucleusSamplingFactor) : template.value.topP,
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

  const pastMessagesIncluded = Number.parseInt(env.OpenAi_PastMessagesIncluded);

  mappedMessages =
    mappedMessages.length > pastMessagesIncluded
      ? mappedMessages.slice(-pastMessagesIncluded)
      : mappedMessages;
  mappedMessages = [
    { role: ChatRole.System, content: env.OpenAi_SystemMessage, name: 'system' },
    ...mappedMessages
  ];
  return mappedMessages;
}
