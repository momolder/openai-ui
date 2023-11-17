<script lang="ts">
  import Header from '$lib/components/header.svelte';
  import Sidebar from '$lib/components/sidebar/sidebar.svelte';
  import Chat from '$lib/components/chat/chat.svelte';
  import { StateStore } from '$lib/services/state-management';
</script>

<div class="cmp flex flex-col gap-2">
  <Header />
  <div class="cmp flex gap-2 {$StateStore.sidebarRight ? 'flex-row-reverse' : 'flex-row'}">
    <div class="min-w-fit">
      <Sidebar />
    </div>
    <Chat />
  </div>
</div>
