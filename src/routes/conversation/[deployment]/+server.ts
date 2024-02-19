
import type { Conversation } from '$lib/models/Contracts';
import type { RequestEvent } from '../$types';
import { streamResponse } from '../openAi';

export async function POST({ request, params }: RequestEvent) {
  const conversation = (await request.json()) as Conversation;
  return await streamResponse(conversation, params.deployment);
}