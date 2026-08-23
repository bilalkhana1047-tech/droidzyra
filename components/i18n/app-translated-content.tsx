"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/components/i18n/language-provider";

type AppTranslatedContentProps = {
  shortDescription?: string | null;
  description?: string | null;
  features?: string | null;
  editorialNotes?: string | null;
  section: "about" | "features" | "notes";
};

type TranslatedAppContent = {
  shortDescription: string;
  description: string;
  features: string[];
  editorialNotes: string;
};

export function AppTranslatedContent({
  shortDescription,
  description,
  features,
  editorialNotes,
  section,
}: AppTranslatedContentProps) {
  const { languageCode, translateMany } = useLanguage();

  const featureList = useMemo(
    () =>
      (features ?? "")
        .split(/\r?\n/)
        .map((feature) => feature.trim())
        .filter(Boolean),
    [features]
  );

  const sourceTexts = useMemo(
    () => [
      shortDescription?.trim() ?? "",
      description?.trim() ?? "",
      ...featureList,
      editorialNotes?.trim() ?? "",
    ],
    [
      shortDescription,
      description,
      featureList,
      editorialNotes,
    ]
  );

  const buildContent = (
    values: string[]
  ): TranslatedAppContent => {
    let index = 0;

    const translatedShort =
      values[index++] ??
      shortDescription ??
      "";

    const translatedDescription =
      values[index++] ??
      description ??
      "";

    const translatedFeatures =
      featureList.map(
        (feature) =>
          values[index++] ?? feature
      );

    const translatedNotes =
      values[index++] ??
      editorialNotes ??
      "";

    return {
      shortDescription: translatedShort,
      description: translatedDescription,
      features: translatedFeatures,
      editorialNotes: translatedNotes,
    };
  };

  const [content, setContent] =
    useState<TranslatedAppContent>(() =>
      buildContent(sourceTexts)
    );

  useEffect(() => {
    let cancelled = false;

    async function runTranslation() {
      if (languageCode === "en") {
        setContent(buildContent(sourceTexts));
        return;
      }

      const translated =
        await translateMany(sourceTexts);

      if (!cancelled) {
        setContent(buildContent(translated));
      }
    }

    runTranslation();

    return () => {
      cancelled = true;
    };
  }, [languageCode, translateMany, sourceTexts]);

  if (section === "about") {
    return (
      <>
        {(shortDescription || description) && (
          <div>
          {shortDescription && (
            <p className="text-base font-medium leading-7 text-foreground">
              {content.shortDescription}
            </p>
          )}

          {description && (
            <div
              className={
                shortDescription
                  ? "mt-4 whitespace-pre-line text-muted-foreground leading-7"
                  : "whitespace-pre-line text-muted-foreground leading-7"
              }
            >
              {content.description}
            </div>
          )}
        </div>
      )}

      {!shortDescription && !description && (
        <p className="text-muted-foreground leading-7">
          No description available.
        </p>
      )}

      </>
    );
  }

  if (section === "features") {
    return featureList.length > 0 ? (
      <div className="grid gap-3 sm:grid-cols-2">
          {content.features.map((feature, index) => (
            <div
              key={`${index}-${feature}`}
              className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-4"
            >
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                ✓
              </span>

              <span className="text-sm leading-6 text-muted-foreground">
                {feature}
              </span>
            </div>
          ))}
      </div>
    ) : null;
  }

  if (section === "notes") {
    return editorialNotes?.trim() ? (
      <div className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
        {content.editorialNotes}
      </div>
    ) : null;
  }

  return null;
}

