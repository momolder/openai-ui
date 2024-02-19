import type { RequestEvent } from '@sveltejs/kit';
import type { Conversation } from '$lib/models/Contracts';
import { streamResponse } from './openAi';

export async function POST({ request }: RequestEvent) {
  const conversation = (await request.json()) as Conversation;
  const content = `*${conversation.messages.at(-2)?.content}* was your request and this is my answer.`;
  return streamResponse(content);
}
