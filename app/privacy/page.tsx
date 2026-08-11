import type { Metadata } from 'next';
import { ShieldCheck, Database, Cookie, Mail } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy for DroidZyra explaining how information is handled when you use our website.',
};

export default function PrivacyPage() {
  return (
    <Container className="py-10 lg:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="h-7 w-7" />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
            Legal
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Your privacy matters to us. This page explains how DroidZyra
            handles information when you use our website.
          </p>
        </div>

        <div className="mt-10 space-y-6">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold">1. Information We Collect</h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                DroidZyra is designed primarily as an informational Android
                app discovery platform. We may collect information that you
                voluntarily provide, such as information submitted through a
                contact form.
              </p>
              <p className="mt-3 leading-7 text-muted-foreground">
                We may also receive standard technical information such as
                browser type, device information, approximate location,
                referring pages and general usage information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">
                  2. How We Use Information
                </h2>
              </div>

              <ul className="mt-4 space-y-2 pl-5 text-muted-foreground list-disc">
                <li>To operate and maintain DroidZyra.</li>
                <li>To improve website performance and user experience.</li>
                <li>To understand how visitors use our website.</li>
                <li>To respond to user questions and requests.</li>
                <li>To detect and prevent abuse or security issues.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <Cookie className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">
                  3. Cookies and Advertising
                </h2>
              </div>

              <p className="mt-3 leading-7 text-muted-foreground">
                DroidZyra may use cookies and similar technologies to improve
                website functionality, understand traffic and support
                advertising services.
              </p>

              <p className="mt-3 leading-7 text-muted-foreground">
                If advertising services such as Google AdSense are enabled,
                third-party vendors may use cookies to serve advertisements
                based on a user's previous visits to this or other websites.
              </p>

              <p className="mt-3 leading-7 text-muted-foreground">
                Users may manage cookie preferences through their browser
                settings and, where applicable, available advertising
                privacy controls.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold">
                4. Third-Party Services
              </h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                DroidZyra may use third-party services for hosting, analytics,
                database functionality, security and advertising. These
                services may process information according to their own
                privacy policies and terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold">
                5. External Links
              </h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                DroidZyra may contain links to external websites, including
                official application websites and third-party resources.
                We are not responsible for the privacy practices or content
                of external websites. We recommend reviewing their privacy
                policies before providing personal information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold">6. Data Security</h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                We take reasonable measures to protect information handled
                through DroidZyra. However, no internet transmission or
                electronic storage system can be guaranteed to be completely
                secure.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold">7. Children's Privacy</h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                DroidZyra does not knowingly request or collect personal
                information from children. If you believe that a child has
                provided personal information through our website, please
                contact us so that appropriate action can be taken.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold">
                8. Changes to This Policy
              </h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                We may update this Privacy Policy from time to time to
                reflect changes to our website, services or legal
                requirements. Updated versions will be published on this
                page.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/[0.03]">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">9. Contact Us</h2>
              </div>

              <p className="mt-3 leading-7 text-muted-foreground">
                If you have questions about this Privacy Policy or how
                information is handled on DroidZyra, please contact us
                through the contact options provided on the website.
              </p>
            </CardContent>
          </Card>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Last updated: August 11, 2026
        </p>
      </div>
    </Container>
  );
}

