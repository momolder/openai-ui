<script lang="ts">
  import { ChatRole, type ChatMessage } from '$lib/models/Contracts';
  import SvelteMarkdown from 'svelte-markdown';

  export let message: ChatMessage = {} as ChatMessage;
</script>

  <div class="flex {message.role === ChatRole.Assistant ? '' : 'flex-row-reverse'}">
    <div
      class="rounded {message.role === ChatRole.User
        ? 'bg-light-chat-user dark:bg-dark-chat-user'
        : 'bg-light-chat-assistant dark:bg-dark-chat-assistant'}
        shadow shadow-dark-flat dark:shadow-light-flat max-w-[80%] p-3 break-words">
      <SvelteMarkdown source={message.content} />
    </div>
  </div>
