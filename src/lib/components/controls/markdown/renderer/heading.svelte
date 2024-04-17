<script lang="ts">
  export let depth: number;
  export let raw: string;
</script>

{#if depth === 1}
  <h1 class=""><slot /></h1>
{:else if depth === 2}
  <h2 class="pt-2"><slot /></h2>
{:else if depth === 3}
  <h3 class="pt-2"><slot /></h3>
{:else if depth === 4}
  <h4 class="pt-2"><slot /></h4>
{:else if depth === 5}
  <h5 class="pt-2"><slot /></h5>
{:else if depth === 6}
  <h6 class="pt-2"><slot /></h6>
{:else}
  {raw}
{/if}
