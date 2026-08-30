import './globals.css';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { siteConfig } from '@/lib/site';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import { LanguageProvider } from '@/components/i18n/language-provider';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'Android apps',
    'app versions',
    'APK',
    'compatibility',
    'app discovery',
    'version history',
    'DroidZyra',
  ],
  authors: [{ name: 'DroidZyra' }],
  creator: 'DroidZyra',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3684215793807746"
          crossOrigin="anonymous"
        />
      </head>

      <body className="min-h-screen flex flex-col font-sans">
        <ThemeProvider>
          <LanguageProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <GoogleAnalytics />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
