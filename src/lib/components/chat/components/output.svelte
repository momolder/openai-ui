<script lang="ts">
  import { ConversationStore } from '$lib/services/state-management';
  import { afterUpdate, onDestroy } from 'svelte';
  import Message from './message.svelte';
  import { ChatRole, type ChatMessage } from '$lib/models/Contracts';

  let messages: ChatMessage[];
  let chatOutputDiv: HTMLDivElement;

  const unsubscriber = ConversationStore.subscribe((c) => {
    messages = c.messages.filter((m) => m.role === ChatRole.Assistant || m.role === ChatRole.User);
  });

  onDestroy(unsubscriber);

  afterUpdate(() => {
    if (chatOutputDiv) chatOutputDiv.scrollTop = chatOutputDiv.scrollHeight;
  });
</script>

<div class="cmp overflow-y-auto flex flex-col md:px-[22%] print:overflow-visible" bind:this={chatOutputDiv}>
  {#each messages as message (message)}
    <Message {message} />
  {/each}
</div>
