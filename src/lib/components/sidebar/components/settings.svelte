<script lang="ts">
  import { env } from '$env/dynamic/public';
  import Select from '$lib/components/controls/select.svelte';
  import Switch from '$lib/components/controls/switch.svelte';
  import { lang, supportedLanguages, t } from '$lib/localization/translation';
  import { LanguageStore, StateStore } from '$lib/services/state-management';
  import themingService from '$lib/services/theming-service';
  import { toast } from '@zerodevx/svelte-toast';

  const deployments = env.PUBLIC_OpenAi_Deployments?.length > 0 ? env.PUBLIC_OpenAi_Deployments?.split('|') : undefined;
  let useAdvancedDeployment = deployments && $StateStore.deployment === deployments[1];

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
  }

  function toggleDeployment() {
    
    console.log(env.PUBLIC_OpenAi_Deployments)
    console.log(deployments)
    useAdvancedDeployment = !useAdvancedDeployment;
    if (deployments) $StateStore.deployment = useAdvancedDeployment ? deployments[1] : deployments[0];
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
  <Switch label={t(lang.Page.Settings.ThemeDark)} on:click={toggleTheme} value={!themingService.isLight()} />
  {#if deployments}
    <Switch
      label={t(lang.Page.Settings.Deployment)}
      on:click={toggleDeployment}
      value={useAdvancedDeployment} />
  {/if}
</div>
