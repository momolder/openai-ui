<script lang="ts">
  import { ConversationStore, IsOpenStore } from '$lib/services/state-management';
  import Welcome from './components/welcome.svelte';
  import Input from './components/input.svelte';
  import Output from './components/output.svelte';
  import cheronLeft from '$lib/assets/chevronLeft.svg';
  import verticalLine from '$lib/assets/verticalLine.svg';

  function toggle() {
    $IsOpenStore = false;
  }
</script>

<div class="cmp overflow-hidden flex flex-col justify-center">
  {#if !$ConversationStore || $ConversationStore.messages.length === 0}
    <Welcome />
  {:else}
    <div class="cmp overflow-hidden flex flex-col">
      <Output />
    </div>
  {/if}

  <div>
    <button class="fixed top-1/2 group" on:click={() => toggle()} type="button">
      <img class="icon h-7 w-7 {$IsOpenStore? "" : "hidden"} group-hover:hidden dark:invert" src={verticalLine} alt="close-sidebar-icon"/>
      <img class="icon h-7 w-7 hidden dark:invert {$IsOpenStore? "group-hover:block" : ""}" src={cheronLeft} alt="close-sidebar-hover-icon"/>
    </button>
  </div>

  <div class="self-center w-full md:w-2/4 mb-2">
    <Input />
  </div>
</div>
