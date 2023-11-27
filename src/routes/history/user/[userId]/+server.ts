import { json } from '@sveltejs/kit';
import DatabaseService from '$lib/services/database-service';
import type { RequestEvent } from './$types.js';

export async function GET({ params }: RequestEvent): Promise<Response> {
  const databaseService = await new DatabaseService().init();
  return json((await databaseService.getHistory(params.userId)).reverse());
}

export async function DELETE({ params }: RequestEvent): Promise<Response> {
  const databaseService = await new DatabaseService().init();
  return json(databaseService.deleteUserHistory(params.userId));
}
