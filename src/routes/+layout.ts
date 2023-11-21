import themingService from '$lib/services/theming-service';
import stateService from '$lib/services/state-service';
import conversationService from '$lib/services/conversation-service';
import { LanguageStore, StateStore } from '$lib/services/state-management';
import { get } from 'svelte/store';
import { browser } from '$app/environment';

export const ssr = false;

export async function load() {
  if (browser) {
    let language = localStorage.getItem('language') ?? get(LanguageStore);
    LanguageStore.set(language);
    LanguageStore.subscribe((l) => {
      document.documentElement.setAttribute('lang', l);
      localStorage.setItem('language', l);
    });
    themingService.loadTheme();
    await stateService.loadState();
    await stateService.loadUser();
    conversationService.clear();
    if (get(StateStore).useHistory === true) await conversationService.loadHistory();
  }
}
