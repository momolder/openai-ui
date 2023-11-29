import themingService from '$lib/services/theming-service';
import stateService from '$lib/services/state-service';
import conversationService from '$lib/services/conversation-service';
import { LanguageStore, StateStore } from '$lib/services/state-management';
import { get } from 'svelte/store';
import { browser } from '$app/environment';

export const ssr = false;

export async function load() {
  if (browser) {
    const language = localStorage.getItem('language') ?? get(LanguageStore);
    LanguageStore.set(language);
    LanguageStore.subscribe((l) => {
      document.documentElement.setAttribute('lang', l);
      localStorage.setItem('language', l);
    });
    themingService.loadTheme();
    stateService.loadState();
    await stateService.loadUser();
    conversationService.new();
    if (get(StateStore).useHistory) await conversationService.loadHistory();
  }
}
