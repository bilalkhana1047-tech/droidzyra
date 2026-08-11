import Link from 'next/link';
import {
  Search,
  ShieldCheck,
  GitCompare,
  Smartphone,
  Layers,
  Eye,
  PackageCheck,
  ArrowRight,
  Sparkles,
  Wifi,
  type LucideIcon,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { HeroSearch } from '@/components/shared/hero-search';
import { AppCard } from '@/components/shared/app-card';
import { CategoryCard } from '@/components/shared/category-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { siteConfig, androidVersions } from '@/lib/site';
import { getPopularApps, getRecentlyUpdatedApps, getCategories } from '@/lib/data';
import { CompatibilityFinderWidget } from '@/components/shared/compatibility-finder-widget';

export default async function HomePage() {
  const [popular, recent, categories] = await Promise.all([
    getPopularApps(6),
    getRecentlyUpdatedApps(8),
    getCategories(),
  ]);

  return (
    <>
      <Hero />
      <PopularApps apps={popular} />
      <RecentlyUpdated apps={recent} />
      <CompatibilitySection categories={categories} />
      <CategoriesSection categories={categories} />
      <HowItWorks />
      <TrustSection />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-accent/5 to-background" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />
      <Container className="py-16 sm:py-24 lg:py-32 text-center">
        <Badge variant="secondary" className="mb-6 gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          {siteConfig.tagline}
        </Badge>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {siteConfig.heroHeadline}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-balance">
          {siteConfig.heroDescription}
        </p>
        <div className="mx-auto mt-8 max-w-2xl">
          <HeroSearch />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
          <Link href="/apps">
            <Button variant="default" className="gap-2 rounded-full">
              Browse All Apps
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/compatibility">
            <Button variant="outline" className="gap-2 rounded-full">
              <Smartphone className="h-4 w-4" />
              Compatibility Finder
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { icon: ShieldCheck, label: 'Verified Sources' },
            { icon: GitCompare, label: 'Version History' },
            { icon: Smartphone, label: 'Compatibility Check' },
            { icon: PackageCheck, label: 'Official Downloads' },
          ].map((f) => (
            <div
              key={f.label}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card/50 px-3 py-4"
            >
              <f.icon className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function PopularApps({ apps }: { apps: Awaited<ReturnType<typeof getPopularApps>> }) {
  if (apps.length === 0) return null;
  return (
    <section className="py-16 lg:py-20">
      <Container>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Popular Apps
            </h2>
            <p className="mt-1.5 text-muted-foreground">
              Discover apps other users are exploring right now.
            </p>
          </div>
          <Link
            href="/apps"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function RecentlyUpdated({ apps }: { apps: Awaited<ReturnType<typeof getRecentlyUpdatedApps>> }) {
  if (apps.length === 0) return null;
  return (
    <section className="py-16 lg:py-20 bg-muted/30 border-y border-border">
      <Container>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Recently Updated
            </h2>
            <p className="mt-1.5 text-muted-foreground">
              The latest versions, fresh from official sources.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {apps.slice(0, 4).map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function CompatibilitySection({ categories }: { categories: Awaited<ReturnType<typeof getCategories>> }) {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge variant="secondary" className="mb-4 gap-1.5">
              <Smartphone className="h-3.5 w-3.5" />
              Tool
            </Badge>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              DroidZyra Compatibility Finder
            </h2>
            <p className="mt-3 text-muted-foreground">
              Not sure if an app works on your device? Pick your Android version
              and an app, and we&apos;ll show you the compatible versions — based
              on structured data, not guesses.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Find versions that match your Android version',
                'Get a recommended version with clear reasoning',
                'See minimum Android requirements at a glance',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <ShieldCheck className="h-5 w-5 text-success shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/compatibility" className="inline-block mt-6">
              <Button className="gap-2">
                Open Compatibility Finder
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <Card className="p-6 bg-gradient-to-br from-card to-primary/5 border-primary/20">
            <CompatibilityFinderWidget categories={categories} />
          </Card>
        </div>
      </Container>
    </section>
  );
}

function CategoriesSection({ categories }: { categories: Awaited<ReturnType<typeof getCategories>> }) {
  if (categories.length === 0) return null;
  return (
    <section id="categories" className="py-16 lg:py-20 bg-muted/30 border-y border-border">
      <Container>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-center">
          Browse by Category
        </h2>
        <p className="mt-2 text-muted-foreground text-center mb-10">
          Explore apps across the categories that matter to you.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function HowItWorks() {
  const steps: { icon: LucideIcon; title: string; desc: string }[] = [
    {
      icon: Search,
      title: 'Search & Discover',
      desc: 'Find apps by name, developer, package name or category.',
    },
    {
      icon: Layers,
      title: 'Compare Versions',
      desc: 'Browse full version history with changelogs, file sizes and Android requirements.',
    },
    {
      icon: Smartphone,
      title: 'Check Compatibility',
      desc: 'Use the Compatibility Finder to match your Android version to the right app version.',
    },
    {
      icon: Eye,
      title: 'Verify & Download',
      desc: 'See verification status and get official, authorized source links — never pirated APKs.',
    },
  ];
  return (
    <section id="how-it-works" className="py-16 lg:py-24">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            How DroidZyra Works
          </h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
            Four simple steps to find the right app at the right version for your
            device.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Card key={step.title} className="relative p-6">
              <div className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-white text-sm font-bold shadow-sm">
                {i + 1}
              </div>
              <step.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

function TrustSection() {
  return (
    <section id="trust" className="py-16 lg:py-24 bg-muted/30 border-y border-border">
      <Container>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Badge variant="secondary" className="mb-4 gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              Trust & Verification
            </Badge>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              No Piracy. No Modded APKs. Ever.
            </h2>
            <p className="mt-3 text-muted-foreground">
              DroidZyra is built on safety principles. Here&apos;s exactly what we
              do — and don&apos;t do.
            </p>
          </div>
          <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: ShieldCheck,
                title: 'Official Sources Only',
                desc: 'We link to official stores and authorized distribution channels — never pirated, cracked or modded files.',
              },
              {
                icon: PackageCheck,
                title: 'Verification Labels',
                desc: 'Each version is clearly labeled as Verified or Unverified based on real data — we never claim verification that doesn\'t exist.',
              },
              {
                icon: Eye,
                title: 'Transparent Metadata',
                desc: 'SHA-256 hashes, version codes and changelogs are shown when available, with their source.',
              },
              {
                icon: Wifi,
                title: 'No Fake Stats',
                desc: 'No fabricated ratings, reviews or download counts. Demo data is clearly labeled during development.',
              },
            ].map((item) => (
              <Card key={item.title} className="p-5">
                <item.icon className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {item.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
        <div className="mt-8 rounded-xl border border-warning/30 bg-warning/5 p-4 text-sm text-foreground/80">
          <strong className="font-semibold">Demo data notice:</strong> This
          platform currently uses a small set of clearly labeled demo records for
          development. App names, versions and metadata are illustrative.
        </div>
      </Container>
    </section>
  );
}
