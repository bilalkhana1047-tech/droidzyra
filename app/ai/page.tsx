import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Search,
  Smartphone,
  Sparkles,
  History,
  ShieldCheck,
  Zap,
} from 'lucide-react';

import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'AI Android App Finder — Smart App Discovery',
  description:
    'Use DroidZyra AI to discover Android apps, compare versions, understand compatibility and find the right app for your device.',
  keywords: [
    'AI Android app finder',
    'Android app finder',
    'Android app discovery',
    'Android compatibility checker',
    'app version checker',
    'Android app versions',
    'APK version history',
    'DroidZyra AI',
  ],
  alternates: {
    canonical: '/ai',
  },
  openGraph: {
    title: 'DroidZyra AI — Smart Android App Discovery',
    description:
      'Discover Android apps, understand compatibility and explore app versions with DroidZyra.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DroidZyra AI — Smart Android App Discovery',
    description:
      'Discover Android apps, understand compatibility and explore app versions with DroidZyra.',
  },
};

const features = [
  {
    icon: Search,
    title: 'Discover Android Apps',
    description:
      'Search and explore Android apps by name, category, developer and useful app information.',
  },
  {
    icon: Smartphone,
    title: 'Check Android Compatibility',
    description:
      'Understand Android requirements and find versions that are suitable for your device.',
  },
  {
    icon: History,
    title: 'Explore Version History',
    description:
      'Compare available versions, release dates, Android requirements and important version details.',
  },
  {
    icon: ShieldCheck,
    title: 'Review Trusted Sources',
    description:
      'Check verification information and available source links before choosing an app version.',
  },
  {
    icon: Zap,
    title: 'Find Faster',
    description:
      'Use DroidZyra tools to reduce the guesswork when looking for the right Android app.',
  },
  {
    icon: CheckCircle2,
    title: 'Choose With Confidence',
    description:
      'Make better decisions using app details, compatibility information and version data together.',
  },
];

const faqs = [
  {
    question: 'What is DroidZyra AI?',
    answer:
      'DroidZyra AI is a smart app discovery experience designed to help users explore Android apps, understand compatibility and find useful version information.',
  },
  {
    question: 'Can DroidZyra check Android compatibility?',
    answer:
      'Yes. DroidZyra provides compatibility information for supported apps and Android versions through its Compatibility Finder.',
  },
  {
    question: 'Can I find older Android app versions?',
    answer:
      'For apps with version history available, DroidZyra lets you explore previous versions and their release information.',
  },
  {
    question: 'Does DroidZyra provide APK files directly?',
    answer:
      'DroidZyra focuses on app discovery, version information, compatibility and source links. Always review the available source and verification information before downloading software.',
  },
];

export default function AIPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'DroidZyra AI — Smart Android App Discovery',
    description:
      'Discover Android apps, understand compatibility and explore app versions with DroidZyra.',
    url: 'https://droidzyra.app/ai',
    isPartOf: {
      '@type': 'WebSite',
      name: 'DroidZyra',
      url: 'https://droidzyra.app',
    },
  };

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.14),transparent_35%)]" />

        <Container className="py-16 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-lg shadow-primary/10">
              <Sparkles className="h-8 w-8" />
            </div>

            <div className="mt-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              DroidZyra AI
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Find the right Android app
              <span className="block bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                smarter and faster.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Discover Android apps, explore version history, understand
              compatibility and make better choices for your device with
              DroidZyra.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-xl px-6 shadow-lg shadow-primary/20"
              >
                <Link href="/apps">
                  Explore Android Apps
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-xl px-6"
              >
                <Link href="/compatibility">
                  <Smartphone className="mr-2 h-4 w-4" />
                  Check Compatibility
                </Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                App discovery
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Version history
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Compatibility data
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* FEATURES */}
      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              SMART APP DISCOVERY
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Everything you need before choosing an app
            </h2>

            <p className="mt-4 leading-7 text-muted-foreground">
              DroidZyra brings app information, version history and Android
              compatibility together so you can spend less time searching and
              more time choosing.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Card
                  key={feature.title}
                  className="group border-border/60 bg-card/70 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
                >
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-5 text-base font-bold">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-border/60 bg-muted/20 py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              HOW IT WORKS
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Find what you need in three steps
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
            {[
              {
                number: '01',
                title: 'Search',
                text: 'Explore the DroidZyra app directory and find the Android app you need.',
              },
              {
                number: '02',
                title: 'Understand',
                text: 'Review versions, Android requirements, compatibility and other important details.',
              },
              {
                number: '03',
                title: 'Choose',
                text: 'Select the version and source information that best matches your device and needs.',
              },
            ].map((step) => (
              <div
                key={step.number}
                className="relative rounded-2xl border border-border/60 bg-background p-7"
              >
                <span className="text-sm font-black text-primary">
                  {step.number}
                </span>

                <h3 className="mt-4 text-lg font-bold">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                FAQ
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Frequently asked questions
              </h2>
            </div>

            <div className="mt-10 space-y-4">
              {faqs.map((faq) => (
                <Card
                  key={faq.question}
                  className="border-border/60"
                >
                  <CardContent className="p-6">
                    <h3 className="font-bold">
                      {faq.question}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-16 sm:pb-20 lg:pb-24">
        <Container>
          <div className="relative overflow-hidden rounded-[28px] border border-primary/20 bg-gradient-to-br from-primary/15 via-background to-violet-500/15 p-8 text-center shadow-xl shadow-primary/5 sm:p-12">
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>

              <h2 className="mt-5 text-2xl font-black tracking-tight sm:text-3xl">
                Ready to find your next Android app?
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                Explore DroidZyra's app directory or check compatibility to
                find information that fits your Android device.
              </p>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  asChild
                  className="rounded-xl"
                >
                  <Link href="/apps">
                    Browse App Directory
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="rounded-xl"
                >
                  <Link href="/compatibility">
                    Check Compatibility
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
