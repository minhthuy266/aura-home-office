import './globals.css';
import { Playfair_Display, Source_Serif_4, DM_Sans, JetBrains_Mono } from 'next/font/google';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import NextTopLoader from 'nextjs-toploader';

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
    default: 'Aura Home Office | Best WFH Gear & Ergonomic Reviews 2026',
    template: '%s | Aura Home Office'
  },
  description: 'Deep-tissue gear reviews and aesthetic setup guides for high-performance home offices. We analyze hundreds of artifacts so you don\'t have to.',
  keywords: ['home office reviews', 'ergonomic setup', 'wfh gear', 'best office chairs 2026', 'standing desk reviews'],
  authors: [{ name: 'Aura Editorial Team' }],
  metadataBase: new URL('https://aurahomeoffice.com'),
  openGraph: {
    title: 'Aura Home Office | Expert-Led Workspace Curation',
    description: 'Elevate your productivity with our meticulously curated ergonomic guides.',
    url: 'https://aurahomeoffice.com',
    siteName: 'Aura Home Office',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aura Home Office | Workspace Artifacts',
    description: 'The definitive guide for your best workday.',
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
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSerif.variable} ${dmSans.variable} ${mono.variable}`}>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
      </head>
      <body className="antialiased flex flex-col min-h-screen" style={{ fontFamily: 'var(--font-ui)', background: 'var(--color-bg)', color: 'var(--color-text-body)' }}>
        <NextTopLoader 
          color="#1A6B5A"
          initialPosition={0.08}
          crawlSpeed={200}
          height={2}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="false"
        />
        <Navbar />
        <div>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
