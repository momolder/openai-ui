import type { Conversation, ChatMode } from '$lib/models/Contracts';
import type { RequestEvent } from '../$types';
import { streamResponse } from '../openAi';

export async function POST({ request, params }: RequestEvent) {
  const { conversation, chatMode } = (await request.json()) as {
    conversation: Conversation;
    chatMode: ChatMode;
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return await streamResponse(conversation, chatMode, params.deployment);
}
