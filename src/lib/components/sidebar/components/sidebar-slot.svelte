<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { IsOpenStore } from '$lib/services/state-management';

  const dispatch = createEventDispatcher();

  export let showLabel = false;
  export let name: string;
  export let label: string;
  export let isOpen = false;
  export let ico: string;

  function toggle() {
    dispatch('toggle', { name: name });
    $IsOpenStore = !isOpen;
  }
</script>

<button
  data-testid="sidebar {name}Button"
  class="sidebar-btn p-2 w-full"
  on:click={() => toggle()}
  type="button">
  <img class="ico h-5 w-5" src={ico} alt="{name}icon" />
  <p class="{showLabel ? 'visible' : 'hidden'} text-center justify-self-center">{label}</p>
</button>
{#if isOpen}
  <div class="cmp overflow-hidden overflow-y-auto p-5">
    <slot />
  </div>
{/if}
