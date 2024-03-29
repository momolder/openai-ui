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
        UseDocumentSearch: {
          en: 'Search documents',
          de: 'Dokumente durchsuchen'
        }
      },
      Message: {
        Role: {
          User: {
            en: 'You',
            de: 'Sie'
          },
          Agent: {
            en: 'Bot',
            de: 'Bot'
          }
        },
        Regenerate: {
          en: 'Regenerate last answer',
          de: 'Letzte Antwort neu generieren'
        },
        Copy: {
          en: 'Copy to clipboard',
          de: 'Nachricht in die Zwischenablage kopieren'
        }
      }
    },
    History: {
      Empty: {
        en: 'No history available',
        de: 'Kein Verlauf vorhanden'
      },
      AllHistoryEntries: {
        en: 'All history',
        de: 'Gesamter Verlauf'
      },
      ClearAll: {
        en: 'Delete history',
        de: 'Verlauf löschen'
      },
      QuestionClearAll: {
        en: 'Do you want to delete the chat history?',
        de: 'Wollen Sie wirklich den gesamten Verlauf löschen?'
      },
      ClearOne: {
        en: 'Delete chat',
        de: 'Chat löschen'
      },
      QuestionClearOne: {
        en: 'Do you want to delete the chat?',
        de: 'Wollen Sie den Chat wirklich löschen?'
      },
      DownloadPdf: {
        en: 'Download Pdf',
        de: 'Pdf herunterladen'
      },
      DownloadJson: {
        en: 'Download JSON',
        de: 'JSON herunterladen'
      },
      Rename: {
        en: 'Rename',
        de: 'Umbenennen'
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
        en: 'Enable history',
        de: 'Verlauf aktivieren'
      },
      ThemeDark: {
        en: 'Theme dark',
        de: 'Dunkles Layout'
      },
      ModelSettings: {
        en: 'Model Settings',
        de: 'Model Einstellungen'
      },
      Deployment: {
        en: 'Select Model',
        de: 'Model wählen'
      },
      DeploymentHint: {
        en: 'The AI Model to use, generally speaking, a higher number means better but slower answers',
        de: 'Das zu verwendende KI Model, generell bedeutet eine höhere Nummer bessere aber langsamere Antworten'
      },
      ChatMode: {
        en: 'Conversation style',
        de: 'Unterhaltungsstil'
      },
      ChatModeHint: {
        en: 'The AI is setup to answer more akin to this setting',
        de: 'Die KI wird angewiesen in höherem Maße entsprechend zu antworten'
      },
      ChatModeOptions: {
        Balanced: {
          en: 'balanced',
          de: 'ausgewogen'
        },
        Creative: {
          en: 'creative',
          de: 'kreativ'
        },
        Precise: {
          en: 'precise',
          de: 'genau'
        }
      }
    },
    Help: {
      ReleaseNotes: {
        en: 'Release Notes',
        de: 'Release Notes'
      },
      HistoryDisclaimer: {
        en: 'All entries are saved within the OpenAI Azure Tennant and used only to display the history.',
        de: 'Alle Eingaben werden innerhalb des OpenAI Azure Tennants gespeichert und zur Anzeige des Verlaufs verwendet.'
      },
      MicrosoftDisclaimer: {
        en: "Data is only used for communication with Microsoft's cognitive services to answer the questions asked.",
        de: 'Daten werden nur für die Kommunikation mit den kognitiven Diensten von Microsoft verwendet um die gestellten Fragen zu beantworten.'
      },
      MicrosoftDisclaimerLinkText: {
        en: "Microsoft's Data Privacy Statement",
        de: 'Microsofts Data Privacy Erklärung'
      },
      Version: {
        en: 'Version',
        de: 'Version'
      },
      About: {
        en: 'About',
        de: 'Über'
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
  },
  Errors: {
    Unauthorized: {
      en: 'Unauthorized',
      de: 'Nicht autorisiert'
    },
    ValidationFailed: {
      en: 'App configuration invalid',
      de: 'App Konfiguration ungültig'
    },
    NoDeployment: {
      en: 'No deployment configured, please inform your administrator.',
      de: 'Kein Modell deployment konfiguriert, bitte wenden Sie sich an ihren Administrator.'
    }
  }
};
