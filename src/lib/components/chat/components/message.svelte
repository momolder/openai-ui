<script lang="ts">
  import { ChatRole, type ChatMessage } from '$lib/models/Contracts';
  import SvelteMarkdown from 'svelte-markdown';
  import CodeBlock from './code-block.svelte';
  import history from '$lib/assets/history.svg';
  import List from './list.svelte';

  export let message: ChatMessage = {} as ChatMessage;
</script>

<div class="flex flex-col justify-stretch">
  <div class="cmp overflow-hidden p-3 whitespace-pre-wrap break-words">
    <span class="font-bold text-lg px-[5%]">{message.role === ChatRole.User ? 'You' : 'Bot'}</span>
    <div class="cmp overflow-hidden px-[5%]">
      <SvelteMarkdown source={message.content} renderers={{ code: CodeBlock, list: List }} />
    </div>
  </div>
  {#if message.role === ChatRole.Assistant}
    <div class="px-[5%]">
      <button class="btn self-start" type="button">
        <img src={history} alt="regenerate" class="ico h-4 w-4" />
      </button>
    </div>
  {/if}
</div>
