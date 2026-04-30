// Root layout - minimal wrapper
// All content and providers are handled by [locale]/layout.tsx
import { cn } from '@/lib/external/utils';
import { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

// Airbnb Cereal - Multilingual support for English, Azerbaijani, and Russian
const cereal = localFont({
  src: [
    {
      path: './fonts/cereal/CerealVF_W_Wght.woff2',
      weight: '300 700',
      style: 'normal',
    },
    {
      path: './fonts/cereal/CerealVF_Cyril_W_Wght.woff2',
      weight: '300 700',
      style: 'normal',
    },
    {
      path: './fonts/cereal/CerealVF_Italics_W_Wght.woff2',
      weight: '300 700',
      style: 'italic',
    },
  ],
  variable: '--font-cereal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'puppy.az - Ev heyvanları elanları platforması',
  description: 'Azərbaycanda ev heyvanları alqı-satqısı üçün ən böyük platforma. İtlər, pişiklər və digər heyvanlar üçün elanlar.',
  metadataBase: new URL('https://puppy.az'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className={cn(cereal.variable, 'font-sans antialiased')}>{children}</body>
    </html>
  );
}
