"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/language-provider";
import type { AppInternalLink } from "@/lib/types";

type AppTranslatedContentProps = {
  shortDescription?: string | null;
  description?: string | null;
  features?: string | null;
  editorialNotes?: string | null;
  internalLinks?: AppInternalLink[];
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
  internalLinks = [],
  section,
}: AppTranslatedContentProps) {
  const { languageCode, translateMany } = useLanguage();
  function renderLinkedText(
    text: string,
    placement: "description" | "editorial_notes"
  ) {
    if (!text || internalLinks.length === 0) {
      return text;
    }

    const lowerText = text.toLowerCase();

    const matches = internalLinks
      .filter(
        (link) =>
          link.placement === placement &&
          link.target?.slug &&
          link.anchor_text.trim()
      )
      .map((link) => {
        const anchor = link.anchor_text.trim();
        const index = lowerText.indexOf(anchor.toLowerCase());

        return {
          link,
          anchor,
          index,
        };
      })
      .filter((match) => match.index >= 0)
      .sort((a, b) => {
        if (a.index !== b.index) {
          return a.index - b.index;
        }

        return b.anchor.length - a.anchor.length;
      });

    if (matches.length === 0) {
      return text;
    }

    const parts: ReactNode[] = [];
    let cursor = 0;

    for (const match of matches) {
      if (match.index < cursor) {
        continue;
      }

      if (match.index > cursor) {
        parts.push(text.slice(cursor, match.index));
      }

      const end = match.index + match.anchor.length;

      parts.push(
        <Link
          key={`${placement}-${match.link.id}-${match.index}`}
          href={`/apps/${match.link.target!.slug}`}
          className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
        >
          {text.slice(match.index, end)}
        </Link>
      );

      cursor = end;
    }

    if (cursor < text.length) {
      parts.push(text.slice(cursor));
    }

    return parts;
  }

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
              {renderLinkedText(content.description, "description")}
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
        {renderLinkedText(content.editorialNotes, "editorial_notes")}
      </div>
    ) : null;
  }

  return null;
}










