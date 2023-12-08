<script lang="ts">
  import { isNullOrWhitespace } from '$lib/helper';
  import themingService from '$lib/services/theming-service';
  import { getHighlighter, setCDN, type Lang, type Highlighter, BUNDLED_LANGUAGES } from 'shiki';
  export let lang: string;
  export let text: string;

  const lightTheme = 'github-light';
  const darkTheme = 'github-dark';
  let highlighter: Highlighter;
  setCDN('https://cdn.jsdelivr.net/npm/shiki');

  async function highlight() {
    if (!highlighter)
      highlighter = await getHighlighter({
        langs: ['javascript', 'python', 'c#', 'bash'],
        themes: [lightTheme, darkTheme]
      });

    if (!isNullOrWhitespace(lang) && !highlighter.getLoadedLanguages().includes(lang as Lang)) {
      const bundles = BUNDLED_LANGUAGES.filter((bundle) => {
        return bundle.id === lang || bundle.aliases?.includes(lang);
      });
      if (bundles.length > 0) {
        await highlighter.loadLanguage(lang as Lang);
      } else {
        console.error(`Error loading highlighter for ${lang}`);
      }
    }
    return highlighter;
  }
</script>

<div class="bg-light-highlight dark:bg-dark-base rounded-lg flex flex-col my-4 border border-light-highlight dark:border-dark-base">
  <div class="text-sm p-2">{lang}</div>
{#await highlight().then( (c) => c?.codeToHtml( text, { lang: isNullOrWhitespace(lang) ? 'bash' : lang, theme: themingService.isDark() ? darkTheme : lightTheme } ) ) then code}
          <div class="rounded-b-lg overflow-x-auto bg-light-codeblock dark:bg-dark-codeblock p-2"><code>{@html code}</code></div>
{/await}
</div>
