import type { RequestEvent } from '@sveltejs/kit';
import type { ChatMode, Conversation } from '$lib/models/Contracts';
import { streamResponse } from './../openAi';

export async function POST({ request, params }: RequestEvent) {
  const {conversation, chatMode } = (await request.json()) as {conversation: Conversation, chatMode: ChatMode};
  const content = `*${
    conversation.messages.at(-2)?.content
  }* was your request with chatMode: **${chatMode}** and this is my answer from deployment **${params.deployment}**.`;
  return streamResponse(content);
}
