import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Layers,
  CheckCircle2,
  Sparkles,
  Search,
} from 'lucide-react';

import { Container } from '@/components/layout/container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'About DroidZyra',
  description:
    'Learn about DroidZyra, an Android app directory focused on app information, versions, compatibility and release history.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  const features = [
    {
      icon: Smartphone,
      title: 'App Information',
      description:
        'Explore app details, developers, package names and available Android information.',
    },
    {
      icon: Layers,
      title: 'Version History',
      description:
        'Browse available releases, version details and Android requirements.',
    },
    {
      icon: ShieldCheck,
      title: 'Compatibility',
      description:
        'Understand Android compatibility where structured records are available.',
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-primary/[0.08] via-background to-background" />

        <div className="absolute left-1/2 top-[-230px] -z-10 h-[500px] w-[850px] -translate-x-1/2 rounded-full bg-primary/[0.12] blur-3xl" />

        <Container className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/75 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-primary shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              About DroidZyra
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-[-0.045em] text-foreground sm:text-5xl lg:text-6xl">
              A clearer way to explore
              <span className="block bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                Android apps.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              DroidZyra brings app information, version history and Android
              compatibility details together so users can make more informed
              choices.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Clear metadata
              </span>

              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Version information
              </span>

              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Compatibility guidance
              </span>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative py-14 sm:py-18 lg:py-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/20 to-background" />

        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-5 sm:grid-cols-3">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="group overflow-hidden rounded-[22px] border-border/60 bg-background/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl"
                >
                  <CardContent className="p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <feature.icon className="h-5 w-5" />
                    </div>

                    <h2 className="mt-5 text-base font-bold text-foreground">
                      {feature.title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 overflow-hidden rounded-[28px] border border-border/60 bg-background shadow-[0_18px_55px_-35px_rgba(15,23,42,0.25)]">
              <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
                <div className="p-7 sm:p-9">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                    What you can find
                  </p>

                  <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                    Useful Android app information
                    in one place.
                  </h2>

                  <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground">
                    <p>
                      DroidZyra organizes Android applications into categories
                      so visitors can discover apps more easily.
                    </p>

                    <p>
                      Individual app pages can include developer information,
                      package names, versions, Android requirements,
                      compatibility records and release history.
                    </p>

                    <p>
                      The information shown depends on the records currently
                      available in the DroidZyra directory.
                    </p>
                  </div>

                  <Button
                    asChild
                    className="mt-7 h-11 rounded-xl px-5 shadow-md shadow-primary/15"
                  >
                    <Link href="/apps">
                      Browse Android Apps
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="border-t border-border/60 bg-gradient-to-br from-primary/[0.07] via-violet-500/[0.04] to-background p-7 lg:border-l lg:border-t-0 sm:p-9">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Search className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    Built for discovery
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Search by app name, developer or package, compare available
                    versions and use compatibility information to narrow down
                    the right option for your device.
                  </p>

                  <div className="mt-6 space-y-3">
                    {[
                      'Browse app categories',
                      'Compare available versions',
                      'Review Android requirements',
                      'Find source information when available',
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2.5 text-sm font-medium"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
