<script lang="ts">
  import { ChatRole, type ChatMessage } from '$lib/models/Contracts';
  import redo from '$lib/assets/redo.svg';
  import { lang, t } from '$lib/localization/translation';
  import Tooltip from '$lib/components/controls/tooltip.svelte';
  import conversationService from '$lib/services/conversation-service';
  import MessageRenderer from './renderer/message-renderer.svelte';

  export let message: ChatMessage = {} as ChatMessage;
</script>

<div class="flex flex-col justify-stretch">
  <div class="cmp overflow-hidden p-3 whitespace-pre-wrap break-words">
    <span class="font-bold text-lg px-[5%]"
      >{message.role === ChatRole.User
        ? t(lang.Page.Chat.Message.Role.User)
        : t(lang.Page.Chat.Message.Role.Agent)}</span>
    <div class="cmp overflow-hidden px-[5%]">
      <MessageRenderer message={message} />
    </div>
  </div>
  {#if message.role === ChatRole.Assistant}
    <div class="px-[5%]">
      <Tooltip position="automatic" text={t(lang.Page.Chat.Message.Regenerate)}>
        <button
          class="btn self-start"
          type="button"
          on:click={() => conversationService.regenerateMessage(message)}>
          <img src={redo} alt="redo" class="ico h-5 w-5" />
        </button>
      </Tooltip>
    </div>
  {/if}
</div>
