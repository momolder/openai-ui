<script lang="ts">
  import History from './components/history.svelte';
  import history from '$lib/assets/history.svg';
  import { lang } from '$lib/localization/translation';
  import Help from './components/help.svelte';
  import help from '$lib/assets/help.svg';
  import Settings from './components/settings.svelte';
  import settings from '$lib/assets/settings.svg';
  import SidebarSlot from './components/sidebar-slot.svelte';
  import { StateStore } from '$lib/services/state-management';
  import { onDestroy } from 'svelte';
  import user from '$lib/assets/user.svg';
  import User from './components/user.svelte';
  import NewChat from './components/new-chat.svelte';
  import { t } from '$lib/localization/translator';

  let tab: string;

  function toggle(selectedTab: typeof tab) {
    tab = tab === selectedTab ? '' : selectedTab;
  }

  const unsubscriber = StateStore.subscribe((c) => {
    tab = c.sidebarSlot;
  });

  onDestroy(unsubscriber);
</script>

<div class="cmp flex flex-col justify-between {$StateStore.sidebarSlot ? 'pr-9' : ''} md:p-2">
  <div class="cmp flex flex-col overflow-hidden">
    <NewChat showLabel={tab != ''} label={t(lang.Page.Sidebar.Clear)} />
    {#if $StateStore.useHistory}
      <SidebarSlot
        showLabel={tab != ''}
        ico={history}
        label={t(lang.Page.Sidebar.History)}
        name="history"
        isOpen={tab === 'history'}
        on:toggle={(e) => toggle(e.detail.name)}>
        <History />
      </SidebarSlot>
    {/if}
    <SidebarSlot
      showLabel={tab != ''}
      ico={settings}
      label={t(lang.Page.Sidebar.Settings)}
      name="settings"
      isOpen={tab === 'settings'}>
      <Settings />
    </SidebarSlot>
    <SidebarSlot
      showLabel={tab != ''}
      ico={help}
      label={t(lang.Page.Sidebar.Help)}
      name="help"
      isOpen={tab === 'help'}>
      <Help />
    </SidebarSlot>
  </div>
  <div class="w-full">
    <SidebarSlot
      showLabel={tab != ''}
      ico={user}
      label={t(lang.Page.Sidebar.User)}
      name="user"
      isOpen={tab === 'user'}>
      <User />
    </SidebarSlot>
  </div>
</div>
