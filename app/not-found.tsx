import Link from 'next/link';
import { Search, Home, Package } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <Container className="py-20 lg:py-32 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Package className="h-10 w-10" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">404</h1>
          <p className="text-lg text-muted-foreground">
            We couldn&apos;t find the page or app you were looking for.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/apps">
              <Search className="h-4 w-4" />
              Browse Apps
            </Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
