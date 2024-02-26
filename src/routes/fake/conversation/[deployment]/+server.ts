import type { RequestEvent } from '@sveltejs/kit';
import type { ChatMode, Conversation } from '$lib/models/Contracts';
import { streamResponse } from './../openAi';

export async function POST({ request, params }: RequestEvent) {
  const { conversation, chatMode } = (await request.json()) as {
    conversation: Conversation;
    chatMode: ChatMode;
  };
  const userMessage = conversation.messages.at(-2)?.content;
  if (userMessage?.includes('table')) {
    const content = `Here is the requested table:\n\n| Item         | Price     | x In stock |\n|--------------|-----------|------------|\n| Juicy Apples | 1.99      | *7*        |\n| Bananas      | **1.89**  | 5234       |\n| Oranges      | **2.09**  | 0       |\n`;
    return streamResponse(content);
  } else {
    const content = `*${userMessage}* was your request with chatMode: **${chatMode}** and this is my answer from deployment **${params.deployment}**.`;
    return streamResponse(content);
  }
}
