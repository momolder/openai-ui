<script lang="ts">
  import SvelteMarkdown from 'svelte-markdown';
  import CodeBlock from './renderer/code-block.svelte';
  import List from './renderer/list.svelte';
  import Link from './renderer/link.svelte';
  import Table from './renderer/table.svelte';
  import TableCell from './renderer/table-cell.svelte';
  import TableRow from './renderer/table-row.svelte';
  import Heading from './renderer/heading.svelte';
  import Paragraph from './renderer/paragraph.svelte';
  import { sanitize } from '@jill64/universal-sanitizer';

  export let source: string;
</script>

<SvelteMarkdown
  source={sanitize(source)}
  renderers={{
    code: CodeBlock,
    list: List,
    link: Link,
    table: Table,
    tablecell: TableCell,
    tablerow: TableRow,
    heading: Heading,
    paragraph: Paragraph
  }} />
