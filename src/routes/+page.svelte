<script lang="ts">
  import Header from '$lib/components/header.svelte';
  import Chat from '$lib/components/chat/chat.svelte';
  import Sidebar from '$lib/components/sidebar/sidebar.svelte';

  let sidebarOpen = false;
</script>

<div class="page-grid p-4">
  <div class="col-span-2">
    <Header />
  </div>
  <div class="cmp p-1 {sidebarOpen ? 'w-screen col-span-2 md:w-80 md:col-span-1' : 'w-max'}">
    <Sidebar
      on:toggle={(e) => {
        console.log(e);
        sidebarOpen = e.detail.isOpen;
      }} />
  </div>
  <div class="cmp overflow-hidden {sidebarOpen ? 'collapse md:visible' : ''}">
    <Chat />
  </div>
</div>

<style>
  .page-grid {
    display: grid;
    height: 100%;
    width: 100%;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr;
  }
</style>
