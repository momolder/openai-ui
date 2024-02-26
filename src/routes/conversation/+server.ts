import type { ChatMode, Conversation } from '$lib/models/Contracts';
import { env } from '$env/dynamic/private';
import type { RequestEvent } from './$types';
import { streamResponse } from './openAi';

export async function POST({ request }: RequestEvent) {
  const { conversation, chatMode } = (await request.json()) as {
    conversation: Conversation;
    chatMode: ChatMode;
  };
  return await streamResponse(conversation, chatMode, env.OpenAi_Deployment);
}
