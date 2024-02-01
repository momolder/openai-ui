import type { Conversation } from '$lib/models/Contracts';
import { writable } from 'svelte/store';

export const fakeHistory = writable<Conversation[]>([]);
