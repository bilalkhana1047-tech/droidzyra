'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, Sparkles } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/layout/logo';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/apps?q=${encodeURIComponent(searchValue.trim())}`);
    } else {
      router.push('/apps');
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-colors',
        scrolled
          ? 'bg-background/90 backdrop-blur-md border-border shadow-sm'
          : 'bg-background border-transparent'
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo />

          <nav className="hidden md:flex items-center gap-1" aria-label="Main">
            {siteConfig.nav.map((item) => {
              const active =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    active
                      ? 'text-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <form
            onSubmit={handleSearch}
            className="hidden lg:flex items-center relative"
            role="search"
          >
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={siteConfig.searchPlaceholder}
              className="h-9 w-64 rounded-full border border-input bg-muted/50 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:bg-background transition-colors"
              aria-label="Search apps"
            />
          </form>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </Container>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <Container className="py-4 space-y-3">
            <form onSubmit={handleSearch} role="search">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={siteConfig.searchPlaceholder}
                  className="h-10 w-full rounded-lg border border-input bg-muted/50 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Search apps"
                />
              </div>
            </form>
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {siteConfig.nav.map((item) => {
                const active =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'px-3 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2',
                      active
                        ? 'text-primary bg-primary/5'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    {item.label === 'DroidZyra AI' && (
                      <Sparkles className="h-4 w-4" />
                    )}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
