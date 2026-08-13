"use client";

import { FormEvent, useState } from "react";
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
  Send,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type AIResponse = {
  answer?: string;
  error?: string;
  detected?: {
    androidVersion: string | null;
    ramGb: number | null;
  };
};

const examples = [
  "My phone has Android 10 and 3GB RAM. Which version should I use?",
  "Which apps support Android 8?",
  "What is the latest version available?",
  "Which version is compatible with Android 15?",
];

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
      "Find compatibility information for supported Android versions using DroidZyra database data.",
  },
  {
    icon: History,
    title: "Explore Version History",
    description:
      "Review available versions, release dates, Android requirements and version details.",
  },
  {
    icon: ShieldCheck,
    title: "Use Verified Information",
    description:
      "DroidZyra AI uses available database information instead of inventing app specifications.",
  },
  {
    icon: Zap,
    title: "Get Faster Answers",
    description:
      "Ask your Android app question in natural language and get a concise answer.",
  },
  {
    icon: CheckCircle2,
    title: "Choose With Confidence",
    description:
      "Use app, version and compatibility information together before making a decision.",
  },
];

const faqs = [
  {
    question: "What is DroidZyra AI?",
    answer:
      "DroidZyra AI is an Android app assistant that uses DroidZyra's app, version and compatibility data to answer user questions.",
  },
  {
    question: "Can DroidZyra AI recommend an app version?",
    answer:
      "Yes, when the DroidZyra database contains sufficient version and compatibility information.",
  },
  {
    question: "Can I ask about Android compatibility?",
    answer:
      "Yes. You can ask questions such as which version supports Android 10 or Android 15.",
  },
  {
    question: "Does the AI invent missing information?",
    answer:
      "No. If DroidZyra does not have enough database information, the AI is instructed to say that sufficient data is unavailable.",
  },
];

export default function AIPage() {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [detected, setDetected] = useState<{
    androidVersion: string | null;
    ramGb: number | null;
  } | null>(null);

  async function askAI(question?: string) {
    const text = (question ?? message).trim();

    if (!text || loading) return;

    setMessage(text);
    setAnswer("");
    setError("");
    setDetected(null);
    setLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      const data = (await response.json()) as AIResponse;

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to contact DroidZyra AI."
        );
      }

      setAnswer(data.answer || "No answer was returned.");
      setDetected(data.detected || null);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    askAI();
  }

  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.14),transparent_35%)]" />

        <Container className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-lg shadow-primary/10">
              <Sparkles className="h-8 w-8" />
            </div>

            <div className="mt-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              DroidZyra AI
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Ask about Android apps
              <span className="block bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                and get a smarter answer.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Ask DroidZyra about app versions, Android compatibility and
              available app information.
            </p>

            {/* AI CHAT */}
            <Card className="mx-auto mt-10 max-w-3xl border-border/60 bg-card/90 text-left shadow-2xl shadow-primary/5">
              <CardContent className="p-5 sm:p-7">
                <form onSubmit={handleSubmit}>
                  <label
                    htmlFor="ai-question"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Ask DroidZyra AI
                  </label>

                  <textarea
                    id="ai-question"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Example: My phone has Android 10 and 3GB RAM. Which version should I use?"
                    rows={4}
                    maxLength={1000}
                    disabled={loading}
                    className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                  />

                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs text-muted-foreground">
                      {message.length}/1000 characters
                    </span>

                    <Button
                      type="submit"
                      disabled={!message.trim() || loading}
                      className="rounded-xl"
                    >
                      {loading ? (
                        <>
                          <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                          Thinking...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Ask DroidZyra AI
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                {/* EXAMPLES */}
                <div className="mt-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Try an example
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {examples.map((example) => (
                      <button
                        key={example}
                        type="button"
                        onClick={() => {
                          setMessage(example);
                          setAnswer("");
                          setError("");
                        }}
                        disabled={loading}
                        className="rounded-full border border-border bg-background px-3 py-2 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground disabled:opacity-50"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ERROR */}
                {error && (
                  <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                    {error}
                  </div>
                )}

                {/* ANSWER */}
                {answer && (
                  <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Sparkles className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-sm font-bold">
                          DroidZyra AI
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Based on available DroidZyra data
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-foreground">
                      {answer}
                    </div>

                    {detected &&
                      (detected.androidVersion || detected.ramGb) && (
                        <div className="mt-5 flex flex-wrap gap-2 border-t border-border/50 pt-4">
                          {detected.androidVersion && (
                            <span className="rounded-full bg-background px-3 py-1.5 text-xs text-muted-foreground">
                              Android {detected.androidVersion}
                            </span>
                          )}

                          {detected.ramGb && (
                            <span className="rounded-full bg-background px-3 py-1.5 text-xs text-muted-foreground">
                              {detected.ramGb} GB RAM
                            </span>
                          )}
                        </div>
                      )}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Database grounded
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Compatibility data
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Version information
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
              DroidZyra combines app information, versions and compatibility
              data to help you make better Android app decisions.
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
              Ask, analyze and answer
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Ask",
                text: "Tell DroidZyra what Android app or compatibility information you need.",
              },
              {
                number: "02",
                title: "Analyze",
                text: "DroidZyra retrieves relevant app, version and compatibility information from its database.",
              },
              {
                number: "03",
                title: "Answer",
                text: "The AI generates a concise answer based on the available database information.",
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
                <Card key={faq.question} className="border-border/60">
                  <CardContent className="p-6">
                    <h3 className="font-bold">{faq.question}</h3>

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
                Need more Android app information?
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                Explore the DroidZyra app directory and compatibility tools.
              </p>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Button asChild className="rounded-xl">
                  <Link href="/apps">
                    Browse App Directory
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button asChild variant="outline" className="rounded-xl">
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
