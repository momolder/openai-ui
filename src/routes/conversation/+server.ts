import type { Conversation } from '$lib/models/Contracts';
import { env } from '$env/dynamic/private';
import type { RequestEvent } from './$types';
import { streamResponse } from './openAi';

export async function POST({ request }: RequestEvent) {
  const conversation = (await request.json()) as Conversation;
  return await streamResponse(conversation, env.OpenAi_Deployment);
}
