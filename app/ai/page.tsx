"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  History,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
  Clock3,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Search,
    title: "Discover Android Apps",
    description:
      "Search and explore Android apps by name, category, developer and useful app information.",
  },
  {
    icon: Smartphone,
    title: "Check Compatibility",
    description:
      "Find Android compatibility information using DroidZyra database records.",
  },
  {
    icon: History,
    title: "Explore Version History",
    description:
      "Review available versions, release dates, Android requirements and version details.",
  },
  {
    icon: ShieldCheck,
    title: "Database-backed Answers",
    description:
      "DroidZyra AI is being designed around available app and compatibility data.",
  },
  {
    icon: Zap,
    title: "Faster Answers",
    description:
      "Ask app and Android questions in natural language when DroidZyra AI launches.",
  },
  {
    icon: CheckCircle2,
    title: "Clear Recommendations",
    description:
      "Version and compatibility information will be presented in a simple, useful format.",
  },
];

export default function AIPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-primary/[0.08] via-background to-background" />

        <div className="absolute left-1/2 top-[-230px] -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-primary/[0.13] blur-3xl" />

        <div className="absolute right-[-180px] top-32 -z-10 h-80 w-80 rounded-full bg-violet-500/[0.08] blur-3xl" />

        <Container className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-lg shadow-primary/10">
              <Sparkles className="h-8 w-8" />
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <Clock3 className="h-3.5 w-3.5" />
              DroidZyra AI
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              DroidZyra AI is
              <span className="block bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                coming soon.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              We&apos;re building an Android app assistant focused on app
              discovery, version history and compatibility information.
            </p>

            <Card className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-[26px] border-primary/15 bg-background/85 shadow-[0_25px_80px_-40px_hsl(var(--primary)/0.45)] backdrop-blur">
              <CardContent className="p-6 sm:p-8">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>

                <h2 className="mt-5 text-xl font-black tracking-tight sm:text-2xl">
                  AI answers are temporarily unavailable
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                  The AI feature is currently being prepared for public use.
                  In the meantime, you can browse apps, compare versions and
                  use the Compatibility Finder.
                </p>

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button
                    asChild
                    className="h-11 rounded-xl px-5 shadow-md shadow-primary/15"
                  >
                    <Link href="/apps">
                      Browse Apps
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="h-11 rounded-xl bg-background px-5"
                  >
                    <Link href="/compatibility">
                      <Smartphone className="mr-2 h-4 w-4" />
                      Compatibility Finder
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      <section className="relative py-14 sm:py-18 lg:py-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/20 to-background" />

        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                Planned Features
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                What DroidZyra AI will help with
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                The goal is to combine DroidZyra&apos;s app, version and
                compatibility data into a simpler question-and-answer experience.
              </p>
            </div>

            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="group overflow-hidden rounded-[22px] border-border/60 bg-background/85 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl"
                >
                  <CardContent className="p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <feature.icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-5 text-base font-bold text-foreground">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
