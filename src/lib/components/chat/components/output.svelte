<script lang="ts">
  import { ConversationStore } from '$lib/services/state-management';
  import { afterUpdate, onDestroy } from 'svelte';
  import Message from './message.svelte';
  import type { ChatMessage } from '$lib/models/Contracts';

  let messages: ChatMessage[];
  let last: ChatMessage | undefined;
  let chatOutputDiv: HTMLDivElement;

  const unsubscriber = ConversationStore.subscribe((c) => {
    messages = c.messages;
    last = c.messages.at(-1);
  });

  onDestroy(unsubscriber);

  afterUpdate(() => {
    if (chatOutputDiv) chatOutputDiv.scrollTop = chatOutputDiv.scrollHeight;
  });
</script>

<div class="cmp overflow-y-auto flex flex-col md:px-[25%]" bind:this={chatOutputDiv}>
  {#each messages as message, index}
    <Message {message} />
  {/each}
</div>
