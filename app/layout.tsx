import './globals.css';
import { Playfair_Display, Source_Serif_4, DM_Sans, JetBrains_Mono } from 'next/font/google';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import NavigationProgressBar from '../src/components/NavigationProgressBar';
import { Suspense } from 'react';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['700', '800', '900'],
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '600', '700'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-ui',
  weight: ['400', '500', '600'],
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
});

export const metadata = {
  title: {
    default: 'Aura Home Office | Home Office Buying Guide',
    template: '%s | Aura Home Office',
  },
  description:
    'Independent home office buying guide. We research standing desks, ergonomic chairs, monitor arms, and workspace gear so you can buy right the first time — without wasting money on the wrong gear.',
  keywords: [
    'home office buying guide',
    'best standing desk',
    'ergonomic chair reviews',
    'home office setup',
    'wfh gear',
    'monitor arm reviews',
    'desk accessories',
    'cable management',
  ],
  authors: [{ name: 'Aura Home Office Editorial Team' }],
  metadataBase: new URL('https://aurahomeoffice.com'),
  alternates: {
    canonical: 'https://aurahomeoffice.com',
  },
  openGraph: {
    title: 'Aura Home Office | Independent Home Office Buying Guide',
    description:
      'Honest research on home office gear. No paid rankings. No fake testing. Just practical advice on what fits your space and budget.',
    url: 'https://aurahomeoffice.com',
    siteName: 'Aura Home Office',
    locale: 'en_US',
    type: 'website',
    images: ['https://aurahomeoffice.com/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aura Home Office | Home Office Buying Guide',
    description:
      'Research-based reviews on standing desks, ergonomic chairs, and workspace gear for real home offices.',
    images: ['https://aurahomeoffice.com/og-image.jpg'],
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
  other: {
    'msapplication-TileColor': '#1F1E1C',
    'theme-color': '#FAFAF8',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSerif.variable} ${dmSans.variable} ${mono.variable}`}>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
        {/* WebSite Schema — enables Google Sitelinks Searchbox */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Aura Home Office',
              url: 'https://aurahomeoffice.com',
              description:
                'Independent home office buying guide covering standing desks, ergonomic chairs, monitor arms, and workspace gear.',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate:
                    'https://aurahomeoffice.com/search?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
              publisher: {
                '@type': 'Organization',
                name: 'Aura Home Office',
                url: 'https://aurahomeoffice.com',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://aurahomeoffice.com/og-image.jpg',
                },
              },
            }),
          }}
        />
      </head>
      <body className="antialiased flex flex-col min-h-screen" style={{ fontFamily: 'var(--font-ui)', background: 'var(--color-bg)', color: 'var(--color-text-body)' }}>
        <Suspense fallback={null}>
          <NavigationProgressBar />
        </Suspense>
        <Navbar />
        <div>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
