import Link from 'next/link';
import { Calendar, HardDrive, Cpu, ArrowRight } from 'lucide-react';
import type { Version } from '@/lib/types';
import { formatDate, formatFileSize } from '@/lib/format';
import { VerificationBadge, SourceBadge } from '@/components/shared/badges';
import { Card } from '@/components/ui/card';

export function VersionHistoryList({
  slug,
  versions,
  limit,
}: {
  slug: string;
  versions: Version[];
  limit?: number;
}) {
  const list = limit ? versions.slice(0, limit) : versions;
  return (
    <div className="space-y-3">
      {list.map((v) => (
        <Link key={v.id} href={`/apps/${slug}/versions/${v.version_name}`}>
          <Card className="p-4 transition-all hover:shadow-sm hover:border-primary/30 hover:-translate-y-0.5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold">v{v.version_name}</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    #{v.version_code}
                  </span>
                  <VerificationBadge verified={v.verified} />
                  <SourceBadge sourceType={v.source_type} />
                </div>
                {v.changelog && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2 whitespace-pre-line">
                    {v.changelog.content}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(v.release_date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <HardDrive className="h-3 w-3" />
                    {formatFileSize(v.file_size)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Cpu className="h-3 w-3" />
                    {v.architecture}
                  </span>
                  <span>Min: Android {v.min_android}</span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
