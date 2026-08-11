import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { Logo } from '@/components/layout/logo';
import { Container } from '@/components/layout/container';

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-auto">
      <Container className="py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-xs">
              {siteConfig.tagline} A trusted platform for Android app discovery,
              version history and compatibility.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-success" />
              <span>No piracy. No modded APKs. Official sources only.</span>
            </div>
          </div>

          {siteConfig.footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold mb-3">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} DroidZyra. Demo data is clearly
            labeled and for development purposes only.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for Android users worldwide.
          </p>
        </div>
      </Container>
    </footer>
  );
}
