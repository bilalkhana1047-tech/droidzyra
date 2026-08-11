'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import type { App } from '@/lib/types';
import { searchApps } from '@/lib/data';
import { AppIcon } from '@/components/shared/badges';
import { cn } from '@/lib/utils';

export function HeroSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [results, setResults] = useState<App[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(async () => {
      const q = value.trim();
      if (q.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      const r = await searchApps(q, 6);
      setResults(r);
      setLoading(false);
    }, 250);
    return () => clearTimeout(handler);
  }, [value]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      router.push(`/apps?q=${encodeURIComponent(value.trim())}`);
      setOpen(false);
    }
  };

  return (
    <div ref={wrapRef} className={cn('relative w-full', className)}>
      <form onSubmit={submit} role="search">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={siteConfig.searchPlaceholder}
            className="h-14 w-full rounded-full border border-border bg-card pl-12 pr-12 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary transition-all"
            aria-label="Search apps, versions or Android compatibility"
          />
          {value && (
            <button
              type="button"
              onClick={() => {
                setValue('');
                setResults([]);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>

      {open && (value.trim().length >= 2) && (
        <div className="absolute top-full mt-2 w-full rounded-xl border border-border bg-card shadow-lg overflow-hidden z-50 animate-fade-in">
          {loading && (
            <div className="px-4 py-6 text-sm text-muted-foreground text-center">
              Searching…
            </div>
          )}
          {!loading && results.length === 0 && (
            <div className="px-4 py-6 text-sm text-muted-foreground text-center">
              No apps found for &ldquo;{value}&rdquo;. Try another term.
            </div>
          )}
          {!loading && results.length > 0 && (
            <ul className="divide-y divide-border max-h-80 overflow-y-auto">
              {results.map((app) => (
                <li key={app.id}>
                  <button
                    type="button"
                    onClick={() => {
                      router.push(`/apps/${app.slug}`);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors"
                  >
                    <AppIcon src={app.icon_url} alt={app.name} name={app.name} size={36} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{app.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {app.developer}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    submit(new Event('submit') as unknown as React.FormEvent);
                  }}
                  className="w-full px-4 py-3 text-sm font-medium text-primary text-left hover:bg-primary/5 transition-colors"
                >
                  See all results for &ldquo;{value}&rdquo;
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
