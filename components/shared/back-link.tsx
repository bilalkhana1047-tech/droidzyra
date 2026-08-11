import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BackLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Button asChild variant="ghost" size="sm" className="gap-1 -ml-2 mb-2">
      <Link href={href}>
        <ArrowLeft className="h-4 w-4" />
        {label}
      </Link>
    </Button>
  );
}
