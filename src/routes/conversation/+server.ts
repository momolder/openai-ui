import { ChatRole, type Conversation } from '$lib/models/Contracts';
import {
  AzureKeyCredential,
  OpenAIClient,
  type ChatRequestMessage,
  type AzureChatExtensionConfiguration,
  type AzureCognitiveSearchChatExtensionConfiguration,
  type AzureCognitiveSearchQueryType
} from '@azure/openai';
import type { RequestEvent } from './$types';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

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

export async function POST({ request }: RequestEvent) {
  const client = new OpenAIClient(env.OpenAi_Endpoint, new AzureKeyCredential(env.OpenAi_Key));
  const conversation = (await request.json()) as Conversation;
  const mappedMessages: ChatRequestMessage[] = mapMessages(conversation);

  const chatStream = await client.streamChatCompletions(env.OpenAi_Deployment, mappedMessages, {
    maxTokens: Number.parseInt(env.OpenAi_MaxTokens),
    temperature: Number.parseFloat(env.OpenAi_Temperature),
    frequencyPenalty: Number.parseFloat(env.OpenAi_FrequencyPenalty),
    presencePenalty: Number.parseFloat(env.OpenAi_PresencePenalty),
    topP: Number.parseFloat(env.OpenAi_NucleusSamplingFactor),
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
