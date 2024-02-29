<script>
  import { lang } from '$lib/localization/translation';
  import { StateStore } from '$lib/services/state-management';
  import hint from '$lib/assets/hint.svg';
  import Dialog from '$lib/components/dialog.svelte';
  import { t } from '$lib/localization/translator';
  import ReleaseNotes from '$lib/components/release-notes/release-notes.svelte';
  import ExternalLink from '$lib/components/controls/external-link.svelte';

  let showDialog = false;
</script>

<div class="cmp text-justify">
  <h4>{t(lang.Page.Help.About)}</h4>
  {#if $StateStore.useHistory}
    <p>{t(lang.Page.Help.HistoryDisclaimer)}</p>
  {/if}
  <p class="mb-3">{t(lang.Page.Help.MicrosoftDisclaimer)}</p>
  <ExternalLink
    href="https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy"
    title={t(lang.Page.Help.MicrosoftDisclaimerLinkText)} />
  <hr class="my-2" />
  <h4 class="">{t(lang.Page.Help.Version)}: {$StateStore.version}</h4>
  <button type="button" class="ico-btn text-lg p-2 w-full rounded-none" on:click={() => (showDialog = true)}>
    <img class="ico h-6 w-6" src={hint} alt="{t(lang.Page.Help.ReleaseNotes)}icon" />
    {t(lang.Page.Help.ReleaseNotes)}</button>
</div>

<Dialog noHeader={true} bind:showDialog>
  <ReleaseNotes />
</Dialog>
