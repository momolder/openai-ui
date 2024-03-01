<script lang="ts">
  import conversationService from '$lib/services/conversation-service';
  import send from '$lib/assets/send.svg';
  import wait from '$lib/assets/wait.svg';
  import { lang } from '$lib/localization/translation';
  import { isNullOrWhitespace } from '$lib/helper';
  import { onDestroy } from 'svelte';
  import { IsStreaming, ConversationStore } from '$lib/services/state-management';
  import Switch from '$lib/components/controls/switch.svelte';
  import stateService from '$lib/services/state-service';
  import { t } from '$lib/localization/translator';

  let userPrompt = '';
  let textAreaHtml: HTMLTextAreaElement;
  let streaming = false;
  const unsubscriber = IsStreaming.subscribe((s) => (streaming = s));

  async function sendPrompt(): Promise<void> {
    if (!streaming) {
      const prompt = userPrompt;
      userPrompt = '';
      await conversationService.respondTo(prompt);
    }
  }

  function cancel() {
    conversationService.cancel();
  }

  async function handleInput(event: KeyboardEvent) {
    if (event.code === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (isNullOrWhitespace(userPrompt)) {
        return;
      }
      await sendPrompt();
    }
  }

  onDestroy(unsubscriber);
</script>

<div class="cmp flex flex-col items-center justify-center gap-2">
  {#if stateService.useDocumentSearch()}
    <div class="cmp flex justify-end">
      <Switch
        label={t(lang.Page.Chat.Input.UseDocumentSearch)}
        on:click={() => ($ConversationStore.useDocumentSearch = !$ConversationStore.useDocumentSearch)}
        value={$ConversationStore.useDocumentSearch}
        size="s" />
    </div>
  {/if}
  <form on:submit={sendPrompt} on:reset={cancel} class="cmp">
    <div
      class="cmp p-4 flex justify-end bg-light-input dark:bg-dark-input rounded-xl border border-light-highlight dark:border-dark-highlight">
      <!-- svelte-ignore a11y-autofocus -->
      <div class="cmp">
      <textarea
        data-testid="chat-input"
        maxlength={2000}
        bind:this={textAreaHtml}
        class="max-h-[200px] outline-none overflow-x-auto w-full resize-none bg-light-input dark:bg-dark-input"
        placeholder={t(lang.Page.Chat.Input.Placeholder)}
        bind:value={userPrompt}
        on:keydown={(e) => handleInput(e)}
        required
        autofocus />
        <label for={textAreaHtml?.name} class="flex justify-end text-xs">{userPrompt.length}/{textAreaHtml?.maxLength}</label>
      </div>
      {#if streaming}
        <button class="btn min-w-max" type="reset" disabled={!streaming}>
          <img class="ico" src={wait} alt="wait" />
        </button>
      {:else}
        <button
          class="btn p-2 bg-dark-cmp dark:bg-light-cmp border border-light-base dark:border-dark-base rounded-lg"
          type="submit"
          disabled={streaming || !userPrompt}>
          <img class="ico h-4 w-5 invert dark:invert-0" src={send} alt="send" />
        </button>
      {/if}
    </div>
  </form>
  <span class="text-xs md:text-sm">{t(lang.Page.Chat.Input.ChatInfo)}</span>
</div>
