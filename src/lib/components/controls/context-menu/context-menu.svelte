<script lang="ts">
  import { onDestroy, setContext } from 'svelte';
  import { fade } from 'svelte/transition';
  import { writable } from 'svelte/store';

  let toggleButton: HTMLButtonElement;
  let isOpen = writable<boolean>();
  let contextMenuDiv: HTMLDivElement;

  setContext('contextMenu', isOpen);

  const unsubscriber = isOpen.subscribe((o) => {
    if (o) document.addEventListener('click', handleDocumentClick);
    else document.removeEventListener('click', handleDocumentClick);
  });

  function handleDocumentClick(event: MouseEvent) {
    if (!event.target || !contextMenuDiv || (event.target && toggleButton === event.target)) return;
    if (event.target && !contextMenuDiv.contains(event.target as Node) && !event.defaultPrevented)
      $isOpen = false;
  }

  onDestroy(unsubscriber);
</script>

<button
  type="button"
  class="flex text-2xl align-baseline"
  bind:this={toggleButton}
  on:click={(e) => {
    console.log(`click toggle button - toggle from ${$isOpen}`);
    $isOpen = !$isOpen;
  }}>...</button>

{#if $isOpen}
  <div
    bind:this={contextMenuDiv}
    transition:fade={{ duration: 100 }}
    class="absolute bg-light-overlay dark:bg-dark-overlay max-w-fit p-2 flex flex-col rounded-lg"
    style:top={`${toggleButton?.offsetTop + toggleButton?.offsetHeight}px`}
    style:left={`${toggleButton?.offsetLeft + toggleButton?.offsetWidth}px`}>
    <slot />
  </div>
{/if}
