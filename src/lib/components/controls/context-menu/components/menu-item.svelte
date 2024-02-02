<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte';
    import type { Writable } from 'svelte/store';

  export let isDisabled = false;
  export let text = '';

  const contextMenuIsOpen = getContext('contextMenu') as Writable<boolean>;
  const dispatch = createEventDispatcher();

  const handleClick = (e: Event) => {
    if (isDisabled) return;
    dispatch('click', { value: text });
    contextMenuIsOpen.set(false);
  };
</script>

<button disabled={isDisabled} on:click={handleClick}>
  {text}
</button>
