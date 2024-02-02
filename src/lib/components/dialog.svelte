<script lang="ts">
  export let showDialog: boolean;

  let dialog: HTMLDialogElement;

  $: if (dialog && showDialog) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
  bind:this={dialog}
  on:close={() => (showDialog = false)}
  on:click|self={() => dialog.close()}
  class="cmp md:w-2/5 overflow-hidden">
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    on:click|stopPropagation
    class="cmp flex flex-col bg-light-base dark:bg-dark-base dark:border-dark-highlight dark:border text-light-text dark:text-dark-text">
    <div class="flex flex-row justify-between px-2">
      <div class="pt-4">
        <slot name="header" />
      </div>
      <div class="align-top text-lg">
        <!-- svelte-ignore a11y-autofocus -->
        <button class="btn w-6 h-8 justify-center" autofocus on:click={() => dialog.close()}>x</button>
      </div>
    </div>
    <hr />
    <div class="cmp p-2 overflow-auto">
      <slot />
    </div>
    <hr />
  </div>
</dialog>
