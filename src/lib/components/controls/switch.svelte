<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  export let label: string;
  export let value: boolean;
  export let testid = '';

  function click() {
    dispatch('click', { value: value });
  }
</script>

<div class="flex justify-between py-2">
  <span class="whitespace-nowrap">{label}</span>
  <label class="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" on:click={click} checked={value} class="sr-only peer" />
    <div
      data-testid={testid}
      class="w-11 h-[25px] rounded-full peer
    bg-light-flat dark:bg-dark-flat peer-checked:bg-light-highlight dark:peer-checked:bg-dark-highlight after:bg-light-cmp dark:after:bg-dark-cmp
    peer-checked:after:translate-x-full
    after:absolute after:top-[3px] after:left-[2px]
    after:rounded-full after:h-5 after:w-5 after:transition-all" />
  </label>
</div>
