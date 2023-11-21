import { json } from '@sveltejs/kit';
import type { RequestEvent } from '../history/$types';

export function GET({ request }: RequestEvent): Response {
  const id = request.headers.get('X-Ms-Client-Principal-Id') ?? 'dummy';
  const displayName = request.headers.get('X-Ms-Client-Principal-Name') ?? 'dumyuser';
  return json({ id, displayName });
}
