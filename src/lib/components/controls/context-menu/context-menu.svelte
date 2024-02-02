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
    if (!event.target || !contextMenuDiv) return;
    if (event.target && !contextMenuDiv.contains(event.target as Node) && !event.defaultPrevented) {
      $isOpen = false;
    }
  }

  onDestroy(unsubscriber);
</script>

<button
  type="button"
  bind:this={toggleButton}
  on:click={(e) => {
    $isOpen = !$isOpen;
    e.stopImmediatePropagation();
  }}>...</button>

{#if $isOpen}
  <div
    bind:this={contextMenuDiv}
    transition:fade={{ duration: 100 }}
    class="absolute border-2 border-dark-cmp"
    style="top: {toggleButton.offsetTop + toggleButton.offsetHeight}px; left: {toggleButton.offsetLeft +
      toggleButton.offsetWidth}px;">
    <slot />
  </div>
{/if}
