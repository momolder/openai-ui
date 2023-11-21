<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let items: { label: string; value: string }[];
  export let selectedItem: string;
  export let label: string;
  export let testid = '';

  function select(event: Event) {
    const value = (event.target as HTMLSelectElement).selectedOptions[0].value;
    dispatch('select', { value: value });
  }
</script>

<div class="flex justify-between p-2">
  <span class="ml-3">{label}</span>
  <select data-testid={testid} class="rounded bg-light-cmp dark:bg-dark-cmp outline-none" on:change={select}>
    {#each items as item}
      <option
        class="bg-light-cmp dark:bg-dark-cmp outline-none"
        value={item.value}
        selected={item.value === selectedItem}>{item.label}</option>
    {/each}
  </select>
</div>
