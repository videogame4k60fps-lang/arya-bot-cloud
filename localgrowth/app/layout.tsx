import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LocalGrowth AI',
  description: 'Trova attività locali che hanno bisogno dei tuoi servizi',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={`${inter.className} bg-gray-50`}>{children}</body>
    </html>
  );
}
