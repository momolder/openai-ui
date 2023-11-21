<script>
  import Chat from '$lib/components/chat/chat.svelte';
  import Input from '$lib/components/chat/components/input.svelte';
  import Output from '$lib/components/chat/components/output.svelte';
  import Switch from '$lib/components/controls/switch.svelte';
  import Header from '$lib/components/header.svelte';
  import History from '$lib/components/sidebar/components/history.svelte';
  import Sidebar from '$lib/components/sidebar/sidebar.svelte';
  import Welcome from '$lib/components/welcome.svelte';
</script>

<div>
  <Sidebar on:toggle={(e) => console.log(e)} />
</div>
