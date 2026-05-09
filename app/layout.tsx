import './globals.css';
import { Playfair_Display, Source_Serif_4, DM_Sans, JetBrains_Mono } from 'next/font/google';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import NavigationProgressBar from '../src/components/NavigationProgressBar';
import { Suspense } from 'react';
import Script from 'next/script';

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
    'Independent home office buying guide. We research standing desks, chairs, and gear so you can buy right the first time without wasting money on the wrong equipment.',
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
    images: ['https://aurahomeoffice.com/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aura Home Office | Home Office Buying Guide',
    description:
      'Research-based reviews on standing desks, ergonomic chairs, and workspace gear for real home offices.',
    images: ['https://aurahomeoffice.com/og-image.png'],
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
        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-SV50DG3HTR`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SV50DG3HTR');
          `}
        </Script>
        
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PHXM2WJG');`,
          }}
        />
        {/* Bootstrap Icons — lazy loaded to avoid render-blocking */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
          media="print"
          // @ts-ignore — onLoad is valid for lazy-loading CSS
          onLoad="this.media='all'"
        />
        <noscript>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
        </noscript>
        {/* Organization Schema — Essential for E-E-A-T Entity Recognition */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              '@id': 'https://aurahomeoffice.com/#organization',
              name: 'Aura Home Office',
              url: 'https://aurahomeoffice.com',
              logo: {
                '@type': 'ImageObject',
                '@id': 'https://aurahomeoffice.com/#logo',
                url: 'https://aurahomeoffice.com/og-image.png',
                contentUrl: 'https://aurahomeoffice.com/og-image.png',
                width: 1200,
                height: 630,
                caption: 'Aura Home Office',
              },
              image: { '@id': 'https://aurahomeoffice.com/#logo' },
              sameAs: [
                'https://twitter.com/aurahomeoffice',
                'https://www.linkedin.com/company/aura-home-office',
                'https://www.pinterest.com/aurahomeoffice',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'contact@aurahomeoffice.com',
                contactType: 'editorial',
              },
            }),
          }}
        />

        {/* WebSite Schema — enables Google Sitelinks Searchbox */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              '@id': 'https://aurahomeoffice.com/#website',
              name: 'Aura Home Office',
              url: 'https://aurahomeoffice.com',
              description:
                'Independent home office buying guide covering standing desks, ergonomic chairs, monitor arms, and workspace gear.',
              publisher: { '@id': 'https://aurahomeoffice.com/#organization' },
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate:
                    'https://aurahomeoffice.com/search?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="antialiased flex flex-col min-h-screen" style={{ fontFamily: 'var(--font-ui)', background: 'var(--color-bg)', color: 'var(--color-text-body)' }}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PHXM2WJG"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
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
