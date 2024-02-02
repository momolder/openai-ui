<script lang="ts">
  import { HistoryStore, IsStreaming } from '$lib/services/state-management';
  import unfollow from '$lib/assets/unfollow.svg';
  import { lang, t } from '$lib/localization/translation';
  import conversationService from '$lib/services/conversation-service';
  import type { Conversation } from '$lib/models/Contracts';
  import { get } from 'svelte/store';
  import ContextMenu from '$lib/components/controls/context-menu/context-menu.svelte';
  import MenuItem from '$lib/components/controls/context-menu/components/menu-item.svelte';

  let history: Conversation[] = [];
  HistoryStore.subscribe((h) => (history = h));

  async function deleteEntry(entry: Conversation): Promise<void> {
    await conversationService.unfollow(entry);
  }

  function loadEntry(entry: Conversation): void {
    if (get(IsStreaming)) {
      conversationService.cancel();
    }
    conversationService.loadConversation(entry);
  }

  async function clearHistory(): Promise<void> {
    await conversationService.clearHistory();
  }
</script>

{#if !history || history.length === 0}
  <div>{t(lang.Page.History.Empty)}</div>
{:else}
  <div class="flex items-center justify-between">
    {t(lang.Page.History.ClearAll)}
    <ContextMenu>
      <MenuItem text={t(lang.Page.History.ClearAll)} type="error" icon={unfollow} on:click={clearHistory} />
    </ContextMenu>
  </div>
{/if}
<div class="cmp">
  {#each history as historyEntry}
    <div class="flex justify-between gap-2">
      <button class="btn text-start w-full truncate" on:click={() => loadEntry(historyEntry)}
        >{historyEntry.title}</button>
      <ContextMenu>
        <MenuItem
          text={t(lang.Page.History.ClearOne)}
          type="error"
          icon={unfollow}
          on:click={() => deleteEntry(historyEntry)} />
      </ContextMenu>
    </div>
  {/each}
</div>
