import { json, type RequestEvent } from '@sveltejs/kit';
import type { Conversation } from '$lib/models/Contracts.js';
import { fakeHistory } from './history-cache';

export async function POST({ request }: RequestEvent): Promise<Response> {
  const conversation = (await request.json()) as Conversation;
  fakeHistory.update((h) => {
    h = [conversation, ...h];
    return h;
  });
  return json(conversation);
}

export async function PUT({ request }: RequestEvent): Promise<Response> {
  const conversation = (await request.json()) as Conversation;
  fakeHistory.update((h) => {
    const i = h.findIndex((c) => c.id === conversation.id);
    h.splice(i, 1, conversation);
    return h;
  });
  
  return json(conversation);
}

export async function DELETE({ request }: RequestEvent): Promise<Response> {
  const conversation = (await request.json()) as Conversation;
  fakeHistory.update((h) => {
    const i = h.findIndex((c) => c.id === conversation.id);
    h.splice(i, 1);
    return h;
  });
  return new Response(undefined, { status: 204 });
}
