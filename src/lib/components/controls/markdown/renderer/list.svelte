<script lang="ts">
  export let ordered: boolean;
  export let start: number;
</script>

{#if ordered}
  <ol class="list-decimal pl-6" {start}><slot /></ol>
{:else}
  <ul class="list-disc pl-6"><slot /></ul>
{/if}
