<script lang="ts">
  import conversationService from '$lib/services/conversation-service';
  import send from '$lib/assets/send.svg';
  import wait from '$lib/assets/wait.svg';
  import clear from '$lib/assets/clear.svg';
  import followImg from '$lib/assets/follow.svg';
  import unfollowImg from '$lib/assets/unfollow.svg';
  import { lang, t } from '$lib/localization/translation';
  import { ConversationStore, StateStore } from '$lib/services/state-management';
  import Tooltip from '$lib/components/controls/tooltip.svelte';
  import { onDestroy } from 'svelte';
  import { isNullOrWhitespace } from '$lib/helper';
  import { text } from '@sveltejs/kit';

  let userPrompt = '';
  let processing = false;
  let hasConversation = false;
  let textAreaHtml: HTMLTextAreaElement;

  const unsubscriber = ConversationStore.subscribe((c) => {
    hasConversation = !c || c.messages.length > 0;
  });

  onDestroy(unsubscriber);

  async function sendPrompt(): Promise<void> {
    if (!processing) {
      processing = true;
      const prompt = userPrompt;
      userPrompt = '';
      await conversationService.getResponse(prompt).finally(() => {
        processing = false;
      });
    }
  }

  function cancel() {
    console.warn('not implemented...');
  }

  function follow() {
    conversationService.follow();
  }
  function unfollow() {
    conversationService.unfollow($ConversationStore);
  }

  function clearChat() {
    conversationService.new();
  }

  async function handleInput(event: KeyboardEvent) {
    // ResizeTextArea(); // todo fix
    if (event.code === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (isNullOrWhitespace(userPrompt)) {
        return;
      }
      await sendPrompt();
    }
  }

  function ResizeTextArea() {
    const currentHeight = Number.parseInt(textAreaHtml.style.height.replace("px", ''));
    const scrollHeight = textAreaHtml?.scrollHeight;
    const maxHeight = 200;
    const minHeight = 52;
    const isScrollable = scrollHeight > minHeight;

    if(isScrollable && currentHeight < scrollHeight) {
      console.log("isScrollable && currentHeight < scrollHeight");
      textAreaHtml.style.height = `${scrollHeight}px`;
    }
    if(!isScrollable) {
      console.log("!isScrollable");
      textAreaHtml.style.height = `${minHeight}px`;
    }
  }
</script>

<div class="cmp flex flex-col items-center justify-center gap-2">
  <form on:submit={sendPrompt} on:reset={cancel} class="cmp">
    <div class="cmp p-4 flex justify-end bg-light-input dark:bg-dark-input rounded-xl border border-light-highlight dark:border-dark-highlight">
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
        <button data-testid="inputSendButton" class="btn p-2 bg-dark-base dark:bg-light-base border border-light-cmp dark:border-dark-cmp rounded-lg" type="submit" disabled={processing || !userPrompt}>
          <img class="ico h-4 w-5 invert dark:invert-0" src={send} alt="send" />
        </button>
      {/if}
    </div>
  </form>

  <!-- <div class="flex flex-col pl-2">
    <Tooltip text={t(lang.Page.Tooltip.Chat.Actions.Clean)} position="top">
      <button
        data-testid="inputClearButton"
        class="btn"
        type="button"
        disabled={!hasConversation || processing}
        on:click={clearChat}>
        <img class="ico" src={clear} alt="clear chat" />
      </button>
    </Tooltip>
    {#if $StateStore.useHistory}
      {#if $ConversationStore && $ConversationStore.isFollowed}
        <Tooltip text={t(lang.Page.Tooltip.Chat.Actions.Unfollow)} position="top">
          <button
            class="btn p-1 disabled:cursor-not-allowed"
            type="button"
            disabled={!hasConversation || processing}
            on:click={unfollow}>
            <img class="ico" src={unfollowImg} alt="unfollow chat" />
          </button>
        </Tooltip>
      {:else}
        <Tooltip text={t(lang.Page.Tooltip.Chat.Actions.Follow)} position="top">
          <button
            data-testid="inputFollowButton"
            class="btn p-1 disabled:cursor-not-allowed"
            type="button"
            disabled={!hasConversation || processing}
            on:click={follow}>
            <img class="ico" src={followImg} alt="follow chat" />
          </button>
        </Tooltip>
      {/if}
    {/if}
  </div> -->
  <span class="text-xs md:text-sm">{t(lang.Page.Chat.Input.ChatInfo)}</span>
</div>
