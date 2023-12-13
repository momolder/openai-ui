import { ChatRole, type Conversation } from '$lib/models/Contracts';
import { AzureKeyCredential, OpenAIClient } from '@azure/openai';
import type { RequestEvent } from './$types';
import { env } from '$env/dynamic/private';
import { isNullOrWhitespace } from '$lib/helper';

const extensions = {
  extensions: [
    {
      type: 'AzureCognitiveSearch',
      parameters: {
        endpoint: env.AiSearch_Endpoint,
        key: env.AiSearch_Key,
        indexName: env.AiSearch_IndexName,
        shouldRestrictResultScope: false,
        inScope: false,
        strictness: 3,
        queryType: 'simple',
        fieldsMapping: {
          // idField: '',
          // "contentFields":[""],
          titleField: 'metadata_title',
          urlField: 'metadata_storage_path'
          // "filepathField": AZURE_SEARCH_FILENAME_COLUMN if AZURE_SEARCH_FILENAME_COLUMN else None,
          // "vectorFields": AZURE_SEARCH_VECTOR_COLUMNS.split("|") if AZURE_SEARCH_VECTOR_COLUMNS else []
        }
      }
    }
  ]
};

export async function POST({ request }: RequestEvent) {
  const client = new OpenAIClient(env.OpenAi_Endpoint, new AzureKeyCredential(env.OpenAi_Key));
  const conversation = (await request.json()) as Conversation;
  let mappedMessages = conversation.messages.map((m) => {
    return {
      content: m.content,
      role: m.role,
      name: m.name
    };
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
  const chatStream = client.listChatCompletions(env.OpenAi_Deployment, mappedMessages, {
    maxTokens: Number.parseInt(env.OpenAi_MaxTokens),
    temperature: Number.parseFloat(env.OpenAi_Temperature),
    frequencyPenalty: Number.parseFloat(env.OpenAi_FrequencyPenalty),
    presencePenalty: Number.parseFloat(env.OpenAi_PresencePenalty),
    topP: Number.parseFloat(env.OpenAi_NucleusSamplingFactor),
    stop: [env.OpenAi_StopSequences],
    azureExtensionOptions: isNullOrWhitespace(env.AiSearch_Key) ? undefined : extensions
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
