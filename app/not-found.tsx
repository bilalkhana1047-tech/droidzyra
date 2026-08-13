import Link from 'next/link';
import {
  Search,
  Home,
  Package,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="relative flex min-h-[70vh] items-center overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-primary/[0.08] via-background to-background" />

      <div className="absolute left-1/2 top-[-180px] -z-10 h-[500px] w-[850px] -translate-x-1/2 rounded-full bg-primary/[0.12] blur-3xl" />

      <Container className="py-20 text-center lg:py-28">
        <div className="mx-auto max-w-xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] border border-primary/15 bg-background/80 text-primary shadow-xl backdrop-blur">
            <Package className="h-9 w-9" />
          </div>

          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/70 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Page not found
          </div>

          <h1 className="mt-5 text-6xl font-black tracking-[-0.06em] sm:text-7xl">
            404
          </h1>

          <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
            This page seems to be missing.
          </h2>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">
            We couldn&apos;t find the page or app you were looking for.
            It may have moved, changed or no longer exist.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              asChild
              className="h-11 rounded-xl px-5 shadow-md shadow-primary/15"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-11 rounded-xl bg-background/70 px-5"
            >
              <Link href="/apps">
                <Search className="mr-2 h-4 w-4" />
                Browse Apps
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
