import { notFound } from "next/navigation";
import { Download } from "lucide-react";

import { getVersionDetail } from "@/lib/data";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { BackLink } from "@/components/shared/back-link";
import { DownloadCountdown } from "@/components/download/download-countdown";

function isSafeDownloadUrl(value: string | null): boolean {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export const dynamic = 'force-dynamic';
export const metadata = {
  title: "Preparing Download | DroidZyra",
  robots: {
    index: false,
    follow: false,
  },
};
export default async function DownloadPage({
  params,
}: {
  params: {
    slug: string;
    version: string;
  };
}) {
  const { app, version } = await getVersionDetail(
    params.slug,
    params.version
  );

  if (!app || !version || !isSafeDownloadUrl(version.custom_download_url)) {
    notFound();
  }

  const downloadUrl = version.custom_download_url as string;

  return (
    <main className="relative min-h-[75vh] overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-primary/[0.08] via-background to-background" />

      <div className="absolute left-1/2 top-[-220px] -z-10 h-[500px] w-[850px] -translate-x-1/2 rounded-full bg-primary/[0.12] blur-3xl" />

      <Container className="py-8 sm:py-12 lg:py-16">
        <BackLink
          href={`/apps/${app.slug}/versions/${version.version_name}`}
          label={`Back to ${app.name}`}
        />

        <Breadcrumbs
          items={[
            {
              label: "Apps",
              href: "/apps",
            },
            {
              label: app.name,
              href: `/apps/${app.slug}`,
            },
            {
              label: `v${version.version_name}`,
              href: `/apps/${app.slug}/versions/${version.version_name}`,
            },
            {
              label: "Download",
            },
          ]}
          className="mb-8"
        />

        <div className="mx-auto max-w-2xl overflow-hidden rounded-[28px] border border-border/60 bg-background/85 p-7 shadow-[0_25px_80px_-40px_hsl(var(--primary)/0.40)] backdrop-blur sm:p-10">
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.06] px-4 py-2 text-xs font-bold text-primary">
              <Download className="h-3.5 w-3.5" />
              DroidZyra Download
            </div>
          </div>

          <DownloadCountdown
            appName={app.name}
            versionName={version.version_name}
            downloadUrl={downloadUrl}
          />
        </div>
      </Container>
    </main>
  );
}





