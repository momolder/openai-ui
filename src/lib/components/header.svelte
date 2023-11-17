<script>
  import logo from '$lib/assets/logo.svg';
  import user from '$lib/assets/user.svg';
  import { lang, t } from '$lib/localization/translation';
  import Tooltip from '$lib/components/controls/tooltip.svelte';
  import { StateStore, UserStore } from '$lib/services/state-management';
</script>

<div class="cmp-raised rounded p-4 flex justify-between h-16 items-center">
  <a class="flex gap-5 items-center" data-sveltekit-reload href="/"
    ><img class="ico" src={logo} alt="logo" />
    <h1>{t(lang.Page.Header.Title)}</h1>
  </a>
  {#if $StateStore.useMock}
    <h1 class="text-warn">{t(lang.Page.Header.Mock)}</h1>
  {/if}
  <div>
    <Tooltip text={$UserStore?.displayName} testid="headerUserButtonTooltip">
      <button data-testid="headerUserButton" class="btn p-2 rounded-full" type="button">
        <img class="ico" src={user} alt="user" />
      </button>
    </Tooltip>
  </div>
</div>

<style>
</style>
