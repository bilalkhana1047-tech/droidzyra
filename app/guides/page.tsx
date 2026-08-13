import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Clock3,
  CalendarDays,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

import { guides } from '@/lib/guides';
import { Container } from '@/components/layout/container';

export const metadata: Metadata = {
  title: 'Android Guides & Tips',
  description:
    'Learn about Android app compatibility, app versions, APKs, safe downloads and Android basics with DroidZyra guides.',
};

const categories = [
  'All',
  'Compatibility',
  'App Versions',
  'Android Basics',
  'Safe Downloads',
] as const;

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-primary/[0.08] via-background to-background" />

        <div className="absolute left-1/2 top-[-230px] -z-10 h-[500px] w-[850px] -translate-x-1/2 rounded-full bg-primary/[0.12] blur-3xl" />

        <Container className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/75 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-primary shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              DroidZyra Guides
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              Android Guides
              <span className="block bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                & useful tips.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Learn about app compatibility, versions, APK basics,
              safe downloads and Android essentials with clear,
              practical guides.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Beginner friendly
              </span>

              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Android focused
              </span>

              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Practical explanations
              </span>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/20 to-background" />

        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {categories.map((category, index) => (
                <span
                  key={category}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                    index === 0
                      ? 'border-primary/20 bg-primary/10 text-primary'
                      : 'border-border/60 bg-background text-muted-foreground'
                  }`}
                >
                  {category}
                </span>
              ))}
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {guides.map((guide) => (
                <article
                  key={guide.slug}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-border/60 bg-background/85 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500 opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <BookOpen className="h-5 w-5" />
                    </div>

                    <span className="rounded-full border border-border/60 bg-muted/25 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                      {guide.category}
                    </span>
                  </div>

                  <h2 className="mt-5 text-xl font-bold tracking-tight text-foreground">
                    {guide.title}
                  </h2>

                  <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
                    {guide.description}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/60 pt-4 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5" />
                      {guide.readTime}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {new Date(guide.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <Link
                    href={`/guides/${guide.slug}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-primary/80"
                  >
                    Read guide
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
