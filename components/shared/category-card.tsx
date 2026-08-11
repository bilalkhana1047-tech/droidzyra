import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Category } from '@/lib/types';

const categoryIcons: Record<string, string> = {
  social: '#',
  communication: '✉',
  music: '♪',
  video: '▶',
  productivity: '✓',
  photography: '○',
  education: '✎',
  tools: '⚙',
  games: '◆',
};

export function CategoryCard({
  category,
  appCount,
}: {
  category: Category;
  appCount?: number;
}) {
  const icon = categoryIcons[category.slug] ?? '◆';
  return (
    <Link
      href={`/apps?category=${category.slug}`}
      className={cn(
        'group flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-5 text-center transition-all hover:border-primary/40 hover:shadow-sm hover:-translate-y-0.5'
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary text-xl font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        {icon}
      </span>
      <span className="text-sm font-medium">{category.name}</span>
      {typeof appCount === 'number' && (
        <span className="text-xs text-muted-foreground">
          {appCount} app{appCount !== 1 ? 's' : ''}
        </span>
      )}
    </Link>
  );
}
