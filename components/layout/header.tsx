'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Search,
  Sparkles,
  Home,
  LayoutGrid,
  Smartphone,
} from 'lucide-react';

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

    window.addEventListener('scroll', onScroll, {
      passive: true,
    });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const value = searchValue.trim();

    if (value) {
      router.push(`/apps?q=${encodeURIComponent(value)}`);
    } else {
      router.push('/apps');
    }
  };

  const navIcon = (label: string) => {
    if (label === 'Home') {
      return <Home className="h-3.5 w-3.5" />;
    }

    if (label === 'Apps') {
      return <LayoutGrid className="h-3.5 w-3.5" />;
    }

    if (label.includes('Compatibility')) {
      return <Smartphone className="h-3.5 w-3.5" />;
    }

    if (label === 'DroidZyra AI') {
      return <Sparkles className="h-3.5 w-3.5" />;
    }

    return null;
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-all duration-300',
        scrolled
          ? 'border-border/70 bg-background/90 shadow-[0_8px_30px_-20px_rgba(15,23,42,0.35)] backdrop-blur-xl'
          : 'border-border/40 bg-background/95 backdrop-blur'
      )}
    >
      <Container>
        <div className="flex h-[72px] items-center gap-5">
          {/* Logo */}
          <div className="shrink-0">
            <Logo />
          </div>

          {/* Desktop navigation */}
          <nav
            className="hidden flex-1 items-center justify-center md:flex"
            aria-label="Main"
          >
            <div className="inline-flex items-center gap-1 rounded-2xl border border-border/60 bg-muted/25 p-1.5">
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
                      'relative inline-flex h-9 items-center gap-1.5 rounded-xl px-3.5 text-xs font-semibold transition-all duration-200',
                      active
                        ? 'bg-background text-primary shadow-sm ring-1 ring-border/60'
                        : 'text-muted-foreground hover:bg-background/70 hover:text-foreground'
                    )}
                  >
                    <span
                      className={cn(
                        'transition-colors',
                        active
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      )}
                    >
                      {navIcon(item.label)}
                    </span>

                    {item.label}

                    {active && (
                      <span className="absolute inset-x-3 -bottom-[7px] h-0.5 rounded-full bg-gradient-to-r from-primary to-violet-500" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="relative hidden shrink-0 lg:block"
            role="search"
          >
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="search"
              value={searchValue}
              onChange={(e) =>
                setSearchValue(e.target.value)
              }
              placeholder={siteConfig.searchPlaceholder}
              className="h-10 w-[250px] rounded-xl border border-border/70 bg-muted/25 pl-10 pr-4 text-xs text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary/30 focus:bg-background focus:ring-4 focus:ring-primary/[0.07]"
              aria-label="Search apps"
            />
          </form>

          {/* Mobile button */}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto rounded-xl border border-border/60 bg-background shadow-sm md:hidden"
            onClick={() =>
              setMobileOpen((value) => !value)
            }
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </Container>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border/60 bg-background/95 shadow-lg backdrop-blur-xl md:hidden">
          <Container className="space-y-4 py-5">
            <form
              onSubmit={handleSearch}
              role="search"
            >
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="search"
                  value={searchValue}
                  onChange={(e) =>
                    setSearchValue(e.target.value)
                  }
                  placeholder={siteConfig.searchPlaceholder}
                  className="h-11 w-full rounded-xl border border-border/70 bg-muted/30 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary/30 focus:bg-background focus:ring-4 focus:ring-primary/[0.07]"
                  aria-label="Search apps"
                />
              </div>
            </form>

            <nav
              className="grid gap-1"
              aria-label="Mobile"
            >
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
                      'flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-semibold transition-all',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg',
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {navIcon(item.label)}
                    </span>

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
