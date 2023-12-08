import { ThemeStore } from './state-management';

class ThemingService {
  public updateTheme(choice?: string) {
    if (choice) localStorage.theme = choice;
    else localStorage.removeItem('theme');
    this.loadTheme();
  }

  public loadTheme() {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
    ThemeStore.set(localStorage.theme as string);
  }

  public toggleTheme() {
    this.updateTheme(localStorage.theme === 'dark' ? 'light' : 'dark');
  }

  public isLight(): boolean {
    return !this.isDark();
  }

  public isDark(): boolean {
    return localStorage.theme === 'dark';
  }
}

const themingService: ThemingService = new ThemingService();
export default themingService;
