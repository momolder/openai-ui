<script>
  import logo from '$lib/assets/logo.svg';
  import { lang } from '$lib/localization/translation';
  import { t } from '$lib/localization/translator';
  import { StateStore } from '$lib/services/state-management';
</script>

<div class="cmp p-4 flex h-16 items-center">
  <a class="flex gap-5 items-center" data-sveltekit-reload href="/"
    ><img class="ico h-14 w-14" src={logo} alt="logo" />
  </a>
  {#if $StateStore.useMock}
    <h1 class="cmp text-warn flex justify-center">{t(lang.Page.Header.Mock)}</h1>
  {/if}
</div>
