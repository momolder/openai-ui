<script lang="ts">
  import Dialog from '$lib/components/dialog.svelte';
  import { ChatRole, type ChatMessage, type ToolMessage } from '$lib/models/Contracts';
  import Markdown from '$lib/components/controls/markdown/markdown.svelte';

  export let message: ChatMessage;
  interface Part {
    content: string;
    docName: string | undefined;
    docId: string | undefined;
  }

  const citations = message.context?.messages
    .filter((m) => m.role === ChatRole.Tool)
    .flatMap((m) => JSON.parse(m.content) as ToolMessage[])
    .flatMap((m) => m.citations);

  let parts: Part[] = [];
  let showDialog = false;
  let dialogHeader = '';
  let dialogContent = '';

  function prepare() {
    try {
      parts = [];
      const matches = message.content.matchAll(/\[doc(\d+)\]/g);
      let text = message.content;

      for (const match of matches) {
        const split = text.split(match[0]);
        parts.push({
          content: split[0],
          docName: `${citations?.at(Number.parseInt(match[1]) - 1)?.title}`,
          docId: match[1]
        });
        text = split.slice(1).join(match[0]);
      }
      if (text && parts.length > 0) {
        parts.push({ content: text, docName: undefined, docId: undefined });
      }
    } catch (e) {
      console.warn(
        'updating the citations failed. Links are not generated, but the message is still displayed correctly.'
      );
      console.error(e);
      parts = [];
    }
  }

  function openDialog(docId: string | undefined) {
    if (!docId) return;
    const citation = citations?.at(Number.parseInt(docId) - 1);
    if (!citation) return;
    dialogHeader = citation?.title ?? '';
    dialogContent = citation?.content ?? '';
    showDialog = true;
  }

  function distinct(parts: Part[]): Part[] {
    return parts
      .filter((value, index, array) => array.findIndex((part) => part.docId === value.docId) === index)
      .filter((part) => part.docId !== undefined);
  }

  prepare();
</script>

{#if parts.length > 0}
  <Markdown source={parts.map((p) => (p.docId ? `${p.content} [${p.docId}]` : p.content)).join('')} />
  <hr />
  {#each distinct(parts) as part}
    <div>
      <button type="button" on:click={() => openDialog(part?.docId)}>[{part?.docId}] {part?.docName}</button>
    </div>
  {/each}
{:else}
  <Markdown source={message.content} />
{/if}

<Dialog bind:showDialog>
  <div slot="header">
    <h2>{dialogHeader}</h2>
  </div>
  {dialogContent}
</Dialog>
