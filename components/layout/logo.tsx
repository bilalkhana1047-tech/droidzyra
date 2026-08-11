import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({
  className,
  href = '/',
  size = 'md',
}: {
  className?: string;
  href?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizes = {
    sm: { mark: 'h-7 w-7', text: 'text-lg' },
    md: { mark: 'h-8 w-8', text: 'text-xl' },
    lg: { mark: 'h-10 w-10', text: 'text-2xl' },
  };
  const s = sizes[size];
  return (
    <Link
      href={href}
      className={cn('flex items-center gap-2 font-bold', className)}
      aria-label="DroidZyra home"
    >
      <span
        className={cn(
          'relative flex items-center justify-center rounded-xl bg-brand-gradient text-white shadow-sm',
          s.mark
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-1/2 w-1/2"
          aria-hidden="true"
        >
          <path
            d="M12 2L2 7v10l10 5 10-5V7L12 2z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M12 7v10M7 9.5v5M17 9.5v5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className={cn(s.text, 'tracking-tight')}>
        Droid<span className="text-primary">Zyra</span>
      </span>
    </Link>
  );
}
