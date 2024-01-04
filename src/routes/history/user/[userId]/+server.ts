import { json } from '@sveltejs/kit';
import databaseService from '$lib/services/database-service';
import type { RequestEvent } from './$types.js';

export async function GET({ params }: RequestEvent): Promise<Response> {
  return json(await databaseService.getHistory(params.userId));
}

export function DELETE({ params }: RequestEvent): Response {
  return json(databaseService.deleteUserHistory(params.userId));
}
