<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let name: string;
  export let label: string;
  export let isOpen = false;
  export let ico: string;

  function toggle() {
    dispatch('toggle', { name: name });
  }
</script>

<button data-testid="sidebar{name}Button" class="sidebar-btn" on:click={() => toggle()} type="button">
  <img class="ico" src={ico} alt="{name}icon" />
  <p class="hidden md:block md:visible">{label}</p>
</button>
{#if isOpen}
  <div class="overflow-hidden overflow-y-auto">
    <slot />
  </div>
{/if}

<style>
  .sidebar-btn {
    @apply btn flex flex-nowrap items-center justify-start gap-4 text-xl h-14;
  }
</style>
