import './globals.css';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';

export const metadata = {
  title: 'Aura Home Office',
  description: 'The Curated Setup Guide for your home office.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased bg-[#FAF9F6] text-zinc-900">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
