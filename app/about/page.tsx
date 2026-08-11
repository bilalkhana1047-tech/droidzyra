import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  History,
  Search,
  ArrowRight,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'About DroidZyra',
  description:
    'Learn about DroidZyra, a platform for discovering Android apps, exploring version history, checking compatibility, and finding trusted app information and sources.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <Container className="py-10 lg:py-16">
      <div className="mx-auto max-w-4xl">
        {/* Hero */}
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Smartphone className="h-7 w-7" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            About DroidZyra
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            DroidZyra helps Android users discover apps, understand their
            versions, check device compatibility, and find reliable information
            about the apps they use.
          </p>
        </div>

        {/* Mission */}
        <section className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Our Mission</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-muted-foreground leading-7">
              <p>
                Finding the right Android app is often easy. Finding the right
                version, understanding whether it will work on a particular
                Android version, and knowing where an app comes from can be
                much harder.
              </p>

              <p>
                DroidZyra is built to make that information easier to
                understand. Instead of focusing only on app names and download
                buttons, we organize useful information around app versions,
                release history, compatibility, and available sources.
              </p>

              <p>
                Our goal is to provide a clear and useful reference point for
                Android users who want to make better-informed decisions about
                the apps they install and use.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* What we provide */}
        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold tracking-tight">
              What DroidZyra Provides
            </h2>
            <p className="mt-2 text-muted-foreground">
              We bring several pieces of Android app information together in
              one place.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard
              icon={<Search className="h-5 w-5" />}
              title="App Discovery"
              description="Browse and search Android apps by name, developer, package name, and category."
            />

            <InfoCard
              icon={<History className="h-5 w-5" />}
              title="Version History"
              description="Explore available app versions and their release information instead of seeing only the latest version."
            />

            <InfoCard
              icon={<Smartphone className="h-5 w-5" />}
              title="Compatibility"
              description="Check available compatibility information for different Android versions and understand which versions may work best."
            />

            <InfoCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Source Information"
              description="Understand the available source and verification information associated with listed app versions."
            />
          </div>
        </section>

        {/* Trust */}
        <section className="mt-10">
          <Card className="border-primary/20 bg-primary/[0.03]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Our Approach to Trust
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-muted-foreground leading-7">
              <p>
                DroidZyra aims to present app information as clearly and
                transparently as possible. Where verification or source
                information is available, it is displayed alongside the
                relevant app or version information.
              </p>

              <div className="space-y-3">
                <TrustPoint>
                  We distinguish between different types of app sources.
                </TrustPoint>

                <TrustPoint>
                  Version information is organized separately so users can
                  understand an app&apos;s release history.
                </TrustPoint>

                <TrustPoint>
                  Compatibility information is presented separately from basic
                  app information.
                </TrustPoint>

                <TrustPoint>
                  We do not intend to encourage the distribution of pirated or
                  modified applications.
                </TrustPoint>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Not a piracy platform */}
        <section className="mt-10">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                About App Downloads and Sources
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-muted-foreground leading-7">
              <p>
                DroidZyra is primarily an information and discovery platform.
                Our purpose is to help users understand apps, versions,
                compatibility, and available sources.
              </p>

              <p>
                We do not support software piracy, cracked applications,
                unauthorized modifications, or illegal distribution of
                copyrighted software. Users should always respect the
                developer&apos;s rights and applicable laws.
              </p>

              <p>
                When an official source is available, users should prefer the
                official source and follow the developer&apos;s terms and
                licensing requirements.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Who it's for */}
        <section className="mt-10">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Who Is DroidZyra For?
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-muted-foreground leading-7">
              <p>
                DroidZyra is designed for Android users who want more
                information before choosing or updating an app.
              </p>

              <ul className="space-y-3">
                <TrustPoint>
                  Users checking whether an app version supports their Android
                  version.
                </TrustPoint>

                <TrustPoint>
                  Users researching older or previous app versions.
                </TrustPoint>

                <TrustPoint>
                  Users comparing app information before installing or
                  updating.
                </TrustPoint>

                <TrustPoint>
                  Users looking for organized app and version information in
                  one place.
                </TrustPoint>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Explore */}
        <section className="mt-10 rounded-2xl border border-border bg-muted/30 p-6 sm:p-8">
          <h2 className="text-xl font-semibold">Explore DroidZyra</h2>

          <p className="mt-2 text-muted-foreground">
            Start exploring Android apps, versions, and compatibility
            information.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/apps"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Browse Apps
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/compatibility"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Check Compatibility
            </Link>
          </div>
        </section>
      </div>
    </Container>
  );
}

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>

        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function TrustPoint({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
      <span>{children}</span>
    </li>
  );
}