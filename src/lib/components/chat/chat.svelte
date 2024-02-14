<script lang="ts">
  import { ConversationStore } from '$lib/services/state-management';
  import Welcome from './components/welcome.svelte';
  import Input from './components/input.svelte';
  import Output from './components/output.svelte';
</script>

<div class="cmp overflow-hidden flex flex-col justify-center print:overflow-visible">
  {#if !$ConversationStore || $ConversationStore.messages.length === 0}
    <Welcome />
  {:else}
    <div class="cmp overflow-hidden flex flex-col print:overflow-visible">
      <Output />
    </div>
  {/if}

  <div class="grow self-center w-full md:w-2/4 mb-2 print:hidden">
    <Input />
  </div>
</div>
