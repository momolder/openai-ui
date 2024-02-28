import { supportedLanguages } from '$lib/localization/translator';
import { LanguageStore } from './state-management';

class LanguageService {
  public changeLanguage(newLanguage: string) {
    if (supportedLanguages.find((ls) => ls.value === newLanguage)) LanguageStore.set(newLanguage);
  }
}

const languageService = new LanguageService();
export default languageService;
