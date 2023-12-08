<script>
  import Sidebar from '$lib/components/sidebar/sidebar.svelte';
</script>

<div>
  <Sidebar on:toggle={(e) => console.log(e)} />
</div>
