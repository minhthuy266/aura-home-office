import './globals.css';
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
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
  alternates: {
    canonical: '/',
  },
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
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  other: {
    'msapplication-TileColor': '#1A1A1A',
    'theme-color': '#1A1A1A',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${mono.variable} scroll-smooth`}>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
      </head>
      <body className="font-sans antialiased bg-[#FAFAF7] text-[#1A1A1A] luxury-grain flex flex-col min-h-screen">
        <NextTopLoader 
          color="#C4A265"
          initialPosition={0.08}
          crawlSpeed={200}
          height={2}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #C4A265,0 0 5px #C4A265"
        />
        <Navbar />
        <div className="animate-in">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
