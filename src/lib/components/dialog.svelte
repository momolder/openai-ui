<script lang="ts">
  export let showDialog: boolean;

  let dialog: HTMLDialogElement;

  $: if (dialog && showDialog) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog bind:this={dialog} on:close={() => (showDialog = false)} on:click|self={() => dialog.close()}>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div on:click|stopPropagation class="bg-light-cmp dark:bg-dark-cmp text-light-text dark:text-dark-text">
    <div class="cmp flex justify-between px-2">
      <div class="pt-4">
        <slot name="header" />
      </div>
      <div class="align-top text-lg">
        <!-- svelte-ignore a11y-autofocus -->
        <button class="btn" autofocus on:click={() => dialog.close()}>x</button>
      </div>
    </div>
    <hr />
    <div class="p-2">
      <slot />
    </div>
    <hr />
  </div>
</dialog>
