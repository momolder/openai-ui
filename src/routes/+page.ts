import stateService from '$lib/services/state-service';
import { error } from '@sveltejs/kit';

export async function load() {
  if (!(await stateService.validateUser())) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw error(401, 'Unauthorized...');
  }
}
