import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, AlertCircle, Clock, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { AppStatus, CompatibilityStatus, SourceType } from '@/lib/types';

export function StatusBadge({ status }: { status: AppStatus }) {
  const map: Record<AppStatus, { label: string; className: string }> = {
    active: {
      label: 'Active',
      className: 'border-emerald-300 bg-emerald-50 text-emerald-800',
    },
    beta: {
      label: 'Beta',
      className: 'border-warning/30 bg-warning/10 text-warning',
    },
    deprecated: {
      label: 'Deprecated',
      className: 'border-muted bg-muted text-muted-foreground',
    },
  };
  const cfg = map[status] ?? map.active;
  return (
    <Badge variant="outline" className={cn('gap-1', cfg.className)}>
      {cfg.label}
    </Badge>
  );
}

export function VerificationBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <Badge
      variant="outline"
      className="gap-1 border-emerald-300 bg-emerald-50 text-emerald-800"
    >
      <CheckCircle2 className="h-3 w-3" />
      Verified
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="gap-1 border-warning/30 bg-warning/10 text-warning"
    >
      <AlertCircle className="h-3 w-3" />
      Unverified
    </Badge>
  );
}

export function SourceBadge({ sourceType }: { sourceType: SourceType }) {
  const map: Record<SourceType, { label: string; className: string }> = {
    official: {
      label: 'Official Source',
      className: 'border-primary/30 bg-primary/10 text-primary',
    },
    'third-party-authorized': {
      label: 'Authorized Mirror',
      className: 'border-accent/30 bg-accent/10 text-accent',
    },
    unofficial: {
      label: 'Unofficial',
      className: 'border-warning/30 bg-warning/10 text-warning',
    },
  };
  const cfg = map[sourceType] ?? map.official;
  return (
    <Badge variant="outline" className={cn('gap-1', cfg.className)}>
      <Package className="h-3 w-3" />
      {cfg.label}
    </Badge>
  );
}

export function CompatibilityBadge({ status }: { status: CompatibilityStatus }) {
  const map: Record<
    CompatibilityStatus,
    { label: string; icon: React.ReactNode; className: string }
  > = {
    compatible: {
      label: 'Compatible',
      icon: <CheckCircle2 className="h-3 w-3" />,
      className: 'border-emerald-300 bg-emerald-50 text-emerald-800',
    },
    limited: {
      label: 'Limited',
      icon: <Clock className="h-3 w-3" />,
      className: 'border-warning/30 bg-warning/10 text-warning',
    },
    incompatible: {
      label: 'Incompatible',
      icon: <AlertCircle className="h-3 w-3" />,
      className: 'border-destructive/30 bg-destructive/10 text-destructive',
    },
  };
  const cfg = map[status] ?? map.compatible;
  return (
    <Badge variant="outline" className={cn('gap-1', cfg.className)}>
      {cfg.icon}
      {cfg.label}
    </Badge>
  );
}

export function AppIcon({
  src,
  alt,
  name,
  size = 48,
  className,
}: {
  src?: string | null;
  alt: string;
  name: string;
  size?: number;
  className?: string;
}) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={cn('rounded-xl object-cover', className)}
      />
    );
  }
  return (
    <div
      className={cn(
        'rounded-xl bg-brand-gradient text-white flex items-center justify-center font-semibold',
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}


