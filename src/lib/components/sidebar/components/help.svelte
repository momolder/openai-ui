<script>
  import { lang } from '$lib/localization/translation';
  import { StateStore } from '$lib/services/state-management';
  import hint from '$lib/assets/hint.svg';
  import Dialog from '$lib/components/dialog.svelte';
  import { releaseNotes } from '$lib/localization/release-notes';
  import { t } from '$lib/localization/translator';

  let showDialog = false;
</script>

<div class="cmp text-justify">
  <h4>{t(lang.Page.Help.About)}</h4>
  {#if $StateStore.useHistory}
    <p>{t(lang.Page.Help.HistoryDisclaimer)}</p>
  {/if}
  <p class="mb-3">{t(lang.Page.Help.MicrosoftDisclaimer)}</p>
  <a class="ext-link" href="https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy">
    {t(lang.Page.Help.MicrosoftDisclaimerLinkText)}
  </a>
  <hr class="my-2" />
  <h4 class="">{t(lang.Page.Help.Version)}: {$StateStore.version}</h4>
  <button type="button" class="ico-btn text-lg p-2 w-full rounded-none" on:click={() => (showDialog = true)}>
    <img class="ico h-6 w-6" src={hint} alt="{t(lang.Page.Help.ReleaseNotes)}icon" />
    {t(lang.Page.Help.ReleaseNotes)}</button>
</div>

<Dialog bind:showDialog>
  <div slot="header">
    <h2>{`${t(lang.Page.Help.ReleaseNotes)} ${t(lang.Page.Help.Version)}: ${$StateStore.version}`}</h2>
  </div>
  {t(releaseNotes)}
</Dialog>
