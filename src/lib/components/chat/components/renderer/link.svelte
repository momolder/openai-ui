<script lang="ts">
  import ExternalLink from "$lib/components/controls/external-link.svelte";

    export let href = '';
    export let title: string | undefined = undefined;
</script>
<ExternalLink href={href} title={title ?? ''}><slot /></ExternalLink>