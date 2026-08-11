import { Container } from '@/components/layout/container';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <Container className="py-8 lg:py-12">
      <Skeleton className="h-10 w-64 mb-4" />
      <Skeleton className="h-8 w-full max-w-2xl mb-8" />
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </Container>
  );
}
