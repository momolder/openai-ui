<script lang="ts">
  import clipboard from '$lib/assets/clipboard.svg';
  import { isNullOrWhitespace } from '$lib/helper';
  import { ToastErrors } from '$lib/services/error-handler';
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

  async function copyToClipboard() {
    await navigator.clipboard.writeText(text).catch(ToastErrors);
  }
</script>

<div
  class="bg-light-highlight dark:bg-dark-base rounded-lg flex flex-col my-4 border border-light-highlight dark:border-dark-base">
  <div class="flex flex-row justify-between px-4 py-2">
    <div class="text-sm">{lang}</div>
    <button
      class="btn h-4 flex flex-row items-center gap-1 text-sm"
      type="button"
      on:click={async (e) => await copyToClipboard()}
      ><img class="ico h-4 w-4" src={clipboard} alt="logo" />Copy code</button>
  </div>
  {#await highlight().then( (c) => c?.codeToHtml( text, { lang: isNullOrWhitespace(lang) ? 'bash' : lang, theme: themingService.isDark() ? darkTheme : lightTheme } ) ) then code}
    <div class="rounded-b-lg overflow-x-auto bg-light-codeblock dark:bg-dark-codeblock p-2">
      <code>{@html code}</code>
    </div>
  {/await}
</div>
