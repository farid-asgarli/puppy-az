import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const cereal = localFont({
  src: [
    {
      path: './fonts/cereal/CerealVF_W_Wght.woff2',
      style: 'normal',
    },
    {
      path: './fonts/cereal/CerealVF_Italics_W_Wght.woff2',
      style: 'italic',
    },
  ],
  variable: '--font-cereal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'tap.az — Heyvanlar',
  description: 'tap.az heyvanlar kateqoriyasından elanlar',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" className={`${cereal.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
