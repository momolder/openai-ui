<script lang="ts">
  import { MessageBoxStore } from './message-box';

  let dialog: HTMLDialogElement;

  function close(ok: boolean) {
    $MessageBoxStore.ok = ok;
    $MessageBoxStore.showMessage = false;
    dialog.close();
  }

  $: if ($MessageBoxStore.showMessage) dialog.showModal();
</script>

<dialog bind:this={dialog} class="overflow-hidden">
  <div
    class="cmp flex flex-col bg-light-base dark:bg-dark-base border border-light-highlight dark:border-dark-highlight text-light-text dark:text-dark-text">
    <div class="flex flex-row justify-between bg-light-overlay dark:bg-dark-overlay">
      <div class="cmp px-2 py-1 flex flex-row items-center justify-start">
        <img class="ico h-8 w-8 dark:invert-0" src={$MessageBoxStore.icon} alt="messagebox icon" />
        <h4 class="pl-4">{$MessageBoxStore.title}</h4>
      </div>
    </div>
    <hr />
    <p class="cmp p-2 overflow-auto">
      {$MessageBoxStore.message}
    </p>
    {#if $MessageBoxStore.input && $MessageBoxStore.input.type === 'text'}
      <input
        data-testid="message-box-input"
        class="outline-none m-2 border-b-2 border-light-highlight dark:border-dark-highlight"
        type="text"
        placeholder={$MessageBoxStore.input.placeholder}
        bind:value={$MessageBoxStore.input.value} />
    {/if}
    <div class="flex flex-row justify-between">
      <!-- svelte-ignore a11y-autofocus -->
      <button
        data-testid="message-box-ok"
        class="btn rounded-none px-2"
        autofocus
        on:click={() => close(true)}>{$MessageBoxStore.okLabel}</button>
      <button data-testid="message-box-cancel" class="btn rounded-none px-2" on:click={() => close(false)}
        >{$MessageBoxStore.cancelLabel}</button>
    </div>
  </div>
</dialog>
