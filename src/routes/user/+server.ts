import { json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { constants } from '$lib/constants';

export function GET({ request }: RequestEvent): Response {
  const id = request.headers.get(constants.principalId) ?? constants.testUserId;
  const displayName = request.headers.get(constants.principalName) ?? constants.testUserName;
  return json({ id, displayName });
}
