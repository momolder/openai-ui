<script lang="ts">
  import themingService from '$lib/services/theming-service';
  import { getHighlighter, setCDN, type Lang, type Highlighter } from 'shiki';
  export let lang: string;
  export let text: string;

  let highlighter: Highlighter;
  setCDN('https://cdn.jsdelivr.net/npm/shiki');

  async function highlight() {
    if (!highlighter)
      highlighter = await getHighlighter({ langs: [lang as Lang], themes: ['github-light', 'github-dark'] });
    else {
      highlighter.loadLanguage(lang as Lang);
    }
    return highlighter;
  }
</script>

{#await highlight().then( (c) => c?.codeToHtml( text, { lang, theme: themingService.isDark() ? 'github-dark' : 'github-light' } ) ) then code}
  <code>{@html code}</code>
{/await}
