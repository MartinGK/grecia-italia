import type { Metadata } from 'next';
import { Manrope, Playfair_Display } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Grecia + Italia 2026 | Travel Magazine Itinerary',
  description:
    'Itinerario visual mobile-first de Grecia e Italia (abril 2026): timeline, ciudades, maps links, tips logísticos y galerías con fotos reales.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${manrope.variable} ${playfair.variable} font-[var(--font-manrope)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
