<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte';
  import type { Writable } from 'svelte/store';

  export let isDisabled = false;
  export let name = 'contextMenuItem';
  export let text = '';
  export let icon = '';
  export let type: 'normal' | 'warning' | 'error' = 'normal';

  const contextMenuIsOpen = getContext('contextMenu') as Writable<boolean>;
  const dispatch = createEventDispatcher();

  const handleClick = (e: Event) => {
    if (isDisabled) return;
    dispatch('click', { value: text });
    contextMenuIsOpen.set(false);
  };
</script>

<button
  class="ico-btn text-sm p-1 h-6 {type === 'warning' ? 'text-warn' : type === 'error' ? 'text-error' : ''}"
  disabled={isDisabled}
  on:click={handleClick}>
  {#if icon}
    <img class="ico h-5 w-5" src={icon} alt="{name}icon" />
  {/if}
  {text}
</button>
