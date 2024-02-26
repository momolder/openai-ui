import { get } from 'svelte/store';
import { LanguageStore } from '../services/state-management';

export function t(text: Record<string, string>): string {
  return text[get(LanguageStore)];
}

export const supportedLanguages = [
  { label: 'English', value: 'en' },
  { label: 'Deutsch', value: 'de' }
];
