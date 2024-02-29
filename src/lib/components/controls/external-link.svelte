<script lang="ts">
  import externalLink from '$lib/assets/external-link.svg';
  export let title: string;
  export let href: string;
</script>

<a class="ext-link inline-flex items-baseline justify-start text-sm text-left" {href}>
    <img class="ico h-3 w-4 pr-1" src={externalLink} alt="externalLink" />
  {title}
  <slot />
</a>
