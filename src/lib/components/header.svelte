<script>
  import logo from '$lib/assets/logo.svg';
  import { lang, t } from '$lib/localization/translation';
  import { StateStore } from '$lib/services/state-management';
</script>

<div class="cmp p-4 flex h-16 items-center">
  <a class="flex gap-5 items-center" data-sveltekit-reload href="/"
    ><img class="ico h-14 w-14" src={logo} alt="logo" />
  </a>
  {#if $StateStore.useMock}
    <h1 class="text-warn">{t(lang.Page.Header.Mock)}</h1>
  {/if}
</div>
