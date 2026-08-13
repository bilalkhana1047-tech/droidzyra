import type { Metadata } from 'next';
import { Copyright, Mail, ShieldCheck, FileWarning } from 'lucide-react';

import { Container } from '@/components/layout/container';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'DMCA & Copyright',
  description:
    'DMCA and Copyright information for DroidZyra, including notices regarding third-party content, trademarks and removal requests.',
  alternates: {
    canonical: '/dmca',
  },
};

export default function DmcaPage() {
  return (
    <Container className="relative py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-[28px] border border-border/60 bg-gradient-to-br from-primary/[0.08] via-background to-violet-500/[0.05] px-6 py-10 text-center shadow-[0_20px_60px_-38px_hsl(var(--primary)/0.30)] sm:px-10 sm:py-12">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm">
            <Copyright className="h-7 w-7" />
          </div>

          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
            Legal
          </p>

          <h1 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">
            DMCA & Copyright
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Information for copyright owners and rights holders regarding
            content displayed or referenced on DroidZyra.
          </p>
        </div>

        <div className="mt-8 space-y-5">
          <Card className="overflow-hidden rounded-[22px] border-border/60 bg-background/90 shadow-sm transition-all hover:border-primary/15 hover:shadow-md">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  1. Respect for Copyright
                </h2>
              </div>

              <p className="mt-3 leading-7 text-muted-foreground">
                DroidZyra respects the intellectual property rights of
                developers, publishers, copyright owners and other rights
                holders.
              </p>

              <p className="mt-3 leading-7 text-muted-foreground">
                Application names, logos, icons, screenshots, trademarks and
                other third-party materials remain the property of their
                respective owners.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[22px] border-border/60 bg-background/90 shadow-sm transition-all hover:border-primary/15 hover:shadow-md">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                2. Third-Party Application Information
              </h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                DroidZyra is an informational application directory. We do not
                claim ownership of third-party applications or their
                associated intellectual property.
              </p>

              <p className="mt-3 leading-7 text-muted-foreground">
                DroidZyra does not intentionally host or distribute pirated,
                cracked or modified application files.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[22px] border-border/60 bg-background/90 shadow-sm transition-all hover:border-primary/15 hover:shadow-md">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                3. Copyright Removal Requests
              </h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                If you are a copyright owner or authorized representative and
                believe that material referenced or displayed on DroidZyra
                infringes your rights, you may contact us with the relevant
                details.
              </p>

              <p className="mt-3 leading-7 text-muted-foreground">
                We will review legitimate copyright concerns and, where
                appropriate, take reasonable action regarding the identified
                material or link.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[22px] border-border/60 bg-background/90 shadow-sm transition-all hover:border-primary/15 hover:shadow-md">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <FileWarning className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  4. Information to Include in a Notice
                </h2>
              </div>

              <p className="mt-3 leading-7 text-muted-foreground">
                To help us review a copyright concern, please provide enough
                information to identify the material in question.
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
                <li>Your name and contact information.</li>
                <li>
                  Identification of the copyrighted work or material you
                  believe has been infringed.
                </li>
                <li>
                  The URL or specific location of the material on DroidZyra.
                </li>
                <li>
                  A description explaining why you believe the material
                  infringes your rights.
                </li>
                <li>
                  Any additional information that may help us review the
                  request.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[22px] border-border/60 bg-background/90 shadow-sm transition-all hover:border-primary/15 hover:shadow-md">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                5. Good-Faith Review
              </h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                Copyright concerns are reviewed in good faith. Providing
                accurate and complete information helps us investigate the
                reported material more efficiently.
              </p>

              <p className="mt-3 leading-7 text-muted-foreground">
                We may request additional information when necessary to
                understand and verify a copyright complaint.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/[0.03]">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  6. Copyright Contact
                </h2>
              </div>

              <p className="mt-3 leading-7 text-muted-foreground">
                For copyright, DMCA or content removal concerns, contact us
                using the following email address:
              </p>

              <a
                href="mailto:contact@droidzyra.app"
                className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
              >
                contact@droidzyra.app
              </a>
            </CardContent>
          </Card>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Last updated: August 12, 2026
        </p>
      </div>
    </Container>
  );
}
