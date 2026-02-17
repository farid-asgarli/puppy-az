import "../globals.css";
import { AuthProvider } from "@/lib/hooks/use-auth";
import { FavoritesProvider } from "@/lib/hooks/use-favorites";
import { AdTypesProvider } from "@/lib/hooks/use-ad-types";
import { SignalRProvider } from "@/lib/hooks/use-signalr";
import {
  getFavoriteAdIdsAction,
  checkAuthAction,
  getProfileAction,
  getAdTypesAction,
} from "@/lib/auth/actions";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing, notFound } from "@/i18n";
import { ToastProvider } from "@/lib/components/toast";
import { Footer } from "@/lib/components/footer/footer.component";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as "az" | "en" | "ru")) {
    notFound();
  }

  // Fetch all data in PARALLEL for faster page loads
  const [isAuth, favoritesResult, adTypesResult, messages] = await Promise.all([
    checkAuthAction(),
    getFavoriteAdIdsAction(),
    getAdTypesAction(),
    getMessages(),
  ]);

  // Profile is only fetched if authenticated - this is intentionally separate
  const profileResult = isAuth ? await getProfileAction() : null;

  const initialAuth = {
    isAuthenticated: isAuth,
    user: profileResult?.success ? profileResult.data : null,
  };
  const initialFavorites = favoritesResult.success ? favoritesResult.data : [];
  const initialAdTypes = adTypesResult.success ? adTypesResult.data : [];

  return (
    <NextIntlClientProvider messages={messages}>
      <AuthProvider initialAuth={initialAuth}>
        <SignalRProvider>
          <FavoritesProvider initialFavorites={initialFavorites}>
            <AdTypesProvider initialAdTypes={initialAdTypes}>
              <main className="w-full mx-auto">
                {children}
                <Footer />
              </main>
            </AdTypesProvider>
          </FavoritesProvider>
        </SignalRProvider>
      </AuthProvider>
      <ToastProvider />
    </NextIntlClientProvider>
  );
}
