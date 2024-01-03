<script lang="ts">
  import conversationService from '$lib/services/conversation-service';
  import clear from '$lib/assets/clear.svg';

  export let showLabel = false;
  export let label: string;

  function clearChat() {
    conversationService.newConversation();
  }
</script>

<button
  name="newChat"
  data-testid="inputClearButton"
  class="sidebar-btn p-2"
  type="button"
  on:click={clearChat}>
  <img class="ico h-5 w-5" src={clear} alt="clear chat" />
  <p class="{showLabel ? 'visible' : 'hidden'} text-center justify-self-center">{label}</p>
</button>
