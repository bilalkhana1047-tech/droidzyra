'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { Screenshot } from '@/lib/types';

export function ScreenshotsGallery({
  screenshots,
  appName,
}: {
  screenshots: Screenshot[];
  appName: string;
}) {
  const [active, setActive] = useState<number | null>(null);

  if (screenshots.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No screenshots available for this app.
      </p>
    );
  }

  const current =
    active !== null
      ? screenshots[active]
      : null;

  const activeIndex = active ?? -1;

  const go = (dir: number) => {
    if (active === null) return;

    const next = active + dir;

    if (
      next >= 0 &&
      next < screenshots.length
    ) {
      setActive(next);
    }
  };

  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
        {screenshots.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActive(i)}
            className="shrink-0 snap-start rounded-lg overflow-hidden border border-border hover:border-primary/40 transition-colors"
            aria-label={`View screenshot ${i + 1}: ${
              s.alt_text ?? appName
            }`}
          >
            <Image
              src={s.image_url}
              alt={
                s.alt_text ??
                `${appName} screenshot ${i + 1}`
              }
              width={180}
              height={320}
              className="h-40 w-auto sm:h-56 object-cover"
              unoptimized
            />
          </button>
        ))}
      </div>

      {current && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${appName} screenshot`}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            onClick={() => setActive(null)}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {activeIndex > 0 && (
            <button
              className="absolute left-4 text-white/80 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              aria-label="Previous"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          {activeIndex <
            screenshots.length - 1 && (
            <button
              className="absolute right-4 text-white/80 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              aria-label="Next"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}

          <Image
            src={current.image_url}
            alt={
              current.alt_text ??
              `${appName} screenshot`
            }
            width={400}
            height={711}
            className="max-h-[85vh] w-auto rounded-lg object-contain"
            unoptimized
            onClick={(e) =>
              e.stopPropagation()
            }
          />
        </div>
      )}
    </>
  );
}
