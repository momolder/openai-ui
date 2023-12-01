<script lang="ts">
  import conversationService from '$lib/services/conversation-service';
  import { lang, t } from '$lib/localization/translation';
  import logo from '$lib/assets/logo.svg';
</script>

<div class="cmp flex justify-center items-center flex-col gap-4">
  <img class="ico h-24 w-24" src={logo} alt="logo" />
  <h3>{t(lang.Page.Welcome.Message)}</h3>
  <button
    data-testid="welcomeStartButton"
    class="btn text-lg border p-1"
    on:click={() => {
      conversationService.getResponse(t(lang.Page.Welcome.StartButtonPrompt));
    }}>{t(lang.Page.Welcome.StartButton)}</button>
</div>
