"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  defaultLanguageCode,
  getLanguage,
  isRtlLanguage,
  type Language,
} from "@/lib/i18n/languages";

type LanguageContextValue = {
  languageCode: string;
  language: Language;
  setLanguage: (code: string) => void;
  isRtl: boolean;
  ready: boolean;
  translating: boolean;
  translate: (text: string) => Promise<string>;
  translateMany: (texts: string[]) => Promise<string[]>;
};

const LanguageContext =
  createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "droidzyra-language";

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [languageCode, setLanguageCode] =
    useState(defaultLanguageCode);

  const [ready, setReady] = useState(false);
  const [translating, setTranslating] = useState(false);

  const translationCache = useRef(
    new Map<string, string>()
  );

  useEffect(() => {
    try {
      const savedLanguage =
        window.localStorage.getItem(STORAGE_KEY);

      if (savedLanguage) {
        setLanguageCode(
          getLanguage(savedLanguage).code
        );
      }
    } catch (error) {
      console.warn(
        "Unable to read saved language:",
        error
      );
    } finally {
      setReady(true);
    }
  }, []);

  const setLanguage = (code: string) => {
    const nextLanguage = getLanguage(code);

    setLanguageCode(nextLanguage.code);

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        nextLanguage.code
      );
    } catch (error) {
      console.warn(
        "Unable to save language:",
        error
      );
    }
  };

  const language = useMemo(
    () => getLanguage(languageCode),
    [languageCode]
  );

  const isRtl = isRtlLanguage(languageCode);

  useEffect(() => {
    document.documentElement.lang =
      language.code;

    document.documentElement.dir =
      isRtl ? "rtl" : "ltr";
  }, [language.code, isRtl]);

  const translateMany = useCallback(
    async (texts: string[]) => {
      if (!texts.length) {
        return [];
      }

      if (languageCode === "en") {
        return texts;
      }

      const results = [...texts];
      const missingTexts: string[] = [];
      const missingIndexes: number[] = [];

      texts.forEach((text, index) => {
        const cleanText = text?.trim();

        if (!cleanText) {
          results[index] = text;
          return;
        }

        const cacheKey =
          `${languageCode}::${cleanText}`;

        const cached =
          translationCache.current.get(cacheKey);

        if (cached) {
          results[index] = cached;
        } else {
          missingTexts.push(cleanText);
          missingIndexes.push(index);
        }
      });

      if (missingTexts.length === 0) {
        return results;
      }

      setTranslating(true);

      try {
        const response = await fetch(
          "/api/translate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              texts: missingTexts,
              target: languageCode,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Translation request failed."
          );
        }

        const translated =
          Array.isArray(data.translations)
            ? data.translations
            : [];

        missingIndexes.forEach(
          (originalIndex, translatedIndex) => {
            const translatedText =
              translated[translatedIndex] ??
              missingTexts[translatedIndex];

            results[originalIndex] =
              translatedText;

            const cacheKey =
              `${languageCode}::${missingTexts[translatedIndex]}`;

            translationCache.current.set(
              cacheKey,
              translatedText
            );
          }
        );

        return results;
      } catch (error) {
        console.error(
          "Translation request error:",
          error
        );

        return texts;
      } finally {
        setTranslating(false);
      }
    },
    [languageCode]
  );

  const translate = useCallback(
    async (text: string) => {
      const [translated] =
        await translateMany([text]);

      return translated ?? text;
    },
    [translateMany]
  );

  const value = useMemo(
    () => ({
      languageCode,
      language,
      setLanguage,
      isRtl,
      ready,
      translating,
      translate,
      translateMany,
    }),
    [
      languageCode,
      language,
      isRtl,
      ready,
      translating,
      translate,
      translateMany,
    ]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}
