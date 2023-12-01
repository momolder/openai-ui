<script lang="ts">
  import { ChatRole, type ChatMessage } from '$lib/models/Contracts';
  import SvelteMarkdown from 'svelte-markdown';
  import CodeBlock from './code-block.svelte';

  export let message: ChatMessage = {} as ChatMessage;
</script>

<div class="flex">
  <div
    class="cmp overflow-hidden p-3 whitespace-pre-wrap break-words">
        <span class="font-bold text-lg">{message.role === ChatRole.User ? 'You' : 'Bot'}</span>
        <div class="cmp overflow-hidden">
    <SvelteMarkdown source={message.content} renderers={{ code: CodeBlock }} />
  </div>
  </div>
</div>
