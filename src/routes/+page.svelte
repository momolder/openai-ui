<script lang="ts">
  import Header from '$lib/components/header.svelte';
  import Chat from '$lib/components/chat/chat.svelte';
  import Sidebar from '$lib/components/sidebar/sidebar.svelte';
  import chevronLeft from '$lib/assets/chevron-left.svg';
  import chevronRight from '$lib/assets/chevron-right.svg';
  import verticalLine from '$lib/assets/verticalLine.svg';
  import { StateStore } from '$lib/services/state-management';
</script>

<div class="cmp flex flex-row overflow-hidden">
  <div
    data-testid="sidebar"
    class="h-full overflow-hidden {$StateStore.sidebarSlot
      ? 'w-screen min-w-full md:w-96 md:min-w-0'
      : 'w-max'}">
    <Sidebar />
  </div>
  <div data-testid="header" class="cmp-raised overflow-hidden flex flex-col">
    <Header />
    <div data-testid="chat" class="cmp overflow-hidden">
      <Chat />
    </div>
    <div>
      <button
        class="absolute top-1/2 group right-0 {$StateStore.sidebarSlot ? 'md:right-auto' : 'right-auto'} p-1"
        type="button"
        on:click={() => ($StateStore.sidebarSlot = $StateStore.sidebarSlot === '' ? 'history' : '')}>
        <img
          class="icon h-7 w-7 group-hover:hidden dark:invert"
          src={verticalLine}
          alt="close-sidebar-icon" />
        <img
          class="icon h-7 w-7 hidden dark:invert group-hover:block"
          src={$StateStore.sidebarSlot ? chevronLeft : chevronRight}
          alt="close-sidebar-hover-icon" />
      </button>
    </div>
  </div>
</div>
