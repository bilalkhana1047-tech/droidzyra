import type { Metadata } from 'next';
import { FileText, ShieldCheck, ExternalLink, Mail } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    'Terms of Use for DroidZyra. Read the rules and conditions for using our Android app discovery platform.',
};

export default function TermsPage() {
  return (
    <Container className="py-10 lg:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FileText className="h-7 w-7" />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
            Legal
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Terms of Use
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            These terms explain the rules and conditions for using
            DroidZyra.
          </p>
        </div>

        <div className="mt-10 space-y-6">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                By accessing or using DroidZyra, you agree to these Terms of
                Use and our Privacy Policy. If you do not agree with these
                terms, please do not use the website.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold">
                2. About DroidZyra
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                DroidZyra is an informational platform that helps users
                discover Android applications, explore application versions,
                review compatibility information and find information about
                available sources.
              </p>
              <p className="mt-3 leading-7 text-muted-foreground">
                DroidZyra does not claim ownership of third-party
                applications, trademarks, logos or other intellectual
                property displayed on the website.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">
                  3. Accuracy of Information
                </h2>
              </div>

              <p className="mt-3 leading-7 text-muted-foreground">
                We make reasonable efforts to provide accurate and useful
                information. However, application versions, compatibility
                requirements, download sources and other technical details
                can change over time.
              </p>

              <p className="mt-3 leading-7 text-muted-foreground">
                Information on DroidZyra is provided for informational
                purposes and should be independently verified before use.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold">
                4. Third-Party Applications and Links
              </h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                DroidZyra may provide links to official websites and other
                external resources. These websites are operated by third
                parties and are outside our control.
              </p>

              <p className="mt-3 leading-7 text-muted-foreground">
                We are not responsible for the availability, security,
                content, policies or practices of external websites.
              </p>

              <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                <ExternalLink className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Always review the destination website before downloading
                  software or providing personal information.
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold">
                5. No Piracy or Unauthorized Distribution
              </h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                DroidZyra does not encourage software piracy, copyright
                infringement or unauthorized distribution of applications.
              </p>

              <p className="mt-3 leading-7 text-muted-foreground">
                Users should obtain applications through legitimate and
                authorized sources whenever possible and must comply with
                applicable laws and the rights of application developers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold">
                6. Acceptable Use
              </h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                You agree not to misuse DroidZyra or attempt to interfere
                with its operation.
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
                <li>
                  Do not attempt to gain unauthorized access to the website
                  or its systems.
                </li>
                <li>
                  Do not use automated methods to abuse or overload the
                  website.
                </li>
                <li>
                  Do not use DroidZyra for unlawful activities.
                </li>
                <li>
                  Do not intentionally submit malicious or harmful content.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold">
                7. Intellectual Property
              </h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                The DroidZyra website design, original text, branding,
                interface elements and original content are protected by
                applicable intellectual property laws.
              </p>

              <p className="mt-3 leading-7 text-muted-foreground">
                Third-party names, logos, trademarks and application
                materials remain the property of their respective owners.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold">
                8. Disclaimer
              </h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                DroidZyra is provided on an “as available” basis. We do not
                guarantee that the website, its information or external
                resources will always be complete, accurate, available or
                error-free.
              </p>

              <p className="mt-3 leading-7 text-muted-foreground">
                Users are responsible for evaluating applications and
                external resources before installing or using them.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold">
                9. Limitation of Liability
              </h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                To the extent permitted by applicable law, DroidZyra and its
                operators will not be responsible for losses, damages or
                issues resulting from the use of information, applications
                or external websites accessed through the platform.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold">
                10. Changes to These Terms
              </h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                We may update these Terms of Use when necessary. Changes will
                be published on this page, and continued use of DroidZyra
                after changes are published constitutes acceptance of the
                updated terms.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/[0.03]">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">
                  11. Contact
                </h2>
              </div>

              <p className="mt-3 leading-7 text-muted-foreground">
                If you have questions about these Terms of Use or DroidZyra,
                please contact us through the contact options provided on
                the website.
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

