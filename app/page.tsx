import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Eye,
  GitCompare,
  PackageCheck,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wifi,
  Zap,
  type LucideIcon,
} from 'lucide-react';

import { Container } from '@/components/layout/container';
import { HeroSearch } from '@/components/shared/hero-search';
import { HeroAnimatedBackground } from '@/components/shared/hero-animated-background';
import { AppCard } from '@/components/shared/app-card';
import { CategoryCard } from '@/components/shared/category-card';
import { CompatibilityFinderWidget } from '@/components/shared/compatibility-finder-widget';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import { siteConfig } from '@/lib/site';
import {
  getPopularApps,
  getRecentlyUpdatedApps,
  getTrendingApps,
  getCategories,
  getApps,
} from '@/lib/data';

export default async function HomePage() {
  const [{ apps }, popular, trending, recent, categories] = await Promise.all([
    getApps({ limit: 20 }),
    getPopularApps(6),
    getTrendingApps(6),
    getRecentlyUpdatedApps(8),
    getCategories(),
  ]);

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <Hero />

      <div className="relative">
        <TrustStrip />

        <PopularApps apps={popular} />

        <TrendingApps apps={trending} />

        <CompatibilitySection apps={apps} />

        <RecentlyUpdated apps={recent} />

        <CategoriesSection categories={categories} />

        <HowItWorks />

        <TrustSection />

        <FinalCTA />
      </div>
    </main>
  );
}

/* =========================================================
   HERO
========================================================= */

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Premium animated background */}
      <HeroAnimatedBackground />


      <Container>
        <div className="mx-auto flex max-w-5xl flex-col items-center px-4 pb-16 pt-16 text-center sm:pb-20 sm:pt-24 lg:pt-28">
          {/* Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/70 px-4 py-2 text-xs font-semibold text-primary shadow-sm backdrop-blur">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-3 w-3" />
            </span>
            {siteConfig.tagline}
            <ChevronRight className="h-3 w-3 opacity-60" />
          </div>

          {/* Headline */}
          <h1 className="max-w-4xl text-4xl font-black tracking-[-0.045em] text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Find the right
            <span className="block bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              app version
            </span>
            for your device.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Discover Android apps, compare versions, check compatibility,
            and find trusted download sources — all in one place.
          </p>

          {/* Search */}
          <div className="mt-9 w-full max-w-2xl">
            <div className="rounded-[22px] border border-border/70 bg-background/80 p-2 shadow-[0_20px_70px_-25px_hsl(var(--primary)/0.35)] backdrop-blur-xl">
              <HeroSearch />
            </div>

            <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Version history
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Compatibility check
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Trusted sources
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-xl px-6 shadow-lg shadow-primary/20"
            >
              <Link href="/apps">
                Browse All Apps
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-xl bg-background/60 px-6 backdrop-blur"
            >
              <Link href="/compatibility">
                <Smartphone className="mr-2 h-4 w-4" />
                Compatibility Finder
              </Link>
            </Button>
          </div>

          {/* Feature cards */}
          <div className="mt-14 grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {[
              {
                icon: ShieldCheck,
                title: 'Verified Sources',
              },
              {
                icon: GitCompare,
                title: 'Version History',
              },
              {
                icon: Smartphone,
                title: 'Compatibility',
              },
              {
                icon: PackageCheck,
                title: 'Trusted Downloads',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-border/60 bg-background/65 p-4 shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg"
              >
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <item.icon className="h-4.5 w-4.5" />
                </div>

                <p className="mt-3 text-xs font-semibold text-foreground">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* =========================================================
   TRUST STRIP
========================================================= */

function TrustStrip() {
  return (
    <section className="border-y border-border/60 bg-muted/20">
      <Container>
        <div className="grid grid-cols-2 divide-x divide-border/60 sm:grid-cols-4">
          {[
            ['Safe', 'No pirated APKs'],
            ['Transparent', 'Clear metadata'],
            ['Compatible', 'Android requirements'],
            ['Updated', 'Latest versions'],
          ].map(([title, desc]) => (
            <div key={title} className="px-4 py-5 text-center sm:py-6">
              <p className="text-sm font-bold">{title}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* =========================================================
   POPULAR APPS
========================================================= */

function TrendingApps({
  apps,
}: {
  apps: Awaited<ReturnType<typeof getTrendingApps>>;
}) {
  if (apps.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-y border-border/50 bg-gradient-to-b from-orange-500/[0.025] via-background to-background py-16 sm:py-20 lg:py-24">
      <div className="absolute right-[-120px] top-[-100px] -z-10 h-80 w-80 rounded-full bg-orange-500/[0.07] blur-3xl" />

      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/[0.07] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-orange-600">
              <Zap className="h-3.5 w-3.5" />
              Trending APKs
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Trending right now
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              Apps currently getting attention, selected from trending searches
              and updated DroidZyra records.
            </p>
          </div>

          <Button
            asChild
            variant="ghost"
            className="w-fit rounded-xl text-primary hover:text-primary"
          >
            <Link href="/apps">
              Browse all apps
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <div
              key={app.id}
              className="group relative rounded-[22px] border border-border/60 bg-background/90 p-1 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/20 hover:shadow-xl"
            >
              <div className="absolute right-4 top-4 z-10 rounded-full bg-orange-700 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                Trending
              </div>

              <AppCard app={app} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
function PopularApps({
  apps,
}: {
  apps: Awaited<ReturnType<typeof getPopularApps>>;
}) {
  if (apps.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-background via-primary/[0.025] to-background" />

      <div className="absolute -left-40 top-20 -z-10 h-80 w-80 rounded-full bg-primary/[0.07] blur-3xl" />

      <div className="absolute -right-40 bottom-0 -z-10 h-80 w-80 rounded-full bg-violet-500/[0.06] blur-3xl" />

      <Container>
        <SectionHeader
          eyebrow="DISCOVER"
          title="Popular Apps"
          description="Explore popular Android apps and find the right version for your device."
          href="/apps"
          linkText="View all apps"
        />

        <div className="mt-9 rounded-[28px] border border-border/60 bg-background/70 p-4 shadow-[0_20px_70px_-40px_hsl(var(--primary)/0.35)] backdrop-blur-xl sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {apps.slice(0, 6).map((app) => (
              <div
                key={app.id}
                className="group rounded-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <AppCard app={app} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Verified metadata
          </span>

          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Version history
          </span>

          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Android requirements
          </span>
        </div>
      </Container>
    </section>
  );
}

/* =========================================================
   COMPATIBILITY
========================================================= */

function CompatibilitySection({
  apps,
}: {
  apps: Awaited<ReturnType<typeof getApps>>['apps'];
}) {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 -z-10 bg-muted/30" />

      <div className="absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <Container>
        <div className="overflow-hidden rounded-[28px] border border-primary/15 bg-gradient-to-br from-primary/[0.08] via-background to-violet-500/[0.06] shadow-xl shadow-primary/[0.05]">
          <div className="grid lg:grid-cols-[1fr_1.1fr]">
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <Badge
                variant="secondary"
                className="mb-5 w-fit gap-1.5 rounded-full px-3 py-1"
              >
                <Zap className="h-3.5 w-3.5 text-primary" />
                Smart Tool
              </Badge>

              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Will this app work
                <span className="block text-primary">
                  on your Android?
                </span>
              </h2>

              <p className="mt-4 max-w-lg leading-7 text-muted-foreground">
                Stop guessing. Match your Android version with available app
                versions and quickly find the versions that meet the minimum
                requirements.
              </p>

              <div className="mt-7 space-y-3">
                {[
                  'Find versions compatible with your Android version',
                  'See minimum Android requirements instantly',
                  'Get a clear recommended version',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-medium"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>

              <Button asChild className="mt-8 w-fit rounded-xl">
                <Link href="/compatibility">
                  Open Compatibility Finder
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="border-t border-border/60 bg-background/50 p-5 sm:p-8 lg:border-l lg:border-t-0">
              <div className="rounded-2xl border border-border/60 bg-background p-4 shadow-sm sm:p-6">
                <CompatibilityFinderWidget apps={apps} />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* =========================================================
   RECENT
========================================================= */

function RecentlyUpdated({
  apps,
}: {
  apps: Awaited<ReturnType<typeof getRecentlyUpdatedApps>>;
}) {
  if (apps.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-y border-border/50 bg-muted/20 py-16 sm:py-20 lg:py-24">
      <div className="absolute right-[-120px] top-[-120px] -z-10 h-80 w-80 rounded-full bg-primary/[0.08] blur-3xl" />

      <Container>
        <div className="rounded-[30px] border border-border/60 bg-background/80 p-5 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.22)] backdrop-blur sm:p-8">
          <SectionHeader
            eyebrow="LATEST UPDATES"
            title="Recently Updated"
            description="Stay up to date with fresh app versions, requirements and metadata."
            href="/apps?sort=updated"
            linkText="See all updates"
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {apps.slice(0, 4).map((app) => (
              <div
                key={app.id}
                className="group relative transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute -top-2 right-3 z-10 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 shadow-sm">
                  Updated
                </div>

                <AppCard app={app} />
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-col gap-3 border-t border-border/60 pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Latest metadata
              </span>

              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Android requirements
              </span>
            </div>

            <span className="font-medium">
              Updated app information at a glance
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* =========================================================
   CATEGORIES
========================================================= */

function CategoriesSection({
  categories,
}: {
  categories: Awaited<ReturnType<typeof getCategories>>;
}) {
  if (categories.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-background via-violet-500/[0.025] to-background" />

      <div className="absolute left-[-120px] top-1/2 -z-10 h-80 w-80 -translate-y-1/2 rounded-full bg-fuchsia-500/[0.06] blur-3xl" />

      <Container>
        <SectionHeader
          eyebrow="EXPLORE"
          title="Browse by Category"
          description="Discover Android apps organized around what you need."
        />

        <div className="mt-9 rounded-[28px] border border-border/60 bg-background/75 p-5 shadow-[0_20px_60px_-38px_rgba(76,29,149,0.22)] backdrop-blur sm:p-7">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.slice(0, 6).map((category, index) => (
              <div
                key={category.id}
                className="group relative rounded-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`absolute inset-x-4 top-0 h-1 rounded-full ${
                    index % 6 === 0
                      ? "bg-violet-500"
                      : index % 6 === 1
                        ? "bg-blue-500"
                        : index % 6 === 2
                          ? "bg-emerald-500"
                          : index % 6 === 3
                            ? "bg-amber-500"
                            : index % 6 === 4
                              ? "bg-pink-500"
                              : "bg-cyan-500"
                  }`}
                />

                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Browse categories to quickly find apps that match your needs.
        </div>
      </Container>
    </section>
  );
}

/* =========================================================
   HOW IT WORKS
========================================================= */

function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Search,
      title: 'Search',
      desc: 'Find the Android app you are looking for.',
    },
    {
      number: '02',
      icon: GitCompare,
      title: 'Compare Versions',
      desc: 'Review version history, requirements and release details.',
    },
    {
      number: '03',
      icon: Smartphone,
      title: 'Check Compatibility',
      desc: 'See whether a version matches your Android device.',
    },
    {
      number: '04',
      icon: ShieldCheck,
      title: 'Choose Safely',
      desc: 'Use trusted source information and available verification details.',
    },
  ];

  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-muted/20 py-16 sm:py-20 lg:py-24">
      <div className="absolute left-1/2 top-1/2 -z-10 h-[420px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.05] blur-3xl" />

      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            SIMPLE PROCESS
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Find the right app version
            <span className="block bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              in four simple steps.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            DroidZyra helps you move from discovery to compatibility
            information without unnecessary complexity.
          </p>
        </div>

        <div className="relative mt-12">
          <div className="absolute left-[12%] right-[12%] top-10 hidden h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent lg:block" />

          <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="group relative rounded-[24px] border border-border/60 bg-background/85 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/25 hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <step.icon className="h-5 w-5" />
                  </div>

                  <span className="text-3xl font-black tracking-tight text-primary transition-colors group-hover:text-primary/80">
                    {step.number}
                  </span>
                </div>

                <div className="mt-6">
                  <div className="mb-3 h-1 w-8 rounded-full bg-primary/60 transition-all duration-300 group-hover:w-14" />

                  <h3 className="text-base font-bold tracking-tight text-foreground">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-xl bg-background/70 px-5 shadow-sm backdrop-blur"
          >
            <Link href="/apps">
              Start exploring
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}

/* =========================================================
   TRUST
========================================================= */

function TrustSection() {
  const items = [
    {
      number: '01',
      icon: ShieldCheck,
      title: 'Official Sources',
      desc: 'We focus on official stores and authorized distribution channels.',
    },
    {
      number: '02',
      icon: PackageCheck,
      title: 'Clear Verification',
      desc: 'Verification labels are based on available source data.',
    },
    {
      number: '03',
      icon: Eye,
      title: 'Transparent Metadata',
      desc: 'Version codes, hashes and requirements are shown when available.',
    },
    {
      number: '04',
      icon: Wifi,
      title: 'No Fake Numbers',
      desc: 'No fabricated ratings, reviews or download statistics.',
    },
  ];

  return (
    <section
      id="trust"
      className="relative overflow-hidden border-y border-white/5 bg-slate-950 py-16 text-white sm:py-20 lg:py-24"
    >
      <div className="absolute left-[-160px] top-[-100px] h-[420px] w-[420px] rounded-full bg-violet-600/15 blur-[120px]" />

      <div className="absolute bottom-[-180px] right-[-100px] h-[440px] w-[440px] rounded-full bg-fuchsia-600/10 blur-[130px]" />

      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <Container>
        <div className="relative grid gap-12 lg:grid-cols-[0.85fr_1.4fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-violet-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Trust & Verification
            </div>

            <h2 className="mt-6 max-w-md text-3xl font-black tracking-[-0.035em] sm:text-4xl lg:text-5xl">
              Built around
              <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-purple-300 bg-clip-text text-transparent">
                transparency.
              </span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400 sm:text-base">
              DroidZyra helps you understand app versions, requirements
              and available source information before making a choice.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-slate-300">
                Clear metadata
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-slate-300">
                Version details
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-slate-300">
                Source transparency
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <div
                key={item.number}
                className="group relative overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.045] p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/25 hover:bg-white/[0.07]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/10 text-violet-300 transition-colors group-hover:bg-violet-500 group-hover:text-white">
                    <item.icon className="h-5 w-5" />
                  </div>

                  <span className="text-2xl font-black text-white/[0.07]">
                    {item.number}
                  </span>
                </div>

                <h3 className="mt-5 text-base font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {item.desc}
                </p>

                <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300 group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* =========================================================
   FINAL CTA
========================================================= */

function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-[32px] border border-primary/20 bg-gradient-to-br from-primary via-violet-600 to-fuchsia-600 px-6 py-12 text-white shadow-[0_30px_100px_-35px_hsl(var(--primary)/0.65)] sm:px-10 sm:py-14 lg:px-14">
          
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/15 blur-3xl" />

          <div className="absolute -bottom-32 left-[20%] h-80 w-80 rounded-full bg-black/15 blur-3xl" />

          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)',
              backgroundSize: '42px 42px',
            }}
          />

          <div className="relative grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Ready to explore?
              </div>

              <h2 className="mt-6 max-w-2xl text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                Find the right app version
                <span className="block text-white/75">
                  for your Android device.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
                Search apps, compare version details and check compatibility
                before choosing the version that fits your device.
              </p>

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-white/75">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Version history
                </span>

                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Compatibility details
                </span>

                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Source information
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="h-12 w-full rounded-xl px-6 font-bold shadow-xl sm:w-auto"
              >
                <Link href="/apps">
                  Explore Apps
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 w-full rounded-xl border-white/20 bg-white/10 px-6 font-semibold text-white backdrop-blur hover:bg-white/20 hover:text-white sm:w-auto"
              >
                <Link href="/compatibility">
                  <Smartphone className="mr-2 h-4 w-4" />
                  Check Compatibility
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  linkText,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href?: string;
  linkText?: string;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
          {title}
        </h2>

        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>

      {href && linkText && (
        <Button
          asChild
          variant="ghost"
          className="w-fit rounded-xl px-3 text-primary hover:text-primary"
        >
          <Link href={href}>
            {linkText}
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}











