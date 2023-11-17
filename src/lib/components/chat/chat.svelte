<script lang="ts">
  import { ConversationStore } from '$lib/services/state-management';
  import Welcome from '../welcome.svelte';
  import Input from './components/input.svelte';
  import Output from './components/output.svelte';
</script>

<div class="cmp chat-grid gap-2">
  {#if !$ConversationStore || $ConversationStore.messages.length === 0}
    <Welcome />
  {:else}
    <Output />
  {/if}
  <Input />
</div>

<style>
  .chat-grid {
    display: grid;
    grid-template-rows: 1fr auto;
  }
</style>
