import '../globals.css';
import { AuthProvider } from '@/lib/hooks/use-auth';
import { FavoritesProvider } from '@/lib/hooks/use-favorites';
import { getFavoriteAdIdsAction, checkAuthAction, getProfileAction } from '@/lib/auth/actions';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { ToastProvider } from '@/lib/components/toast';
import { Footer } from '@/lib/components/footer/footer.component';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Fetch auth state and favorite IDs on server side
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as 'az' | 'en' | 'ru')) {
    notFound();
  }

  const isAuth = await checkAuthAction();
  const profileResult = isAuth ? await getProfileAction() : null;
  const favoritesResult = await getFavoriteAdIdsAction();

  const initialAuth = {
    isAuthenticated: isAuth,
    user: profileResult?.success ? profileResult.data : null,
  };
  const initialFavorites = favoritesResult.success ? favoritesResult.data : [];

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <AuthProvider initialAuth={initialAuth}>
        <FavoritesProvider initialFavorites={initialFavorites}>
          <main className="w-full mx-auto">
            {children}
            <Footer />
          </main>
        </FavoritesProvider>
      </AuthProvider>
      <ToastProvider />
    </NextIntlClientProvider>
  );
}
