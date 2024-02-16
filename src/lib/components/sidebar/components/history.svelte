<script lang="ts">
  import { HistoryStore, IsStreaming } from '$lib/services/state-management';
  import unfollow from '$lib/assets/recyclebin.svg';
  import download from '$lib/assets/download.svg';
  import clear from '$lib/assets/clear.svg';
  import { lang, t } from '$lib/localization/translation';
  import conversationService from '$lib/services/conversation-service';
  import type { Conversation } from '$lib/models/Contracts';
  import { get } from 'svelte/store';
  import ContextMenu from '$lib/components/controls/context-menu/context-menu.svelte';
  import MenuItem from '$lib/components/controls/context-menu/components/menu-item.svelte';
  import { MessageBoxStore, showMessageBox } from '$lib/components/controls/message-box/message-box';

  let history: Conversation[] = [];
  HistoryStore.subscribe((h) => (history = h));

  async function deleteEntry(entry: Conversation): Promise<void> {
    if (
      (await showMessageBox(
        'warning',
        t(lang.Page.History.QuestionClearOne),
        t(lang.Page.History.ClearOne)
      )) === true
    )
      await conversationService.unfollow(entry);
  }

  function loadEntry(entry: Conversation): void {
    if (get(IsStreaming)) {
      conversationService.cancel();
    }
    conversationService.loadConversation(entry);
  }

  async function clearHistory(): Promise<void> {
    if (
      (await showMessageBox(
        'warning',
        t(lang.Page.History.QuestionClearAll),
        t(lang.Page.History.ClearAll)
      )) === true
    )
      await conversationService.clearHistory();
  }

  function downloadJson(entries: Conversation[]) {
    const json = entries.map((e) => {
      return {
        date: new Date(e.date).toLocaleString(),
        title: e.title.substring(0, 30) + '...',
        message: e.messages.map((m) => {
          return { role: m.role, content: m.content };
        })
      };
    });
    var a = document.createElement('a');
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(json, undefined, 2));
    a.download = 'history.json';
    document.body.append(a);
    a.click();
    a.remove();
  }

  async function rename(entry: Conversation) {
    if (
      (await showMessageBox('info', '', t(lang.Page.History.Rename), undefined, undefined, undefined, {
        type: 'text',
        placeholder: entry.title
      })) === true
    ) {
      await conversationService.renameConversation(entry, $MessageBoxStore.input?.value ?? entry.title);
    }
  }

  // function downloadHtml(entries: Conversation[]) {
  //   let result = '';
  //   entries.forEach((e) => {
  //     result += '\n\n**' + new Date(e.date).toDateString() + '**';
  //     e.messages.forEach((m) => {
  //       result += '\n\n**' + m.role + '**\n\n';
  //       result += m.content;
  //     });
  //   });
  //   const html = marked.parse(result);
  //   var a = document.createElement('a');
  //   a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(html.toString());
  //   a.download = 'history.html';
  //   document.body.append(a);
  //   a.click();
  //   a.remove();
  // }

  // async function downloadPdf(entries: Conversation[]) {
  //   let doc = new jsPDF();
  //   doc.setLineWidth(180);
  //   let text = entries.flatMap((entry) => conversationToStringArray(doc, entry));

  //   doc.text(text, 10, 10);
  //   doc.save(toFilesystemSafeName('history'));
  // }

  // function conversationToStringArray(doc: jsPDF, entry: Conversation): string[] {
  //   return [
  //     ...doc.splitTextToSize(entry.title, doc.getLineWidth()),
  //     '\n',
  //     '\n',
  //     ...entry.messages.flatMap((message) => messageToStringArray(doc, message))
  //   ];
  // }

  // function messageToStringArray(doc: jsPDF, message: ChatMessage): string[] {
  //   return [`${message.role}`, ...doc.splitTextToSize(message.content, doc.getLineWidth()), '\n'];
  // }
</script>

{#if !history || history.length === 0}
  <div>{t(lang.Page.History.Empty)}</div>
{:else}
  <div class="flex items-center justify-between">
    {t(lang.Page.History.AllHistoryEntries)}
    <ContextMenu>
      <MenuItem
        text={t(lang.Page.History.DownloadJson)}
        type="normal"
        icon={download}
        on:click={() => downloadJson($HistoryStore)} />
      <MenuItem text={t(lang.Page.History.ClearAll)} type="error" icon={unfollow} on:click={clearHistory} />
    </ContextMenu>
  </div>
{/if}

{#each history as historyEntry}
  <div class="flex justify-between gap-2">
    <button class="btn text-start w-full truncate" on:click={() => loadEntry(historyEntry)}
      >{historyEntry.title}</button>
    <ContextMenu>
      <MenuItem
        text={t(lang.Page.History.Rename)}
        type="normal"
        icon={clear}
        on:click={() => rename(historyEntry)} />
      <MenuItem
        text={t(lang.Page.History.DownloadJson)}
        type="normal"
        icon={download}
        on:click={() => downloadJson([historyEntry])} />
      <MenuItem
        text={t(lang.Page.History.ClearOne)}
        type="error"
        icon={unfollow}
        on:click={() => deleteEntry(historyEntry)} />
    </ContextMenu>
  </div>
{/each}
