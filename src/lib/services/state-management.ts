import { writable } from 'svelte/store';
import type { Conversation, State, UserInformation } from '$lib/models/Contracts';

export const ConversationStore = writable<Conversation>();
export const StateStore = writable<State>({useMock: true, useHistory: false, sidebarRight: false, autosave: false, version: "1"});
export const LanguageStore = writable<string>('en');
export const HistoryStore = writable<Conversation[]>([]);
export const UserStore = writable<UserInformation>();
