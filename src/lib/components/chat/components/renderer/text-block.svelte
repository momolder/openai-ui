<script lang="ts">
  import Dialog from '$lib/components/dialog.svelte';
  import { ConversationStore } from '$lib/services/state-management';

  export let text: string;

  let parts: { content: string; docName: string | undefined; docId: string | undefined }[] = [];
  let showDialog = false;
  let dialogHeader = '';
  let dialogContent = '';

  function prepare() {
    parts = [];
    const matches = text.matchAll(/\[doc(\d+)\]/g);

    for (const match of matches) {
      const split = text.split(match[0]);
      parts.push({ content: split[0], docName: match[0], docId: match[1] });
      text = split[1];
    }
    if (text && parts.length > 0) {
      parts.push({ content: text, docName: undefined, docId: undefined });
    }
  }

  function openDialog(docId: string | undefined) {
    if (!docId) return;
    const citation = $ConversationStore.citations.find((c) => c.id === Number.parseInt(docId));
    if (!citation) return;
    dialogHeader = citation?.title ?? '';
    dialogContent = citation?.content ?? '';
    showDialog = true;
  }

  prepare();
</script>

{#if parts.length > 0}
  {#each parts as part}
    {part.content}
    {#if part.docName}
      <button type="button" on:click={() => openDialog(part.docId)}>{part.docName}</button>
    {/if}
  {/each}
{:else}
  <slot />
{/if}
<Dialog bind:showDialog>
  <h2 slot="header">{dialogHeader}</h2>
  {dialogContent}
</Dialog>
