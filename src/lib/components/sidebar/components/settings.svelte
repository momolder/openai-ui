<script lang="ts">
  import { env } from '$env/dynamic/public';
  import Select from '$lib/components/controls/select.svelte';
  import Switch from '$lib/components/controls/switch.svelte';
  import { lang } from '$lib/localization/translation';
  import { LanguageStore, StateStore } from '$lib/services/state-management';
  import themingService from '$lib/services/theming-service';
  import { toast } from '@zerodevx/svelte-toast';
  import { ChatMode } from '$lib/models/Contracts';
  import { supportedLanguages, t } from '$lib/localization/translator';

  const deployments =
    env.PUBLIC_OpenAi_Deployments?.length > 0 ? env.PUBLIC_OpenAi_Deployments?.split('|') : undefined;
  const temperatures = [
    { label: t(lang.Page.Settings.ChatModeOptions.Balanced), value: ChatMode.Balanced },
    { label: t(lang.Page.Settings.ChatModeOptions.Creative), value: ChatMode.Creative },
    { label: t(lang.Page.Settings.ChatModeOptions.Precise), value: ChatMode.Precise }
  ];

  function changeLanguage(event: CustomEvent) {
    $LanguageStore = event.detail.value;
    toast.push(
      { msg: t(lang.Page.Settings.ReloadAfterLanguageChange) },
      {
        dismissable: true,
        duration: 5000
      }
    );
  }
</script>

<div class="cmp">
  <Select
    items={supportedLanguages}
    selectedItem={$LanguageStore}
    on:select={changeLanguage}
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
  {#if deployments}
    <Select
      label={t(lang.Page.Settings.Deployment)}
      items={deployments.map((d) => {
        return { label: d, value: d };
      })}
      selectedItem={$StateStore.deployment}
      on:select={(e) => ($StateStore.deployment = e.detail.value)} />
  <label for="Deployment" class="w-full text-xs">{t(lang.Page.Settings.DeploymentHint)}</label>
  {/if}
  <Select
    label={t(lang.Page.Settings.ChatMode)}
    items={temperatures}
    selectedItem={$StateStore.chatMode}
    on:select={(e) => ($StateStore.chatMode = e.detail.value)} />
  <label for="ChatMode" class="w-full text-xs">{t(lang.Page.Settings.ChatModeHint)}</label>
</div>
