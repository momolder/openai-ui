<script lang="ts">
  import { ChatRole, type ChatMessage } from '$lib/services/backend-api';
  import { ConversationStore } from '$lib/services/state-management';
  import { afterUpdate, onDestroy } from 'svelte';
  import Message from './message.svelte';

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

<div class="cmp overflow-y-auto" bind:this={chatOutputDiv}>
  {#each messages as message, index}
    <div data-testid="message-{index}" class="m-5"><Message {message} /></div>
  {/each}
  {#if last?.role === ChatRole.User}
    <div class="m-5"><Message isLoading /></div>
  {/if}
</div>

<style>
</style>
