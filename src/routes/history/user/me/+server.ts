import { json } from '@sveltejs/kit';
import DatabaseService from '$lib/services/database-service';
import type { RequestEvent } from './$types.js';
import { constants } from '$lib/constants.js';

export async function GET({ request }: RequestEvent): Promise<Response> {
  const databaseService = await new DatabaseService().init();
  const requestingUser = request.headers.get(constants.principalId) ?? constants.testUserId;
  return json(await databaseService.getHistory(requestingUser));
}

export async function DELETE({ request }: RequestEvent): Promise<Response> {
  const databaseService = await new DatabaseService().init();
  const requestingUser = request.headers.get(constants.principalId) ?? constants.testUserId;
  return json(databaseService.deleteUserHistory(requestingUser));
}
