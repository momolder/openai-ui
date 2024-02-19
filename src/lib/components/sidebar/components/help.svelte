<script>
  import { lang, t } from '$lib/localization/translation';
  import { StateStore } from '$lib/services/state-management';
  import hint from '$lib/assets/hint.svg';
  import Dialog from '$lib/components/dialog.svelte';
  import { releaseNotes } from '$lib/localization/release-notes';

  let showDialog = false;
</script>

<div class="cmp text-justify">
  <h4>{t(lang.Page.Help.About)}</h4>
  {#if $StateStore.useHistory}
    <p>
      Alle Eingaben werden innerhalb des OpenAI Azure Tennants gespeichert und zur Anzeige des Verlaufs
      verwendet.
    </p>
  {/if}
  <p class="mb-3">
    Daten werden nur für die Kommunikation mit den kognitiven Diensten von Microsoft verwendet um die
    gestellten Fragen zu beantworten.
  </p>
  <a class="ext-link" href="https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy">
    Microsofts Data Privacy Erklärung
  </a>
  <hr class="my-2" />
  <h4 class="">Version: {$StateStore.version}</h4>
  <button type="button" class="ico-btn text-lg p-2 w-full rounded-none" on:click={() => (showDialog = true)}>
    <img class="ico h-6 w-6" src={hint} alt="{name}icon" />
    {t(lang.Page.Help.ReleaseNotes)}</button>
</div>

<Dialog bind:showDialog>
  <div slot="header">
    <h2>{`${t(lang.Page.Help.ReleaseNotes)} Version: ${$StateStore.version}`}</h2>
  </div>
  {t(releaseNotes)}
</Dialog>
