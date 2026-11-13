import React from "react";
import type { PulseClient } from "@pulse/client-sdk";
import { PulseProvider } from "@pulse/react-hooks";
import { I18nProvider } from "./i18n/context";
import { ThemeProvider } from "./theme/context";
import type { SupportedLocale } from "./i18n/types";
import type { ThemeMode } from "./theme/types";

export interface PulseChatProviderProps {
  client: PulseClient;
  initialLocale?: SupportedLocale;
  initialThemeMode?: ThemeMode;
  children: React.ReactNode;
}

/**
 * High-level unified provider combining PulseClient context, internationalization, and theming.
 *
 * @param props.client Initialized instance of PulseClient
 * @param props.initialLocale Preferred language ('en' | 'vi')
 * @param props.initialThemeMode Initial theme ('light' | 'dark' | 'system')
 * @param props.children React subtree
 */
export const PulseChatProvider: React.FC<PulseChatProviderProps> = ({
  client,
  initialLocale = "en",
  initialThemeMode = "light",
  children,
}) => {
  return (
    <PulseProvider client={client}>
      <I18nProvider initialLocale={initialLocale}>
        <ThemeProvider initialMode={initialThemeMode}>
          {children}
        </ThemeProvider>
      </I18nProvider>
    </PulseProvider>
  );
};

