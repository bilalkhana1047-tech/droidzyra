import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

import { siteConfig } from '@/lib/site';
import { Logo } from '@/components/layout/logo';
import { Container } from '@/components/layout/container';

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border/60 bg-slate-950 text-white">
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="absolute -bottom-48 right-0 h-96 w-96 rounded-full bg-fuchsia-600/[0.07] blur-[130px]" />

      <Container className="relative py-12 sm:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.35fr_repeat(3,1fr)]">
          {/* Brand */}
          <div>
            <div className="inline-flex rounded-xl bg-white p-2">
              <Logo />
            </div>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              {siteConfig.tagline} Discover Android apps,
              compare versions and understand compatibility
              before choosing the right version for your device.
            </p>

            <div className="mt-5 inline-flex items-start gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] px-3.5 py-3 text-xs leading-5 text-slate-300">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

              <span>
                No piracy. No modded APKs. Focused on trusted
                and authorized sources.
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-violet-400" />
                Version history
              </span>

              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-violet-400" />
                Compatibility
              </span>

              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-violet-400" />
                Clear metadata
              </span>
            </div>
          </div>

          {/* Links */}
          {siteConfig.footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-200">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                {group.title}
              </h3>

              <ul className="mt-5 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      <span className="mr-0 w-0 overflow-hidden text-violet-400 opacity-0 transition-all group-hover:mr-2 group-hover:w-3 group-hover:opacity-100">
                        →
                      </span>

                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/[0.08] pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} DroidZyra. All
              rights reserved.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              Built for Android users worldwide.
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
