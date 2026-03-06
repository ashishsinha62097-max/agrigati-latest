import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import {
  INDIAN_LANGUAGES,
  type Language,
  TRANSLATIONS,
  type TranslationKey,
} from "../data/languages";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("ag_language");
    if (saved) {
      const found = INDIAN_LANGUAGES.find((l) => l.code === saved);
      if (found) return found;
    }
    return INDIAN_LANGUAGES[0]; // Hindi default
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("ag_language", lang.code);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      const langTranslations = TRANSLATIONS[language.code] ?? TRANSLATIONS.hi;
      return langTranslations[key] ?? TRANSLATIONS.hi[key] ?? key;
    },
    [language.code],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
