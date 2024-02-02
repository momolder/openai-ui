<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  export let label: string;
  export let value: boolean;
  export let size: 's' | 'm' = 'm';

  function click() {
    dispatch('click', { value: value });
  }

  function getClass() {
    let xclass =
      'rounded-full peer bg-light-contrast dark:bg-dark-contrast peer-checked:bg-light-highlight dark:peer-checked:bg-dark-highlight after:bg-light-base dark:after:bg-dark-base peer-checked:after:translate-x-full after:absolute';
    switch (size) {
      case 's':
        xclass +=
          ' w-9 h-[17px] after:top-[2px] after:left-[1.5px] after:rounded-full after:h-4 after:w-4 after:transition-all';
        break;
      case 'm':
        xclass +=
          ' w-11 h-[25px] after:top-[3px] after:left-[2px] after:rounded-full after:h-5 after:w-5 after:transition-all';
        break;
    }
    return xclass;
  }
</script>

<div class="flex justify-between {size === 's' ? 'py-1' : 'py-2'}">
  <span class="whitespace-nowrap {size === 's' ? 'text-sm mr-1' : ''}">{label}</span>
  <label class="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" on:click={click} checked={value} class="sr-only peer" />
    <div class={getClass()} />
  </label>
</div>
