<script lang="ts">
  import '../app.css';
  import { SvelteToast } from '@zerodevx/svelte-toast';

  const toastOptions = {
    dismissable: true,
    duration: 5000
  };
</script>

<slot />
<SvelteToast options={toastOptions} />
