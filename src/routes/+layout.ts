import themingService from '$lib/services/theming-service';
import stateService from '$lib/services/state-service';
import conversationService from '$lib/services/conversation-service';
import { LanguageStore, StateStore } from '$lib/services/state-management';
import { get } from 'svelte/store';
import { browser } from '$app/environment';

export const ssr = false;
function adjustHeight() {
  const viewHeight = window.innerHeight + 'px';
  const container = document.body;
  container.style.height = viewHeight;
}

export async function load() {
  if (browser) {
    adjustHeight(); // Initial call to set the height

    window.addEventListener('resize', adjustHeight);
    window.addEventListener('orientationchange', adjustHeight);

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
