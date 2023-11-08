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
  import historyService from '$lib/services/history-service';
  import { onDestroy } from 'svelte';

  let userPrompt: '';
  let processing = false;
  let hasConversation = false;

  const unsubscriber = ConversationStore.subscribe((c) => {
    hasConversation = !c || c.messages.length > 0;
  });

  onDestroy(unsubscriber);

  async function sendPrompt(): Promise<void> {
    if (!processing) {
      processing = true;
      const prompt = userPrompt;
      userPrompt = '';

      await conversationService.getResponse(prompt).finally(() => (processing = false));
    }
  }

  function cancel() {
    console.warn('not implemented...');
  }

  function follow() {
    historyService.follow();
  }
  function unfollow() {
    historyService.unfollow($ConversationStore);
  }

  function clearChat() {
    conversationService.clear();
  }
</script>

<form on:submit={sendPrompt} on:reset={cancel}>
  <div class="cmp-raised rounded flex flex-wrap md:flex-nowrap">
    <div class="flex flex-nowrap w-full">
      <!-- svelte-ignore a11y-autofocus -->
      <input
        data-testid="inputMessageInput"
        class="outline-none w-full h-14 px-2 bg-light-input dark:bg-dark-input"
        placeholder={t(lang.Page.Chat.Input.Placeholder)}
        type="text"
        bind:value={userPrompt}
        required
        autofocus />
    </div>
    <div class="flex">
      <Tooltip text={t(lang.Page.Tooltip.Chat.Actions.Clean)}>
        <button
          data-testid="inputClearButton"
          class="btn min-w-max"
          type="button"
          disabled={!hasConversation || processing}
          on:click={clearChat}>
          <img class="ico" src={clear} alt="clear chat" />
        </button>
      </Tooltip>
      {#if $StateStore.useHistory}
        {#if $ConversationStore && $ConversationStore.isFollowed}
          <Tooltip text={t(lang.Page.Tooltip.Chat.Actions.Unfollow)}>
            <button
              class="btn min-w-max disabled:cursor-not-allowed"
              type="button"
              disabled={!hasConversation || processing}
              on:click={unfollow}>
              <img class="ico" src={unfollowImg} alt="unfollow chat" />
            </button>
          </Tooltip>
        {:else}
          <Tooltip text={t(lang.Page.Tooltip.Chat.Actions.Follow)}>
            <button
              data-testid="inputFollowButton"
              class="btn min-w-max disabled:cursor-not-allowed"
              type="button"
              disabled={!hasConversation || processing}
              on:click={follow}>
              <img class="ico" src={followImg} alt="follow chat" />
            </button>
          </Tooltip>
        {/if}
      {/if}
      {#if processing}
        <button class="btn min-w-max" type="reset" disabled={!processing}>
          <img class="ico" src={wait} alt="wait" />
        </button>
      {:else}
        <Tooltip text={t(lang.Page.Tooltip.Chat.Actions.Send)}>
          <button data-testid="inputSendButton" class="btn min-w-max" type="submit" disabled={processing || !userPrompt}>
            <img class="ico" src={send} alt="send" />
          </button>
        </Tooltip>
      {/if}
    </div>
  </div>
</form>
