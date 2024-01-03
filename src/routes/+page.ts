import stateService from '$lib/services/state-service';
import { error } from '@sveltejs/kit';
import type { PageLoadEvent } from './$types';

export async function load({ fetch }: PageLoadEvent) {
  if (!(await stateService.validateUser(fetch))) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw error(401, 'Unauthorized...');
  }
}
