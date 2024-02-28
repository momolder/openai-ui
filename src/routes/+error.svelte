<script lang="ts">
  import { page } from '$app/stores';
  import Header from '$lib/components/header.svelte';
  import { t } from '$lib/localization/translator';
  import { lang } from '$lib/localization/translation';
</script>

<Header />
<div class="cmp flex justify-center p-8">
  {#if $page.status === 412}
    <div>
      <h1 class="p-6">{t(lang.Errors.ValidationFailed)}</h1>
      <p>{$page.error?.message}</p>
    </div>
  {:else if $page.status === 401}
    <div>
      <h1>{$page.status}: {$page.error?.message}</h1>
    </div>
  {:else}
    <h1>{$page.status}: {$page.error?.message}</h1>
  {/if}
</div>
