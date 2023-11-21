<script lang="ts">
  import { HistoryStore } from '$lib/services/state-management';
  import unfollow from '$lib/assets/unfollow.svg';
  import { lang, t } from '$lib/localization/translation';
  import conversationService from '$lib/services/conversation-service';
  import type { Conversation } from '$lib/models/Contracts';

  let history: Conversation[] = [];
  HistoryStore.subscribe((h) => {
    history = h;
    console.log(h);
  });

  async function deleteEntry(entry: Conversation): Promise<void> {
    await conversationService.unfollow(entry);
  }

  function loadEntry(entry: Conversation): void {
    conversationService.load(entry);
  }

  async function clearHistory(): Promise<void> {
    await conversationService.clearHistory();
  }
</script>

{#if !history || history.length === 0}
  <div data-testid="historyEmpty" class="p-2">{t(lang.Page.History.Empty)}</div>
{:else}
  <button class="btn" on:click={clearHistory}>
    <img class="ico w-7" src={unfollow} alt="clear history" />
  </button>
{/if}
{#each history as historyEntry, index}
  <div class="flex justify-between">
    <button
      data-testid="historyLoadButton-{index}"
      class="btn text-start w-full truncate"
      on:click={() => loadEntry(historyEntry)}>{historyEntry.title}</button>
    <button
      data-testid="historyUnfollowButton-{index}"
      class="btn min-w-max"
      type="button"
      on:click={async () => deleteEntry(historyEntry)}>
      <img class="ico w-7" src={unfollow} alt="remove conversation from chat" />
    </button>
  </div>
{/each}
