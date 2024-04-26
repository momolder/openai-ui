import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import themingService from '$lib/services/theming-service';
import stateService from '$lib/services/state-service';
import conversationService from '$lib/services/conversation-service';
import { LanguageStore, StateStore } from '$lib/services/state-management';
import { get } from 'svelte/store';
import type { LayoutLoadEvent } from './$types';
import { getFirstAvailableLanguage } from '$lib/helper';

export const ssr = false;

if (env.PUBLIC_AppInsights_Endpoint) {
  const appInsights = new ApplicationInsights({
    config: {
      connectionString: env.PUBLIC_AppInsights_Endpoint
    }
  });

  appInsights.loadAppInsights();
  appInsights.trackPageView();
}

function adjustHeight() {
  const viewHeight = `${window.innerHeight}px`;
  const container = document.body;
  container.style.height = viewHeight;
}

export async function load(event: LayoutLoadEvent) {
  if (browser) {
    adjustHeight(); // Initial call to set the height

    window.addEventListener('resize', adjustHeight);
    window.addEventListener('orientationchange', adjustHeight);

    LanguageStore.set(getFirstAvailableLanguage());
    LanguageStore.subscribe((l) => {
      document.documentElement.setAttribute('lang', l);
      localStorage.setItem('language', l);
    });
    themingService.loadTheme();
    stateService.loadState();
    await stateService.loadUser(event.fetch);
    conversationService.newConversation();
    if (get(StateStore).useHistory) await conversationService.loadHistory(event.fetch);
  }
}
