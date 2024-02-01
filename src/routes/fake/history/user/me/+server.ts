import { json } from '@sveltejs/kit';
import { fakeHistory } from '../../history-cache';
import { get } from 'svelte/store';

export function GET(): Response {
  return json(get(fakeHistory));
}

export function DELETE(): Response {
  fakeHistory.set([]);
  return json('');
}
