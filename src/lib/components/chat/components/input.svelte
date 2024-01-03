<script lang="ts">
  import conversationService from '$lib/services/conversation-service';
  import send from '$lib/assets/send.svg';
  import wait from '$lib/assets/wait.svg';
  import { lang, t } from '$lib/localization/translation';
  import { isNullOrWhitespace } from '$lib/helper';

  let userPrompt = '';
  let processing = false;
  let textAreaHtml: HTMLTextAreaElement;

  async function sendPrompt(): Promise<void> {
    if (!processing) {
      processing = true;
      const prompt = userPrompt;
      userPrompt = '';
      await conversationService.respondTo(prompt).finally(() => {
        processing = false;
      });
    }
  }

  function cancel() {
    console.warn('not implemented...');
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
</script>

<div class="cmp flex flex-col items-center justify-center gap-2">
  <form on:submit={sendPrompt} on:reset={cancel} class="cmp">
    <div
      class="cmp p-4 flex justify-end bg-light-input dark:bg-dark-input rounded-xl border border-light-highlight dark:border-dark-highlight">
      <!-- svelte-ignore a11y-autofocus -->
      <textarea
        bind:this={textAreaHtml}
        data-testid="inputMessageInput"
        class="max-h-[200px] outline-none overflow-x-auto w-full resize-none bg-light-input dark:bg-dark-input"
        placeholder={t(lang.Page.Chat.Input.Placeholder)}
        bind:value={userPrompt}
        on:keydown={(e) => handleInput(e)}
        required
        autofocus />
      {#if processing}
        <button class="btn min-w-max" type="reset" disabled={!processing}>
          <img class="ico" src={wait} alt="wait" />
        </button>
      {:else}
        <button
          data-testid="inputSendButton"
          class="btn p-2 bg-dark-base dark:bg-light-base border border-light-cmp dark:border-dark-cmp rounded-lg"
          type="submit"
          disabled={processing || !userPrompt}>
          <img class="ico h-4 w-5 invert dark:invert-0" src={send} alt="send" />
        </button>
      {/if}
    </div>
  </form>
  <span class="text-xs md:text-sm">{t(lang.Page.Chat.Input.ChatInfo)}</span>
</div>
