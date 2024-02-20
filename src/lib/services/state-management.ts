import { writable } from 'svelte/store';
import { ChatMode, type Conversation, type State, type UserInformation } from '$lib/models/Contracts';

export const ConversationStore = writable<Conversation>();
export const StateStore = writable<State>({
  useMock: true,
  useHistory: false,
  autosave: false,
  version: '1',
  sidebarSlot: '',
  deployment: '',
  chatMode: ChatMode.Balanced
});
export const LanguageStore = writable<string>('en');
export const HistoryStore = writable<Conversation[]>([]);
export const UserStore = writable<UserInformation>();
export const ThemeStore = writable<string>();
export const IsOpenStore = writable<boolean>(false);
export const IsStreaming = writable<boolean>(false);
