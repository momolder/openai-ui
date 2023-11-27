import stateService from '$lib/services/state-service';
import { error } from '@sveltejs/kit';

export async function load() {
  if(!(await stateService.validateUser())) {
    throw error(401, 'Unauthorized...')
  }
}
