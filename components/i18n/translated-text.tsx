"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useLanguage } from "@/components/i18n/language-provider";

type TranslatedTextProps = {
  text: string;
  fallback?: ReactNode;
  className?: string;
};

export function TranslatedText({
  text,
  fallback,
  className,
}: TranslatedTextProps) {
  const {
    languageCode,
    translate,
  } = useLanguage();

  const [translatedText, setTranslatedText] =
    useState(text);

  useEffect(() => {
    let cancelled = false;

    async function runTranslation() {
      if (!text) {
        setTranslatedText("");
        return;
      }

      if (languageCode === "en") {
        setTranslatedText(text);
        return;
      }

      const result = await translate(text);

      if (!cancelled) {
        setTranslatedText(result);
      }
    }

    runTranslation();

    return () => {
      cancelled = true;
    };
  }, [text, languageCode, translate]);

  return (
    <span className={className}>
      {translatedText || fallback || text}
    </span>
  );
}
