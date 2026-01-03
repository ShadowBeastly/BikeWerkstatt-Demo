import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { businessConfig } from '@/config/appConfig';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: `${businessConfig.name} | Online-Terminbuchung`,
    template: `%s | ${businessConfig.name}`,
  },
  description: 'Online-Termine für Beratung, Reparatur und Probefahrt. Klar, schnell, planbar. Ihre Fahrradwerkstatt in Frankfurt am Main.',
  keywords: ['Fahrrad', 'E-Bike', 'Werkstatt', 'Frankfurt', 'Reparatur', 'Beratung', 'Probefahrt', 'Termin'],
  authors: [{ name: businessConfig.name }],
  openGraph: {
    title: `${businessConfig.name} | Online-Terminbuchung`,
    description: 'Online-Termine für Beratung, Reparatur und Probefahrt. Klar, schnell, planbar.',
    type: 'website',
    locale: 'de_DE',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={inter.variable}>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
