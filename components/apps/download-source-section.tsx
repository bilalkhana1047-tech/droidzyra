import { ExternalLink, ShieldCheck, AlertCircle, Info, FlaskConical } from 'lucide-react';
import type { Version } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { VerificationBadge, SourceBadge } from '@/components/shared/badges';

export function DownloadSourceSection({
  version,
  appName,
  officialUrl,
}: {
  version: Version | null;
  appName: string;
  officialUrl: string | null;
}) {
  if (!version) {
    return (
      <Card className="p-5">
        <p className="text-sm text-muted-foreground">
          No version information available for this app yet.
        </p>
      </Card>
    );
  }

  const sourceUrl = version.source_url || officialUrl;

  return (
    <Card className="p-5 space-y-4">
      <div>
        <h3 className="font-semibold">Download & Source</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Latest version: <span className="font-medium">v{version.version_name}</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <VerificationBadge verified={version.verified} />
        <SourceBadge sourceType={version.source_type} />
      </div>

      {version.verified ? (
        <div className="flex items-start gap-2.5 rounded-lg border border-success/30 bg-success/5 p-3 text-sm">
          <ShieldCheck className="h-5 w-5 text-success shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-success">Verified source</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              This version&apos;s source has been verified. Always download from
              official channels.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2.5 rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm">
          <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-warning">Unverified source</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verification is not available for this version. Proceed with caution
              and prefer official channels.
            </p>
          </div>
        </div>
      )}

      {sourceUrl ? (
        <Button asChild className="w-full gap-2">
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            aria-label={`Visit the official source for ${appName}`}
          >
            <ExternalLink className="h-4 w-4" />
            Visit Official Source
          </a>
        </Button>
      ) : (
        <p className="text-sm text-muted-foreground">
          No source link available.
        </p>
      )}

      <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <p>
          DroidZyra does not host or redistribute APK files. You will be directed
          to the official source. We do not provide pirated, cracked or modded
          files.
        </p>
      </div>

      {version.sha256 && (
        <div className="text-xs">
          <p className="font-medium text-muted-foreground mb-1">SHA-256</p>
          <code className="block break-all rounded bg-muted p-2 font-mono text-[11px]">
            {version.sha256}
          </code>
        </div>
      )}
    </Card>
  );
}


