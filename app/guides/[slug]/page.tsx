import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

import { guides, getGuideBySlug } from '@/lib/guides';
import { Container } from '@/components/layout/container';

interface GuidePageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return guides.map((guide) => ({
    slug: guide.slug,
  }));
}

export function generateMetadata({
  params,
}: GuidePageProps): Metadata {
  const guide = getGuideBySlug(params.slug);

  if (!guide) {
    return {
      title: 'Guide Not Found',
    };
  }

  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: `/guides/${guide.slug}`,
    },
    openGraph: {
      type: 'article',
      title: guide.title,
      description: guide.description,
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
      section: guide.category,
    },
  };
}

export default function GuidePage({ params }: GuidePageProps) {
  const guide = getGuideBySlug(params.slug);

  if (!guide) {
    notFound();
  }

  const relatedGuides = guides
    .filter(
      (item) =>
        item.slug !== guide.slug &&
        item.category === guide.category
    )
    .slice(0, 3);

  return (
    <article>
      <section className="border-b border-border bg-muted/20">
        <Container className="py-12 sm:py-16">
          <div className="max-w-3xl">
            <Link
              href="/guides"
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              All guides
            </Link>

            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>{guide.category}</span>
              <span>•</span>
              <span>{guide.readTime}</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {guide.title}
            </h1>

            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              {guide.description}
            </p>

            <div className="mt-6 text-sm text-muted-foreground">
              Published {guide.publishedAt} · Updated {guide.updatedAt}
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="max-w-3xl">
            <div className="space-y-10">
              {guide.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {section.heading}
                  </h2>

                  <div className="mt-4 space-y-4">
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-base leading-8 text-muted-foreground"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-12 rounded-xl border border-border bg-muted/20 p-6">
              <h2 className="text-lg font-semibold">
                Explore DroidZyra
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Browse Android apps, compare versions and check
                compatibility with your Android device.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/apps"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Browse Apps
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/compatibility"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  Check Compatibility
                </Link>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-xl border border-border bg-muted/20 p-5">
            <h2 className="text-sm font-semibold">
              Related Guides
            </h2>

            <div className="mt-4 space-y-4">
              {relatedGuides.length > 0 ? (
                relatedGuides.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/guides/${related.slug}`}
                    className="group block"
                  >
                    <p className="text-sm font-medium group-hover:underline">
                      {related.title}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {related.readTime}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  More guides coming soon.
                </p>
              )}
            </div>

            <Link
              href="/guides"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium hover:underline"
            >
              View all guides
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </Container>
    </article>
  );
}