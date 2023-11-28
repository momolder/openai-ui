<script lang="ts">
  import { ConversationStore } from '$lib/services/state-management';
  import Welcome from '../welcome.svelte';
  import Input from './components/input.svelte';
  import Output from './components/output.svelte';
</script>

<div class="cmp gap-2 overflow-hidden flex justify-center">
  {#if !$ConversationStore || $ConversationStore.messages.length === 0}
    <Welcome />
  {:else}
    <div class="cmp-raised overflow-hidden flex flex-col">
      <Output bottomGapClass="h-24" />
    </div>
  {/if}
  <div class="w-2/4 absolute self-end mb-4">
    <Input />
  </div>
</div>
