import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata = {
  title: 'Aura Home Office | The Definitive WFH Gear Curator',
  description: 'Meticulously tested gear reviews and ergonomic setup guides for the modern professional. Curating the aura of your perfect workday.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-[#FAFAF7] text-[#1A1A1A] luxury-grain flex flex-col min-h-screen">
        <Navbar />
        <div className="animate-in">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
