import { Container } from '@/components/layout/container';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <Container className="py-6 lg:py-10">
      <div className="space-y-6">
        <Skeleton className="h-5 w-32" />
        <div className="flex items-start gap-4">
          <Skeleton className="h-20 w-20 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </Container>
  );
}
