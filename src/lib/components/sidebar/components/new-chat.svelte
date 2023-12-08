<script lang="ts">
  import conversationService from '$lib/services/conversation-service';
  import clear from '$lib/assets/clear.svg';

  function clearChat() {
    conversationService.new();
  }
</script>

<div>
  <button name="newChat" data-testid="inputClearButton" class="btn p-2" type="button" on:click={clearChat}>
    <img class="ico h-5 w-5" src={clear} alt="clear chat" />
  </button>
</div>
