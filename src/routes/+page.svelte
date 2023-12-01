<script lang="ts">
  import Header from '$lib/components/header.svelte';
  import Chat from '$lib/components/chat/chat.svelte';
  import Sidebar from '$lib/components/sidebar/sidebar.svelte';

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
  </div>
</div>
