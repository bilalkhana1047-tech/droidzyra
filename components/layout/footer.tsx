"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Facebook,
  Instagram,
  Youtube,
} from 'lucide-react';

import { siteConfig } from '@/lib/site';
import { Logo } from '@/components/layout/logo';
import { Container } from '@/components/layout/container';
import { useLanguage } from '@/components/i18n/language-provider';

export function Footer() {
  const { languageCode, translateMany } = useLanguage();

  const footerSourceTexts = useMemo(() => {
    const texts = [
      `${siteConfig.tagline} Discover Android apps, compare versions and understand compatibility before choosing the right version for your device.`,
      "No piracy. No modded APKs. Focused on trusted and authorized sources.",
      "Version history",
      "Compatibility",
      "Clear metadata",
      "All rights reserved.",
      "Built for Android users worldwide.",
    ];

    for (const group of siteConfig.footerLinks) {
      texts.push(group.title);

      for (const link of group.links) {
        texts.push(link.label);
      }
    }

    return texts;
  }, []);

  const [translatedFooter, setTranslatedFooter] =
    useState<string[]>(footerSourceTexts);

  useEffect(() => {
    let cancelled = false;

    async function translateFooter() {
      if (languageCode === "en") {
        setTranslatedFooter(footerSourceTexts);
        return;
      }

      const translated =
        await translateMany(footerSourceTexts);

      if (!cancelled) {
        setTranslatedFooter(translated);
      }
    }

    translateFooter();

    return () => {
      cancelled = true;
    };
  }, [
    languageCode,
    translateMany,
    footerSourceTexts,
  ]);

  let translationIndex = 0;

  const brandDescription =
    translatedFooter[translationIndex++] ??
    footerSourceTexts[0];

  const trustText =
    translatedFooter[translationIndex++] ??
    footerSourceTexts[1];

  const versionHistoryText =
    translatedFooter[translationIndex++] ??
    "Version history";

  const compatibilityText =
    translatedFooter[translationIndex++] ??
    "Compatibility";

  const metadataText =
    translatedFooter[translationIndex++] ??
    "Clear metadata";

  const rightsReservedText =
    translatedFooter[translationIndex++] ??
    "All rights reserved.";

  const worldwideText =
    translatedFooter[translationIndex++] ??
    "Built for Android users worldwide.";

  const translatedGroups =
    siteConfig.footerLinks.map((group) => {
      const title =
        translatedFooter[translationIndex++] ??
        group.title;

      const links = group.links.map((link) => ({
        ...link,
        label:
          translatedFooter[translationIndex++] ??
          link.label,
      }));

      return {
        ...group,
        title,
        links,
      };
    });
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border/60 bg-slate-950 text-white">
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="absolute -bottom-48 right-0 h-96 w-96 rounded-full bg-fuchsia-600/[0.07] blur-[130px]" />

      <Container className="relative py-8 sm:py-10">
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-[1.35fr_repeat(3,1fr)]">
          {/* Brand */}
          <div>
            <div className="inline-flex rounded-xl bg-white p-2">
              <Logo />
            </div>

            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
              {brandDescription}
            </p>

            <div className="mt-3 inline-flex items-start gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] px-3.5 py-3 text-xs leading-5 text-slate-300">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

              <span>
                No piracy. No modded APKs. Focused on trusted
                and authorized sources.
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-violet-400" />
                {versionHistoryText}
              </span>

              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-violet-400" />
                {compatibilityText}
              </span>

              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-violet-400" />
                {metadataText}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {siteConfig.socials.facebook && (
                <a
                  href={siteConfig.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-sm transition hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg"
                >
                  <Facebook className="h-[18px] w-[18px] fill-white stroke-white" />
                </a>
              )}

              {siteConfig.socials.instagram && (
                <a
                  href={siteConfig.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#FEDA75] via-[#D62976] to-[#4F5BD5] text-white shadow-sm transition hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg"
                >
                  <Instagram className="h-[18px] w-[18px] stroke-[2.2]" />
                </a>
              )}

              {siteConfig.socials.youtube && (
                <a
                  href={siteConfig.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label="YouTube"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-sm transition hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg"
                >
                  <Youtube className="h-[19px] w-[19px] fill-white stroke-white" />
                </a>
              )}

              {siteConfig.socials.twitter && (
                <a
                  href={siteConfig.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label="X"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black text-white shadow-sm transition hover:-translate-y-0.5 hover:scale-105 hover:border-white/50 hover:shadow-lg"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-[15px] w-[15px] fill-current"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
                  </svg>
                </a>
              )}

              {siteConfig.socials.pinterest && (
                <a
                  href={siteConfig.socials.pinterest}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label="Pinterest"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E60023] text-white shadow-sm transition hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-[19px] w-[19px] fill-current"
                  >
                    <path d="M12 2C6.48 2 2 6.03 2 11c0 3.72 2.54 6.92 6.17 8.29-.08-.63-.16-1.6.03-2.29l1.18-4.74s-.3-.6-.3-1.49c0-1.39.81-2.43 1.82-2.43.86 0 1.27.64 1.27 1.42 0 .86-.55 2.14-.83 3.33-.24 1 .5 1.81 1.48 1.81 1.78 0 3.15-1.88 3.15-4.59 0-2.4-1.73-4.08-4.19-4.08-2.85 0-4.52 2.14-4.52 4.35 0 .86.33 1.79.75 2.29.08.1.09.18.07.28l-.28 1.14c-.05.18-.15.22-.34.13-1.26-.59-2.05-2.43-2.05-3.91 0-3.19 2.32-6.12 6.68-6.12 3.51 0 6.24 2.5 6.24 5.84 0 3.49-2.2 6.29-5.25 6.29-1.03 0-1.99-.53-2.32-1.16l-.63 2.4c-.23.88-.85 1.98-1.26 2.65.95.29 1.96.45 3.01.45 5.52 0 10-4.03 10-9S17.52 2 12 2Z" />
                  </svg>
                </a>
              )}
            </div>

          </div>
          {/* Links */}
          {translatedGroups.map((group) => (
            <div key={group.title}>
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-200">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                {group.title}
              </h3>

              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      <span className="mr-0 w-0 overflow-hidden text-violet-400 opacity-0 transition-all group-hover:mr-2 group-hover:w-3 group-hover:opacity-100">
                        →
                      </span>

                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-white/[0.08] pt-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} DroidZyra. All
              rights reserved.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              {worldwideText}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}









