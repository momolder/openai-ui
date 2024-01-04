<script lang="ts">
  import Dialog from '$lib/components/dialog.svelte';
  import { ChatRole, type ChatMessage, type ToolMessage } from '$lib/models/Contracts';
  import SvelteMarkdown from 'svelte-markdown';
  import CodeBlock from './code-block.svelte';
  import List from './list.svelte';
  import NoParagraph from './no-paragraph.svelte';

  export let message: ChatMessage;

  const citations = message.context?.messages
    .filter((m) => m.role === ChatRole.Tool)
    .flatMap((m) => JSON.parse(m.content) as ToolMessage[])
    .flatMap((m) => m.citations);

  let parts: { content: string; docName: string | undefined; docId: string | undefined }[] = [];
  let showDialog = false;
  let dialogHeader = '';
  let dialogContent = '';
  let downloadLink = '';

  function prepare() {
    parts = [];
    const matches = message.content.matchAll(/\[doc(\d+)\]/g);
    let text = message.content;

    for (const match of matches) {
      const split = text.split(match[0]);
      parts.push({
        content: split[0],
        docName: `[${citations?.at(Number.parseInt(match[1]) - 1)?.title}]`,
        docId: match[1]
      });
      text = split[1];
    }
    if (text && parts.length > 0) {
      parts.push({ content: text, docName: undefined, docId: undefined });
    }
  }

  function openDialog(docId: string | undefined) {
    if (!docId) return;
    const citation = citations?.at(Number.parseInt(docId) - 1);
    if (!citation) return;
    dialogHeader = citation?.title ?? '';
    dialogContent = citation?.content ?? '';
    downloadLink = citation?.url ?? '';
    showDialog = true;
  }

  prepare();
</script>

{#if parts.length > 0}
  <p>
    {#each parts as part}
      <SvelteMarkdown
        source={part.content}
        renderers={{ code: CodeBlock, list: List, paragraph: NoParagraph }} />
      {#if part.docName}
        <button type="button" on:click={() => openDialog(part.docId)}>{part.docName}</button>
      {/if}
    {/each}
  </p>
{:else}
  <SvelteMarkdown source={message.content} renderers={{ code: CodeBlock, list: List }} />
{/if}

<Dialog bind:showDialog>
  <div slot="header">
    <h2>{dialogHeader}</h2>
  </div>
  {dialogContent}
</Dialog>
