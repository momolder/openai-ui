<script lang="ts">
  export let ordered: boolean;
  export let start: number;
</script>

{#if ordered}
  <ol class="list-decimal" {start}><slot></slot></ol>
{:else}
  <ul class="list-disc"><slot></slot></ul>
{/if}
