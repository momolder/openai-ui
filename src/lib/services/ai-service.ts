import type { Conversation } from '$lib/models/Contracts';
import { AzureKeyCredential, OpenAIClient, type ChatCompletions } from '@azure/openai';

export function GetResponse(conversation: Conversation): AsyncIterable<ChatCompletions> {
  const client = new OpenAIClient(
    'https://oaiopenai113.openai.azure.com',
    new AzureKeyCredential('83eb323c8fab462d973def7c724d043b'), { }
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
