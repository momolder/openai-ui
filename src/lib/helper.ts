import { supportedLanguages } from './localization/translator';
import { env } from '$env/dynamic/public';
import { ToastErrors } from './services/error-handler';

export function isNullOrWhitespace(input: string | null | undefined): boolean {
  return !input || input.trim() === '';
}

export function chunkString(input: string, chunkSize: number): string[] {
  const result = [];
  while (input.length > 0) {
    const chunk = input.slice(0, input.length > chunkSize ? chunkSize : input.length);
    input = input.slice(chunkSize);
    result.push(chunk);
  }
  return result;
}

export function getFirstAvailableLanguage(): string {
  const cachedLanguage = localStorage.getItem('language');
  if (!cachedLanguage || isNullOrWhitespace(cachedLanguage)) {
    const browserLanguages = navigator.languages.map((l) => l.substring(0, 2));
    const supportedLang = supportedLanguages.find((l) => browserLanguages.includes(l.value))?.value;
    if (supportedLang) return supportedLang;
    else return 'en';
  }
  return cachedLanguage;
}

export type SvelteFetch = (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>;

export function fullUri(uri: string): string {
  return `${env.PUBLIC_App_UseMock === 'true' ? '/fake' : ''}${uri}`;
}

export async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text).catch(ToastErrors);
}

export function toFilesystemSafeName(name: string): string {
  return name.replace(/[<>:"/\\|?*\s]/g, '');
}
