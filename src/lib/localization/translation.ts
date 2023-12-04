import { get } from 'svelte/store';
import { LanguageStore } from '../services/state-management';

export function t(text: Record<string, string>): string {
  return text[get(LanguageStore)];
}

export const supportedLanguages = [
  { label: 'English', value: 'en' },
  { label: 'Deutsch', value: 'de' }
];

export const lang = {
  Page: {
    Header: {
      Title: {
        en: 'Azure OpenAI UI',
        de: 'Azure OpenAI UI'
      },
      Mock: {
        en: 'Demo mode active',
        de: 'Demo Modus aktiv'
      }
    },
    Sidebar: {
      Clear: {
        en: 'New Chat',
        de: 'Neuer Chat'
      },
      History: {
        en: 'History',
        de: 'Verlauf'
      },
      Settings: {
        en: 'Settings',
        de: 'Einstellungen'
      },
      Help: {
        en: 'Help',
        de: 'Hilfe'
      },
      User: {
        en: 'User',
        de: 'Benutzer'
      }
    },
    Welcome: {
      Message: {
        en: 'Welcome to the OpenAI-UI',
        de: 'Willkommen auf der OpenAI-UI'
      },
      StartButton: {
        en: 'How does the chat work?',
        de: 'Wie funktioniert der Chat?'
      },
      StartButtonPrompt: {
        en: 'Can you tell me more about what abilities and functions you have as an AI chatbot and how you handle my data and privacy?',
        de: 'Kannst du mir sagen, welche Fähigkeiten und Funktionen du als KI-Chatbot hast und wie du mit meinen Daten und meiner Privatsphäre umgehst?'
      }
    },
    Chat: {
      Input: {
        Placeholder: {
          en: 'Send a message...',
          de: 'Schreib eine Nachricht...'
        },
        ChatInfo: {
          en: 'The chatbot can make mistakes. Consider checking important information.',
          de: 'Der Chatbot kann Fehler machen, bitte prüfen Sie wichtige Informationen.'
        },
        
      }
    },
    History: {
      Empty: {
        en: 'No history available',
        de: 'Kein Verlauf vorhanden'
      },
      ClearAll: {
        en: 'Delete history',
        de: 'Verlauf löschen'
      }
    },
    Settings: {
      Language: {
        en: 'Select language',
        de: 'Sprache ändern'
      },
      ReloadAfterLanguageChange: {
        en: 'Reload page to change the language',
        de: 'Seite neu laden um die Sprache zu ändern'
      },
      Autosave: {
        en: 'Automatic saving',
        de: 'Automatisches Speichern'
      },
      ThemeDark: {
        en: 'Theme dark',
        de: 'Dunkles Layout'
      }
    },
    Tooltip: {
      Header: {
        Theme: {
          en: 'Toggle theme',
          de: 'Theme wechseln'
        }
      },
      Chat: {
        Actions: {
          Follow: {
            en: 'Follow',
            de: 'Folgen'
          },
          Unfollow: {
            en: 'Unfollow',
            de: 'Nicht mehr folgen'
          },
          Clean: {
            en: 'Clear chat',
            de: 'Chat leeren'
          },
          Send: {
            en: 'Send',
            de: 'Senden'
          }
        }
      }
    }
  }
};
