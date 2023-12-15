<script lang="ts">
  import { ConversationStore } from '$lib/services/state-management';
  import Welcome from './components/welcome.svelte';
  import Input from './components/input.svelte';
  import Output from './components/output.svelte';
</script>

<div class="cmp overflow-hidden flex flex-col justify-center">
  {#if !$ConversationStore || $ConversationStore.messages.length === 0}
    <Welcome />
  {:else}
    <div class="cmp overflow-hidden flex flex-col">
      <Output />
    </div>
  {/if}

  <div class="self-center w-full md:w-2/4 mb-2">
    <Input />
  </div>
</div>
