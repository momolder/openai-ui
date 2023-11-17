import { json, type RequestEvent } from "@sveltejs/kit";
import type { Conversation } from "$lib/models/Contracts.js";
import databaseService from "$lib/services/database-service";

export async function POST({ request }: RequestEvent): Promise<Response> {
  const conversation = (await request.json()) as Conversation;
  return json(await databaseService.createHistory(conversation));
};

export async function PUT({ request }: RequestEvent): Promise<Response> {
  const conversation = (await request.json()) as Conversation;
  return json(await databaseService.updateHistory(conversation));
};

export async function DELETE({ request }: RequestEvent): Promise<Response> {
  const conversation = (await request.json()) as Conversation;
  await databaseService.deleteHistory(conversation);
  return new Response(null, { status: 204 });
};
