import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Eye,
  GitCompare,
  Layers,
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
import { AppCard } from '@/components/shared/app-card';
import { CategoryCard } from '@/components/shared/category-card';
import { CompatibilityFinderWidget } from '@/components/shared/compatibility-finder-widget';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import { siteConfig, androidVersions } from '@/lib/site';
import {
  getPopularApps,
  getRecentlyUpdatedApps,
  getCategories,
} from '@/lib/data';

export default async function HomePage() {
  const [popular, recent, categories] = await Promise.all([
    getPopularApps(6),
    getRecentlyUpdatedApps(8),
    getCategories(),
  ]);

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <Hero />

      <div className="relative">
        <TrustStrip />

        <PopularApps apps={popular} />

        <CompatibilitySection />

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
      {/* Background */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            'linear-gradient(180deg, hsl(var(--primary) / 0.08) 0%, hsl(var(--background)) 72%)',
        }}
      />

      <div
        className="absolute left-1/2 top-[-220px] -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, hsl(var(--primary) / 0.20), transparent 68%)',
        }}
      />

      <div
        className="absolute right-[-180px] top-[180px] -z-10 h-[380px] w-[380px] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, hsl(250 90% 65% / 0.12), transparent 70%)',
        }}
      />

      <div
        className="absolute inset-0 -z-10 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

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

function PopularApps({
  apps,
}: {
  apps: Awaited<ReturnType<typeof getPopularApps>>;
}) {
  if (apps.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow="DISCOVER"
          title="Popular Apps"
          description="Explore apps people are checking out right now."
          href="/apps"
          linkText="View all apps"
        />

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {apps.slice(0, 6).map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </Container>
    </section>
  );
}

/* =========================================================
   COMPATIBILITY
========================================================= */

function CompatibilitySection() {
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
                <span className="block text-primary">on your Android?</span>
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

              <Button
                asChild
                className="mt-8 w-fit rounded-xl"
              >
                <Link href="/compatibility">
                  Open Compatibility Finder
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="border-t border-border/60 bg-background/50 p-5 sm:p-8 lg:border-l lg:border-t-0">
              <div className="rounded-2xl border border-border/60 bg-background p-4 shadow-sm sm:p-6">
                <CompatibilityFinderWidget />
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
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow="LATEST"
          title="Recently Updated"
          description="Fresh app versions and the latest metadata."
          href="/apps?sort=updated"
          linkText="See updates"
        />

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {apps.slice(0, 4).map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
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
    <section className="border-y border-border/60 bg-muted/20 py-16 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow="EXPLORE"
          title="Browse by Category"
          description="Find apps based on what you need."
        />

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.slice(0, 6).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </section>
  );
}

/* =========================================================
   HOW IT WORKS
========================================================= */

function HowItWorks() {
  const steps: {
    icon: LucideIcon;
    number: string;
    title: string;
    desc: string;
  }[] = [
    {
      number: '01',
      icon: Search,
      title: 'Search',
      desc: 'Find an app by name, developer, package or category.',
    },
    {
      number: '02',
      icon: GitCompare,
      title: 'Compare',
      desc: 'Explore versions, release dates, requirements and metadata.',
    },
    {
      number: '03',
      icon: Smartphone,
      title: 'Check',
      desc: 'Match the app version against your Android version.',
    },
    {
      number: '04',
      icon: ShieldCheck,
      title: 'Verify',
      desc: 'Use trusted and authorized sources for downloads.',
    },
  ];

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            SIMPLE PROCESS
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Everything you need in four steps
          </h2>

          <p className="mt-4 text-muted-foreground">
            DroidZyra makes finding the right Android app version simple.
          </p>
        </div>

        <div className="relative mt-12 grid gap-5 md:grid-cols-4">
          <div className="absolute left-[12%] right-[12%] top-10 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />

          {steps.map((step) => (
            <Card
              key={step.number}
              className="relative border-border/60 bg-background/80 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="relative flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <step.icon className="h-5 w-5" />
                  </div>

                  <span className="text-xs font-black text-muted-foreground/50">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-6 font-bold">{step.title}</h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {step.desc}
                </p>
              </CardContent>
            </Card>
          ))}
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
      icon: ShieldCheck,
      title: 'Official Sources',
      desc: 'We focus on official stores and authorized distribution channels.',
    },
    {
      icon: PackageCheck,
      title: 'Clear Verification',
      desc: 'Verification labels are based on available source data.',
    },
    {
      icon: Eye,
      title: 'Transparent Metadata',
      desc: 'Version codes, hashes and requirements are shown when available.',
    },
    {
      icon: Wifi,
      title: 'No Fake Numbers',
      desc: 'No fabricated ratings, reviews or download statistics.',
    },
  ];

  return (
    <section className="border-t border-border/60 bg-slate-950 py-16 text-white sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:items-center">
          <div>
            <Badge className="border-white/10 bg-white/10 text-white hover:bg-white/10">
              TRUST & VERIFICATION
            </Badge>

            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Built around
              <span className="block text-primary-foreground">
                transparency.
              </span>
            </h2>

            <p className="mt-4 max-w-md leading-7 text-slate-400">
              DroidZyra is designed to help users understand app versions
              instead of blindly downloading files.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:bg-white/[0.07]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>

                <h3 className="mt-4 font-bold">{item.title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {item.desc}
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
   FINAL CTA
========================================================= */

function FinalCTA() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-primary via-violet-600 to-fuchsia-600 p-8 text-white shadow-2xl shadow-primary/20 sm:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-black/10 blur-3xl" />

          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold text-white/75">
                READY TO EXPLORE?
              </p>

              <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
                Find the app version that fits your device.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">
                Search apps, compare versions and check compatibility with
                DroidZyra.
              </p>
            </div>

            <Button
              asChild
              size="lg"
              variant="secondary"
              className="shrink-0 rounded-xl px-6 font-bold shadow-lg"
            >
              <Link href="/apps">
                Explore Apps
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
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