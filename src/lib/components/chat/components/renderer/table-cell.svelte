<script lang="ts">
    export let header: boolean;
  </script>
  
  {#if header}
    <th class="px-6 py-3 text-left uppercase tracking-wider text-light-highlight dark:text-dark-highlight"><slot></slot></th>
  {:else}
    <td class="px-6 py-4 whitespace-nowrap text-left"><slot></slot></td>
  {/if}