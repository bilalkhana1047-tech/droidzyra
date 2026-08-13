import type { Metadata } from 'next';
import { AlertTriangle, ShieldCheck, ExternalLink, Mail } from 'lucide-react';

import { Container } from '@/components/layout/container';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description:
    'Disclaimer for DroidZyra covering app information, compatibility details, external links and third-party content.',
  alternates: {
    canonical: '/disclaimer',
  },
};

export default function DisclaimerPage() {
  return (
    <Container className="relative py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-[28px] border border-border/60 bg-gradient-to-br from-primary/[0.08] via-background to-violet-500/[0.05] px-6 py-10 text-center shadow-[0_20px_60px_-38px_hsl(var(--primary)/0.30)] sm:px-10 sm:py-12">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm">
            <AlertTriangle className="h-7 w-7" />
          </div>

          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
            Legal
          </p>

          <h1 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">
            Disclaimer
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Important information about the content, applications and external
            resources available through DroidZyra.
          </p>
        </div>

        <div className="mt-8 space-y-5">
          <Card className="overflow-hidden rounded-[22px] border-border/60 bg-background/90 shadow-sm transition-all hover:border-primary/15 hover:shadow-md">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  1. Informational Purpose
                </h2>
              </div>

              <p className="mt-3 leading-7 text-muted-foreground">
                DroidZyra is an informational Android app discovery platform.
                The information provided on this website is intended to help
                users discover applications, compare versions, understand
                compatibility requirements and find available sources.
              </p>

              <p className="mt-3 leading-7 text-muted-foreground">
                Information may change over time and should be independently
                verified before installing or using any application.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[22px] border-border/60 bg-background/90 shadow-sm transition-all hover:border-primary/15 hover:shadow-md">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                2. Application Information
              </h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                Application names, package names, logos, icons, screenshots,
                version information and other application-related materials
                may belong to their respective developers or copyright owners.
              </p>

              <p className="mt-3 leading-7 text-muted-foreground">
                DroidZyra does not claim ownership of third-party applications,
                trademarks or intellectual property displayed on the website.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[22px] border-border/60 bg-background/90 shadow-sm transition-all hover:border-primary/15 hover:shadow-md">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                3. Accuracy and Availability
              </h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                We make reasonable efforts to keep information useful and
                accurate. However, application versions, Android requirements,
                compatibility information and external links may change
                without notice.
              </p>

              <p className="mt-3 leading-7 text-muted-foreground">
                DroidZyra does not guarantee that all information will always
                be complete, current, accurate or error-free.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[22px] border-border/60 bg-background/90 shadow-sm transition-all hover:border-primary/15 hover:shadow-md">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <ExternalLink className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  4. External Links and Sources
                </h2>
              </div>

              <p className="mt-3 leading-7 text-muted-foreground">
                DroidZyra may link to official application websites and other
                external resources. These websites are operated independently
                and are outside our control.
              </p>

              <p className="mt-3 leading-7 text-muted-foreground">
                Users should review the destination website, its policies and
                its terms before downloading software or providing personal
                information.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[22px] border-border/60 bg-background/90 shadow-sm transition-all hover:border-primary/15 hover:shadow-md">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                5. No APK Hosting or Piracy
              </h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                DroidZyra does not host or redistribute APK files and does not
                intentionally provide pirated, cracked or modified
                applications.
              </p>

              <p className="mt-3 leading-7 text-muted-foreground">
                Where available, users are directed to official or authorized
                sources. Users are responsible for ensuring that their use of
                any application complies with applicable laws and the
                developer&apos;s terms.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[22px] border-border/60 bg-background/90 shadow-sm transition-all hover:border-primary/15 hover:shadow-md">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                6. Third-Party Services and Advertising
              </h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                DroidZyra may use third-party services such as hosting,
                analytics, security and advertising providers. These services
                may collect or process information according to their own
                policies.
              </p>

              <p className="mt-3 leading-7 text-muted-foreground">
                If advertising services such as Google AdSense are enabled,
                advertisements may be provided by third-party advertising
                networks and may be subject to their own policies and
                technologies.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/[0.03]">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  7. Questions and Copyright Concerns
                </h2>
              </div>

              <p className="mt-3 leading-7 text-muted-foreground">
                If you believe that information or material available on
                DroidZyra should be corrected or removed, please contact us
                with sufficient details so that the matter can be reviewed.
              </p>

              <p className="mt-3 text-sm font-medium text-primary">
                contact@droidzyra.app
              </p>
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
