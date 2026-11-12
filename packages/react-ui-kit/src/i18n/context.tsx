import React, { createContext, useContext, useState, useMemo } from "react";
import type { TranslationDictionary, SupportedLocale } from "./types";
import { enTranslations } from "./en";
import { viTranslations } from "./vi";

export interface I18nContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (path: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const translations: Record<SupportedLocale, TranslationDictionary> = {
  en: enTranslations,
  vi: viTranslations,
};

export interface I18nProviderProps {
  initialLocale?: SupportedLocale;
  children: React.ReactNode;
}

/**
 * Provides internationalization context to UI Kit components.
 * Supports dynamic locale switching between English ('en') and Vietnamese ('vi').
 *
 * @param props.initialLocale Initial language code ('en' or 'vi')
 * @param props.children React component subtree
 */
export const I18nProvider: React.FC<I18nProviderProps> = ({
  initialLocale = "en",
  children,
}) => {
  const [locale, setLocale] = useState<SupportedLocale>(initialLocale);

  const t = useMemo(() => {
    const currentDict = translations[locale] || translations.en;

    return (path: string): string => {
      const parts = path.split(".");
      let current: any = currentDict;

      for (const part of parts) {
        if (current && typeof current === "object" && part in current) {
          current = current[part];
        } else {
          return path; // Fallback to path if key not resolved
        }
      }

      return typeof current === "string" ? current : path;
    };
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
    }),
    [locale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

/**
 * Accesses translation helpers and active locale.
 *
 * @returns I18nContextValue
 */
export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an <I18nProvider>.");
  }
  return context;
}

