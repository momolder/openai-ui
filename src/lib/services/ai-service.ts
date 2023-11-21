import { env } from '$env/dynamic/private';
import type { Conversation } from '$lib/models/Contracts';
import { AzureKeyCredential, OpenAIClient, type ChatCompletions } from '@azure/openai';

export function GetResponse(conversation: Conversation): AsyncIterable<ChatCompletions> {
  const client = new OpenAIClient(env.OpenAi_Endpoint, new AzureKeyCredential(env.OpenAi_Key), {}
  );
  const mappedMessages = conversation.messages.map((m) => {
    return {
      content: m.content,
      role: m.role,
      name: m.name
    };
  });
  return client.listChatCompletions('gpt-35-turbo-16k', mappedMessages.slice(0, -1));
}
