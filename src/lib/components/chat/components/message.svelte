<script lang="ts">
  import { ChatRole, type ChatMessage } from '$lib/models/Contracts';
  import redo from '$lib/assets/redo.svg';
  import clipboard from '$lib/assets/clipboard.svg';
  import { lang } from '$lib/localization/translation';
  import conversationService from '$lib/services/conversation-service';
  import MessageRenderer from './message-renderer.svelte';
  import { copyToClipboard } from '$lib/helper';
  import { t } from '$lib/localization/translator';

  export let message: ChatMessage = {} as ChatMessage;
</script>

<div class="flex flex-col justify-stretch">
  <div class="cmp overflow-hidden p-3 whitespace-pre-wrap break-words">
    {#if message.role === ChatRole.User}
      <span class="font-bold text-lg px-[5%]">
        {t(lang.Page.Chat.Message.Role.User)}
      </span>
      <div class="cmp overflow-hidden px-[5%]">
        <p>{message.content}</p>
      </div>
    {:else}
      <span class="font-bold text-lg px-[5%]">
        {t(lang.Page.Chat.Message.Role.Agent)}
      </span>
      <div class="cmp overflow-hidden px-[5%]">
        <MessageRenderer {message} />
      </div>
    {/if}
  </div>
  {#if message.role === ChatRole.Assistant}
    <div class="px-[5%] print:hidden">
      <button
        class="btn self-start"
        type="button"
        title={t(lang.Page.Chat.Message.Copy)}
        on:click={() => copyToClipboard(message.content)}>
        <img src={clipboard} alt="redo" class="ico h-5 w-5" />
      </button>
      <button
        class="btn self-start"
        type="button"
        title={t(lang.Page.Chat.Message.Regenerate)}
        on:click={() => conversationService.regenerateMessage(message)}>
        <img src={redo} alt="redo" class="ico h-5 w-5" />
      </button>
    </div>
  {/if}
</div>
