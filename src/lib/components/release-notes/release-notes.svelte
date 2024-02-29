<script lang="ts">
  import { lang } from '$lib/localization/translation';
  import { LanguageStore, StateStore } from '$lib/services/state-management';
  import { t } from '$lib/localization/translator';
  import SvelteMarkdown from 'svelte-markdown';
  import CodeBlock from '../chat/components/renderer/code-block.svelte';
  import List from '../chat/components/renderer/list.svelte';
  import Link from '../chat/components/renderer/link.svelte';
  import releaseNotesDe from './release-notes.de.md?raw';
  import releaseNotesEn from './release-notes.en.md?raw';
</script>

<div class="p-2">
  <h2>{`${t(lang.Page.Help.ReleaseNotes)} ${t(lang.Page.Help.Version)}: ${$StateStore.version}`}</h2>
</div>
<hr />
<div class="p-6">
  <SvelteMarkdown
    source={$LanguageStore === 'de' ? releaseNotesDe : releaseNotesEn}
    renderers={{ code: CodeBlock, list: List, link: Link }} />
</div>
