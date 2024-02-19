<script lang="ts">
  import { onDestroy, setContext } from 'svelte';
  import { fade } from 'svelte/transition';
  import { writable } from 'svelte/store';

  let toggleButton: HTMLButtonElement;
  let isOpen = writable<boolean>();
  let contextMenuDiv: HTMLDivElement;
  let top: string;
  let left: string;

  setContext('contextMenu', isOpen);

  const unsubscriber = isOpen.subscribe((o) => {
    if (o) {
      update();
      window.addEventListener('wheel', update);
      document.addEventListener('click', handleDocumentClick);
    } else {
      window.removeEventListener('wheel', update);
      document.removeEventListener('click', handleDocumentClick);
    }
  });

  function handleDocumentClick(event: MouseEvent) {
    if (!event.target || !contextMenuDiv || (event.target && toggleButton === event.target)) return;
    if (event.target && !contextMenuDiv.contains(event.target as Node) && !event.defaultPrevented)
      $isOpen = false;
  }

  function getParentScroll(element: HTMLElement): { top: number; left: number } {
    if (!element?.parentElement) return { top: 0, left: 0 };
    else if (element.parentElement.scrollTop !== 0 || element.parentElement.scrollLeft !== 0)
      return { top: element.parentElement.scrollTop, left: element.parentElement.scrollLeft };
    else {
      return getParentScroll(element.parentElement);
    }
  }

  function update() {
    const scroll = getParentScroll(toggleButton);
    top = `${toggleButton?.offsetTop + toggleButton?.offsetHeight + window.scrollY - scroll.top}px`;
    left = `${toggleButton?.offsetLeft + toggleButton?.offsetWidth + window.scrollX - scroll.left}px`;
  }

  onDestroy(unsubscriber);
</script>

<button
  type="button"
  class="flex text-2xl align-baseline"
  bind:this={toggleButton}
  on:click={() => ($isOpen = !$isOpen)}>...</button>

{#if $isOpen}
  <div
    bind:this={contextMenuDiv}
    transition:fade={{ duration: 100 }}
    class="absolute bg-light-overlay dark:bg-dark-overlay max-w-fit p-2 flex flex-col rounded-lg"
    style:top
    style:left>
    <slot />
  </div>
{/if}
