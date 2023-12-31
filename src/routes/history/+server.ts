import { json, type RequestEvent } from '@sveltejs/kit';
import type { Conversation } from '$lib/models/Contracts.js';
import DatabaseService from '$lib/services/database-service';

export async function POST({ request }: RequestEvent): Promise<Response> {
  const databaseService = await new DatabaseService().init();
  const conversation = (await request.json()) as Conversation;
  return json(await databaseService.createHistory(conversation));
}

export async function PUT({ request }: RequestEvent): Promise<Response> {
  const databaseService = await new DatabaseService().init();
  const conversation = (await request.json()) as Conversation;
  return json(await databaseService.updateHistory(conversation));
}

export async function DELETE({ request }: RequestEvent): Promise<Response> {
  const databaseService = await new DatabaseService().init();
  const conversation = (await request.json()) as Conversation;
  await databaseService.deleteHistory(conversation);
  return new Response(undefined, { status: 204 });
}
