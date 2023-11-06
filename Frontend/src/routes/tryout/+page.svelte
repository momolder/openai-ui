<script>
  import Chat from '$lib/components/chat/chat.svelte';
  import Input from '$lib/components/chat/components/input.svelte';
  import Switch from '$lib/components/controls/switch.svelte';
  import Header from '$lib/components/header.svelte';
  import History from '$lib/components/sidebar/components/history.svelte';
</script>

<div class="h-full flex flex-col">
  <Switch label="test" value={true} />
</div>
