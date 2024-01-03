<script lang="ts">
  import Header from '$lib/components/header.svelte';
  import Chat from '$lib/components/chat/chat.svelte';
  import Sidebar from '$lib/components/sidebar/sidebar.svelte';
  import cheronLeft from '$lib/assets/chevronLeft.svg';
  import verticalLine from '$lib/assets/verticalLine.svg';
  import { IsOpenStore } from '$lib/services/state-management';

  let sidebarOpen = false;
</script>

<div class="cmp flex flex-row overflow-hidden">
  <div class="h-full overflow-hidden {sidebarOpen ? 'w-screen min-w-full md:w-96 md:min-w-0' : 'w-max'}">
    <Sidebar
      on:toggle={(e) => {
        sidebarOpen = e.detail.isOpen;
      }} />
  </div>
  <div class="cmp-raised overflow-hidden flex flex-col">
    <Header />
    <div class="cmp overflow-hidden">
      <Chat />
    </div>
    <div>
      <button
        class="absolute top-1/2 group md:right-auto {sidebarOpen ? 'right-0 p-1' : 'hidden'}"
        type="button"
        on:click={() => ($IsOpenStore = false)}>
        <img
          class="icon h-7 w-7 {sidebarOpen ? '' : 'hidden'} group-hover:hidden dark:invert"
          src={verticalLine}
          alt="close-sidebar-icon" />
        <img
          class="icon h-7 w-7 hidden dark:invert {sidebarOpen ? 'group-hover:block' : ''}"
          src={cheronLeft}
          alt="close-sidebar-hover-icon" />
      </button>
    </div>
  </div>
</div>
