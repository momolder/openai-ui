<script lang="ts">
  import { lang } from '$lib/localization/translation';
  import { LanguageStore, StateStore } from '$lib/services/state-management';
  import { t } from '$lib/localization/translator';
  import releaseNotesDe from './release-notes.de.md?raw';
  import releaseNotesEn from './release-notes.en.md?raw';
  import Markdown from '../controls/markdown/markdown.svelte';
</script>

<div class="p-2">
  <h2>{`${t(lang.Page.Help.ReleaseNotes)} ${t(lang.Page.Help.Version)}: ${$StateStore.version}`}</h2>
</div>
<hr />
<div class="px-2">
  <Markdown source={$LanguageStore === 'de' ? releaseNotesDe : releaseNotesEn} />
</div>
