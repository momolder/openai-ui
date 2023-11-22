<script>
  import { StateStore } from '$lib/services/state-management';
</script>

<div class="cmp">
  <h4 class="mb-3">Version: {$StateStore.version}</h4>
  {#if $StateStore.useHistory}
    <p>
      Alle Eingaben werden innerhalb des OpenAI Azure Tennants gespeichert und zur Anzeige des Verlaufs
      verwendet.
    </p>
  {/if}
  <p class="mb-3">
    Daten werden nur für die Kommunikation mit den kognitiven Diensten von Microsoft verwendet um die
    gestellten Fragen zu beantworten.
  </p>
  <a class="ext-link" href="https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy">
    Microsofts Data Privacy Erklärung
  </a>
</div>
