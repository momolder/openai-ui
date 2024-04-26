<script lang="ts">
  import clipboard from '$lib/assets/clipboard.svg';
  import { copyToClipboard, isNullOrWhitespace } from '$lib/helper';
  import themingService from '$lib/services/theming-service';
  import { getHighlighter, type Highlighter, type BuiltinLanguage } from 'shiki';
  export let lang: string;
  export let text: string;

  const lightTheme = 'github-light';
  const darkTheme = 'github-dark';
  let highlighter: Highlighter;
  let shikiLang = '';

  async function highlight() {
    if (!highlighter)
      highlighter = await getHighlighter({
        langs: ['javascript', 'python', 'c#', 'bash'],
        themes: [lightTheme, darkTheme]
      });

    if (!isNullOrWhitespace(shikiLang) && !highlighter.getLoadedLanguages().includes(shikiLang)) {
      await highlighter.loadLanguage(shikiLang as BuiltinLanguage);
    }
    return highlighter;
  }

  function shikiSupportedLang(): string {
    if (lang === 'vba') return 'vb';
    else if (lang as BuiltinLanguage) { return lang; } 
    else { 
      console.warn(`Highlighting with bash as fallback.`);
      return 'bash';
    }
  }

  $:shikiLang=shikiSupportedLang()
</script>

<div
  class="bg-light-highlight dark:bg-dark-highlight rounded-lg flex flex-col my-4 border border-light-highlight dark:border-dark-highlight">
  <div class="flex flex-row justify-between px-4 py-2">
    <div class="text-sm">{shikiLang}</div>
    <button
      class="btn h-4 flex flex-row items-center gap-1 text-sm"
      type="button"
      on:click={async () => await copyToClipboard(text)}
      ><img class="ico h-4 w-4" src={clipboard} alt="logo" />Copy code</button>
  </div>
  {#await highlight().then( (c) => c?.codeToHtml( text, { lang: shikiLang, theme: themingService.isDark() ? darkTheme : lightTheme } ) ) then code}
    <div class="rounded-b-lg overflow-x-auto bg-light-codeblock dark:bg-dark-codeblock p-2">
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      <code>{@html code}</code>
    </div>
  {/await}
</div>
