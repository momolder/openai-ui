<script lang="ts">
  import Select from '$lib/components/controls/select.svelte';
  import Switch from '$lib/components/controls/switch.svelte';
  import { lang, supportedLanguages, t } from '$lib/localization/translation';
  import { LanguageStore, StateStore } from '$lib/services/state-management';
  import themingService from '$lib/services/theming-service';
  import light from '$lib/assets/light.svg';
  import dark from '$lib/assets/dark.svg';
  import { toast } from '@zerodevx/svelte-toast';

  let ico = themingService.isLight() ? light : dark;

  function changeSidebarSide() {
    $StateStore.sidebarRight = !$StateStore.sidebarRight;
  }

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

  function toggleTheme() {
    themingService.toggleTheme();
    ico = themingService.isLight() ? light : dark;
  }
</script>

<div class="h-full p-3">
  <Switch
    label={t(lang.Page.Settings.SidebarRight)}
    on:click={changeSidebarSide}
    value={$StateStore.sidebarRight} />
  <Select
    items={supportedLanguages}
    selectedItem={$LanguageStore}
    on:select={changeLanguage}
    label={t(lang.Page.Settings.Language)} />
  <Switch
    label={t(lang.Page.Settings.Autosave)}
    on:click={() => ($StateStore.autosave = !$StateStore.autosave)}
    value={$StateStore.autosave} />
  <Switch label={t(lang.Page.Settings.ThemeDark)} on:click={toggleTheme} value={!themingService.isLight()} />
</div>
