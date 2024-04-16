import { response } from '$lib/langchain/openAi';
import type { Conversation, ChatMode } from '$lib/models/Contracts';
import type { RequestEvent } from '../$types';

export async function POST({ request, params }: RequestEvent) {
  const { conversation, chatMode } = (await request.json()) as {
    conversation: Conversation;
    chatMode: ChatMode;
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  // return await streamResponse(conversation, chatMode, params.deployment);
  return await response(conversation, chatMode, params.deployment);
}
