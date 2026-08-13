import type { Metadata } from 'next';
import {
  Mail,
  MessageSquare,
  ShieldAlert,
  Send,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

import { Container } from '@/components/layout/container';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Contact DroidZyra for questions, feedback, corrections, copyright concerns and other website-related inquiries.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-primary/[0.08] via-background to-background" />

        <div className="absolute left-1/2 top-[-240px] -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-primary/[0.12] blur-3xl" />

        <Container className="py-16 sm:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/75 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-primary shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Get in touch
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-[-0.045em] sm:text-5xl">
              Contact
              <span className="ml-2 bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                DroidZyra
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Have a question, suggestion, correction or concern?
              Send us a message and we&apos;ll review it.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                General questions
              </span>

              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Corrections & feedback
              </span>

              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Copyright concerns
              </span>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/20 to-background" />

        <Container>
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_330px]">
            <Card className="overflow-hidden rounded-[26px] border-border/60 bg-background shadow-[0_20px_65px_-38px_rgba(15,23,42,0.3)]">
              <CardHeader className="border-b border-border/60 bg-muted/20 px-6 py-5 sm:px-7">
                <CardTitle className="flex items-center gap-3 text-lg font-bold">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MessageSquare className="h-5 w-5" />
                  </span>

                  Send us a message
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 sm:p-7">
                <form
                  action="mailto:contact@droidzyra.app"
                  method="post"
                  encType="text/plain"
                  className="space-y-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground"
                      >
                        Name
                      </label>

                      <input
                        id="name"
                        name="Name"
                        type="text"
                        placeholder="Your name"
                        required
                        className="h-11 w-full rounded-xl border border-border/70 bg-muted/20 px-3.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary/35 focus:bg-background focus:ring-4 focus:ring-primary/[0.07]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground"
                      >
                        Email
                      </label>

                      <input
                        id="email"
                        name="Email"
                        type="email"
                        placeholder="Enter your email address"
                        required
                        className="h-11 w-full rounded-xl border border-border/70 bg-muted/20 px-3.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary/35 focus:bg-background focus:ring-4 focus:ring-primary/[0.07]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground"
                    >
                      Subject
                    </label>

                    <select
                      id="subject"
                      name="Subject"
                      defaultValue=""
                      required
                      className="h-11 w-full rounded-xl border border-border/70 bg-muted/20 px-3.5 text-sm outline-none transition-all focus:border-primary/35 focus:bg-background focus:ring-4 focus:ring-primary/[0.07]"
                    >
                      <option value="" disabled>
                        Select a subject
                      </option>

                      <option value="General question">
                        General question
                      </option>

                      <option value="Website feedback">
                        Website feedback
                      </option>

                      <option value="Information correction">
                        Information correction
                      </option>

                      <option value="Copyright concern">
                        Copyright concern
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground"
                    >
                      Message
                    </label>

                    <textarea
                      id="message"
                      name="Message"
                      placeholder="Tell us how we can help..."
                      required
                      rows={7}
                      className="min-h-[170px] w-full resize-y rounded-xl border border-border/70 bg-muted/20 px-3.5 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary/35 focus:bg-background focus:ring-4 focus:ring-primary/[0.07]"
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      type="submit"
                      className="h-11 gap-2 rounded-xl px-5 shadow-md shadow-primary/15"
                    >
                      <Send className="h-4 w-4" />
                      Send Message
                    </Button>

                    <p className="text-xs leading-5 text-muted-foreground">
                      Opens your default email app.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-5">
              <Card className="overflow-hidden rounded-[22px] border-border/60 bg-background shadow-sm">
                <CardContent className="p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>

                  <h2 className="mt-5 font-bold">
                    Email
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    For general questions and website-related inquiries.
                  </p>

                  <a
                    href="mailto:contact@droidzyra.app"
                    className="mt-4 inline-flex rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
                  >
                    contact@droidzyra.app
                  </a>
                </CardContent>
              </Card>

              <Card className="overflow-hidden rounded-[22px] border-primary/20 bg-gradient-to-br from-primary/[0.06] via-background to-violet-500/[0.04]">
                <CardContent className="p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ShieldAlert className="h-5 w-5" />
                  </div>

                  <h2 className="mt-5 font-bold">
                    Copyright concerns
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    If you believe content on DroidZyra infringes your rights,
                    contact us with enough information for us to review the concern.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
