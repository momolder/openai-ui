<script lang="ts">
  import History from './components/history.svelte';
  import history from '$lib/assets/history.svg';
  import { lang, t } from '$lib/localization/translation';
  import Help from './components/help.svelte';
  import help from '$lib/assets/help.svg';
  import Settings from './components/settings.svelte';
  import settings from '$lib/assets/settings.svg';
  import SidebarSlot from './components/sidebar-slot.svelte';
  import { StateStore } from '$lib/services/state-management';

  let tab: '' | 'history' | 'help' | 'settings' = '';
  function toggle(selectedTab: typeof tab) {
    if (tab === selectedTab) tab = '';
    else tab = selectedTab;
  }
</script>

<div class="cmp-raised rounded {tab === '' ? 'w-max' : 'w-screen md:w-80'} flex flex-col">
  {#if $StateStore.useHistory}
    <SidebarSlot
      ico={history}
      label={t(lang.Page.Sidebar.History)}
      name="history"
      isOpen={tab === 'history'}
      on:toggle={(e) => toggle(e.detail.name)}>
      <History />
    </SidebarSlot>
    <div class="border-b-4 border-light-base dark:border-dark-base" />
  {/if}
  <SidebarSlot
    ico={settings}
    label={t(lang.Page.Sidebar.Settings)}
    name="settings"
    isOpen={tab === 'settings'}
    on:toggle={(e) => toggle(e.detail.name)}>
    <Settings />
  </SidebarSlot>
  <div class="border-b-4 border-light-base dark:border-dark-base" />
  <SidebarSlot
    ico={help}
    label={t(lang.Page.Sidebar.Help)}
    name="help"
    isOpen={tab === 'help'}
    on:toggle={(e) => toggle(e.detail.name)}>
    <Help />
  </SidebarSlot>
</div>
