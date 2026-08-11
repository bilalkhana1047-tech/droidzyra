import type { Metadata } from 'next';
import {
  Mail,
  MessageSquare,
  ShieldAlert,
  Send,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Contact DroidZyra for questions, feedback, corrections, copyright concerns and other website-related inquiries.',
};

export default function ContactPage() {
  return (
    <Container className="py-10 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Mail className="h-7 w-7" />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
            Get in touch
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Contact DroidZyra
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Have a question, suggestion, correction or concern? Send us a
            message and we&apos;ll review it.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Send us a message
              </CardTitle>
            </CardHeader>

            <CardContent>
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
                      className="text-sm font-medium"
                    >
                      Name
                    </label>

                    <input
                      id="name"
                      name="Name"
                      type="text"
                      placeholder="Your name"
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      name="Email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium"
                  >
                    Subject
                  </label>

                  <select
                    id="subject"
                    name="Subject"
                    defaultValue=""
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="Message"
                    placeholder="Tell us how we can help..."
                    required
                    rows={7}
                    className="flex min-h-[160px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <Button type="submit" className="gap-2">
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>

                <p className="text-xs leading-5 text-muted-foreground">
                  Submitting this form will open your device&apos;s default
                  email application.
                </p>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>

                <h2 className="mt-4 font-semibold">
                  Email
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  For general questions and website-related inquiries.
                </p>

                <a
                  href="mailto:contact@droidzyra.app"
                  className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                >
                  contact@droidzyra.app
                </a>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/[0.03]">
              <CardContent className="p-6">
                <ShieldAlert className="h-6 w-6 text-primary" />

                <h2 className="mt-4 font-semibold">
                  Copyright concerns
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  If you believe content on DroidZyra infringes your rights,
                  please contact us with enough information for us to review
                  the concern.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
}

