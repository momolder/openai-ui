<script>
  import { StateStore } from '$lib/services/state-management';
</script>

<div class="h-full p-5">
  {#if $StateStore.useHistory}
    <p>
      Alle Eingaben werden innerhalb des OpenAI Azure Tennants gespeichert und zur Anzeige des Verlaufs
      verwendet.
    </p>
  {/if}
  <p>
    Daten werden nur für die Kommunikation mit den kognitiven Diensten von Microsoft verwendet um die
    gestellten Fragen zu beantworten.
  </p>
  <a class="ext-link" href="https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy">
    Microsofts Data Privacy Erklärung
  </a>
</div>
