<script lang="ts">
  import { ChatRole, type ChatMessage } from '$lib/models/Contracts';
  import SvelteMarkdown from 'svelte-markdown';

  export let message: ChatMessage = {} as ChatMessage;
  export let isLoading = false;
</script>

{#if isLoading}
  <div class="flex gap-2">
    <div class="w-2 h-2 rounded-full bounce-1 bg-light-cmp" />
    <div class="w-2 h-2 rounded-full bounce-2 bg-light-cmp" />
    <div class="w-2 h-2 rounded-full bounce-3 bg-light-cmp" />
  </div>
{:else}
  <div class="flex {message.role === ChatRole.Assistant ? '' : 'flex-row-reverse'}">
    <div
      class="rounded {message.role === ChatRole.User
        ? 'bg-light-chat-user dark:bg-dark-chat-user'
        : 'bg-light-chat-assistant dark:bg-dark-chat-assistant'} max-w-[80%] p-3">
      <SvelteMarkdown source={message.content ?? '...'}  />
    </div>
  </div>
{/if}

<style>
  @keyframes bounce {
    0%,
    100% {
      transform: translateY(-50%);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: none;
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  }
  .bounce-1 {
    animation: bounce 1s infinite;
  }
  .bounce-2 {
    animation: bounce 1s infinite;
    animation-delay: 0.3s;
  }
  .bounce-3 {
    animation: bounce 1s infinite;
    animation-delay: 5s;
  }
</style>
