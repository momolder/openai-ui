<script lang="ts">
  import '../app.css';
  import { SvelteToast } from '@zerodevx/svelte-toast';
  import themingService from '$lib/services/theming-service';
  import stateService from '$lib/services/state-service';
  import historyService from '$lib/services/history-service';
  import { LanguageStore } from '$lib/services/state-management';
  import { onDestroy } from 'svelte';
  import conversationService from '$lib/services/conversation-service';

  init();

  let language = localStorage.getItem('language') ?? $LanguageStore;
  $LanguageStore = language;
  const unsubscriber = LanguageStore.subscribe((l) => {
    document.documentElement.setAttribute('lang', l);
    localStorage.setItem('language', l);
  });

  async function init() {
    themingService.loadTheme();
    await stateService.loadState();
    await stateService
      .loadUser()
      .then(conversationService.clear)
      .then(stateService.getConfiguration)
      .then((c) => (c?.useHistory === true ? historyService.loadHistory() : {}));
  }

  const toastOptions = {
    dismissable: true,
    duration: 5000
  };

  onDestroy(unsubscriber);
</script>

<slot />
<SvelteToast options={toastOptions} />
