<script lang="ts">
  import conversationService from '$lib/services/conversation-service';
  import clear from '$lib/assets/clear.svg';
  import { lang, t } from '$lib/localization/translation';

  function clearChat() {
    conversationService.new();
  }
</script>
<div>
    <label for="newChat">{t(lang.Page.Sidebar.Clear)}</label>
<button name="newChat" data-testid="inputClearButton" class="btn" type="button" on:click={clearChat}>
  <img class="ico" src={clear} alt="clear chat" />
</button>
</div>