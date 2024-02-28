<script lang="ts">
  import Select from '$lib/components/controls/select.svelte';
  import Switch from '$lib/components/controls/switch.svelte';
  import { lang } from '$lib/localization/translation';
  import { LanguageStore, StateStore } from '$lib/services/state-management';
  import themingService from '$lib/services/theming-service';
  import { ChatMode } from '$lib/models/Contracts';
  import { supportedLanguages, t } from '$lib/localization/translator';
  import { availableDeployments } from '$lib/helper';
  import languageService from '$lib/services/language-service';

  let reloadLink: HTMLAnchorElement;
  const deployments = availableDeployments().map((d) => {
    return { label: d, value: d };
  });

  const temperatures = [
    { label: t(lang.Page.Settings.ChatModeOptions.Creative), value: ChatMode.Creative },
    { label: t(lang.Page.Settings.ChatModeOptions.Balanced), value: ChatMode.Balanced },
    { label: t(lang.Page.Settings.ChatModeOptions.Precise), value: ChatMode.Precise }
  ];
</script>

<div class="cmp">
  <Select
    items={supportedLanguages}
    selectedItem={$LanguageStore}
    on:select={(e) => {
      languageService.changeLanguage(e.detail.value);
      reloadLink.click();
    }}
    label={t(lang.Page.Settings.Language)} />
  {#if $StateStore.useHistory}
    <Switch
      label={t(lang.Page.Settings.Autosave)}
      on:click={() => ($StateStore.autosave = !$StateStore.autosave)}
      value={$StateStore.autosave} />
  {/if}
  <Switch
    label={t(lang.Page.Settings.ThemeDark)}
    on:click={() => themingService.toggleTheme()}
    value={!themingService.isLight()} />
  <p class="py-2">{t(lang.Page.Settings.ModelSettings)}</p>
  <hr />
  {#if deployments.length > 1}
    <Select
      label={t(lang.Page.Settings.Deployment)}
      items={deployments}
      selectedItem={$StateStore.deployment ?? deployments[0].value}
      on:select={(e) => ($StateStore.deployment = e.detail.value)} />
    <label for="Deployment" class="w-full text-xs">{t(lang.Page.Settings.DeploymentHint)}</label>
  {/if}
  <Select
    label={t(lang.Page.Settings.ChatMode)}
    items={temperatures}
    selectedItem={$StateStore.chatMode ?? temperatures[0].value}
    on:select={(e) => ($StateStore.chatMode = e.detail.value)} />
  <label for="ChatMode" class="w-full text-xs">{t(lang.Page.Settings.ChatModeHint)}</label>
</div>
<nav class="collapse" data-sveltekit-reload><a bind:this={reloadLink} href="/">reloadLink</a></nav>
