<script lang="ts">
  import History from './components/history.svelte';
  import history from '$lib/assets/history.svg';
  import { lang, t } from '$lib/localization/translation';
  import Help from './components/help.svelte';
  import help from '$lib/assets/help.svg';
  import Settings from './components/settings.svelte';
  import settings from '$lib/assets/settings.svg';
  import SidebarSlot from './components/sidebar-slot.svelte';
  import { StateStore, IsOpenStore } from '$lib/services/state-management';
  import { createEventDispatcher, onDestroy } from 'svelte';
  import user from '$lib/assets/user.svg';
  import User from './components/user.svelte';
  import NewChat from './components/new-chat.svelte';

  const dispatch = createEventDispatcher();
  let tab: '' | 'history' | 'help' | 'settings' | 'user' | 'clear' = '';

  function toggle(selectedTab: typeof tab) {
    if (tab === selectedTab) tab = '';
    else tab = selectedTab;
    dispatch('toggle', { isOpen: tab != '' });
  }

  const unsubscriber = IsOpenStore.subscribe((c) => {
    if (!c) {
      toggle('');
    }
  });

  onDestroy(unsubscriber);
</script>

<div data-testid="sidebar" class="cmp flex flex-col justify-between {$IsOpenStore ? 'pr-9' : ''} md:p-2">
  <div class="cmp flex flex-col overflow-hidden">
    <NewChat showLabel={tab != ''} />
    <!-- <SidebarSlot
        ico={clear}
        label={t(lang.Page.Sidebar.Clear)}
        name="clear"
        isOpen={tab === 'clear'}
        on:toggle={(e) => toggle(e.detail.name)}>
      </SidebarSlot> -->
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
      isOpen={tab === 'settings'}
      on:toggle={(e) => toggle(e.detail.name)}>
      <Settings />
    </SidebarSlot>
    <SidebarSlot
      showLabel={tab != ''}
      ico={help}
      label={t(lang.Page.Sidebar.Help)}
      name="help"
      isOpen={tab === 'help'}
      on:toggle={(e) => toggle(e.detail.name)}>
      <Help />
    </SidebarSlot>
  </div>
  <div class="w-full">
    <SidebarSlot
      showLabel={tab != ''}
      ico={user}
      label={t(lang.Page.Sidebar.User)}
      name="user"
      isOpen={tab === 'user'}
      on:toggle={(e) => toggle(e.detail.name)}>
      <User />
    </SidebarSlot>
  </div>
</div>
