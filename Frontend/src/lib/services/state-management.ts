import { writable } from 'svelte/store';
import type { State } from '$lib/models/state';
import type { Conversation, UserInformation } from './backend-api';

export const ConversationStore = writable<Conversation>();
export const StateStore = writable<State>();
export const LanguageStore = writable<string>('en');
export const HistoryStore = writable<Conversation[]>([]);
export const UserStore = writable<UserInformation>();
