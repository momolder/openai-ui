<script lang="ts">
  import { HistoryStore, IsStreaming } from '$lib/services/state-management';
  import unfollow from '$lib/assets/recyclebin.svg';
  import download from '$lib/assets/download.svg';
  import { lang, t } from '$lib/localization/translation';
  import conversationService from '$lib/services/conversation-service';
  import type { Conversation, ChatMessage } from '$lib/models/Contracts';
  import { get } from 'svelte/store';
  import ContextMenu from '$lib/components/controls/context-menu/context-menu.svelte';
  import MenuItem from '$lib/components/controls/context-menu/components/menu-item.svelte';
  import { jsPDF } from 'jspdf';
  import { toFilesystemSafeName } from '$lib/helper';

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

  async function downloadPdf(entries: Conversation[]) {
    let doc = new jsPDF();
    doc.setLineWidth(180);
    let text = entries.flatMap((entry) => conversationToStringArray(doc, entry));

    doc.text(text, 10, 10);
    doc.save(toFilesystemSafeName(entries.length > 1 ? 'history' : entries[0].title));
  }

  function conversationToStringArray(doc: jsPDF, entry: Conversation): string[] {
    return [
      ...doc.splitTextToSize(entry.title, doc.getLineWidth()),
      '\n',
      '\n',
      ...entry.messages.flatMap((message) => messageToStringArray(doc, message))
    ];
  }

  function messageToStringArray(doc: jsPDF, message: ChatMessage): string[] {
    return [`${message.role}`, ...doc.splitTextToSize(message.content, doc.getLineWidth()), '\n'];
  }
</script>

{#if !history || history.length === 0}
  <div>{t(lang.Page.History.Empty)}</div>
{:else}
  <div class="flex items-center justify-between">
    {t(lang.Page.History.ClearAll)}
    <ContextMenu>
      <MenuItem
        text={t(lang.Page.History.DownloadPdf)}
        type="normal"
        icon={download}
        on:click={() => downloadPdf($HistoryStore)} />
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
          text={t(lang.Page.History.DownloadPdf)}
          type="normal"
          icon={download}
          on:click={() => downloadPdf([historyEntry])} />
        <MenuItem
          text={t(lang.Page.History.ClearOne)}
          type="error"
          icon={unfollow}
          on:click={() => deleteEntry(historyEntry)} />
      </ContextMenu>
    </div>
  {/each}
</div>
