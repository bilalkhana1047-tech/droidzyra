import Link from 'next/link';
import { Calendar, ArrowRight, Smartphone, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { App } from '@/lib/types';
import { AppIcon, StatusBadge } from '@/components/shared/badges';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, androidVersionName } from '@/lib/format';

export function AppCard({ app, className }: { app: App; className?: string }) {
  const latest = app.latest_version;
  const recent = false;

  return (
    <Link href={`/apps/${app.slug}`} className="block group h-full">
      <Card
        className={cn(
          'h-full p-5 transition-all hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5',
          className
        )}
      >
        <div className="flex items-start gap-3">
          <AppIcon src={app.icon_url} alt={app.name} name={app.name} size={52} />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base leading-tight truncate group-hover:text-primary transition-colors">
              {app.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {app.developer}
            </p>
          </div>
          <StatusBadge status={app.status} />
        </div>

        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
          {app.description ?? 'No description available.'}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2.5 flex-wrap">
            {app.category && (
              <span className="font-medium">{app.category.name}</span>
            )}
            {latest && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(latest.release_date)}
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            View
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>

        {(latest || recent) && (
          <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 flex-wrap">
            {latest && (
              <Badge variant="secondary" className="text-[11px] font-mono">
                v{latest.version_name}
              </Badge>
            )}
            {latest && (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Smartphone className="h-3 w-3" />
                Android {latest.min_android}+
              </span>
            )}
            {recent && (
              <Badge
                variant="outline"
                className="text-[11px] gap-1 border-emerald-300 bg-emerald-50 text-emerald-800"
              >
                <Sparkles className="h-3 w-3" />
                Recently updated
              </Badge>
            )}
          </div>
        )}
      </Card>
    </Link>
  );
}

export { androidVersionName };


