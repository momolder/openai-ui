<script lang="ts">
  import conversationService from '$lib/services/conversation-service';
  import { lang, t } from '$lib/localization/translation';
  import logo from '$lib/assets/logo.svg';
</script>

<div class="cmp flex justify-center items-center flex-col gap-4">
  <img class="ico h-24 w-24" src={logo} alt="logo" />
  <h3>{t(lang.Page.Welcome.Message)}</h3>
  <button
    class="btn text-lg border py-1 px-2 rounded-lg"
    on:click={() => {
      conversationService.respondTo(t(lang.Page.Welcome.StartButtonPrompt));
    }}>{t(lang.Page.Welcome.StartButton)}</button>
</div>
