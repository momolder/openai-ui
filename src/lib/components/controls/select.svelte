<script lang="ts">
  import type { SelectOption } from '$lib/models/Contracts';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let items: SelectOption[];
  export let selectedItem: string;
  export let label: string;

  function select(event: Event) {
    const value = (event.target as HTMLSelectElement).selectedOptions[0].value;
    dispatch('select', { value: value });
  }
</script>

<div class="flex justify-between py-2">
  <span>{label}</span>
  <select data-testid={label} class="rounded bg-light-base dark:bg-dark-base outline-none" on:change={select}>
    {#each items as item}
      <option
        class="bg-light-base dark:bg-dark-base outline-none"
        value={item.value}
        selected={item.value === selectedItem}>{item.label}</option>
    {/each}
  </select>
</div>
