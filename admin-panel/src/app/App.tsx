import { ConfigProvider, theme, App as AntApp } from 'antd';
import azAZ from 'antd/locale/az_AZ';
import enUS from 'antd/locale/en_US';
import ruRU from 'antd/locale/ru_RU';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { AppRouter } from './router';
import { useThemeStore } from '@/shared/stores/themeStore';
import { useAuthStore } from '@/shared/stores/authStore';
import { scheduleTokenRefresh } from '@/shared/api/httpClient';
import { i18n } from './i18n';
import { GlobalLoading } from '@/shared/components/GlobalLoading';

const antdLocaleMap: Record<string, typeof azAZ> = {
  az: azAZ,
  en: enUS,
  ru: ruRU,
};

// Create Query Client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Ant Design theme configuration
const lightTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    fontFamily: "'Cereal', 'DM Sans', ui-sans-serif, system-ui, -apple-system, sans-serif",
    colorPrimary: '#a855f7',
    colorSuccess: '#22c55e',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#6366f1',
    borderRadius: 8,
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f9fafb',
  },
};

const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    fontFamily: "'Cereal', 'DM Sans', ui-sans-serif, system-ui, -apple-system, sans-serif",
    colorPrimary: '#a855f7',
    colorSuccess: '#22c55e',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#6366f1',
    borderRadius: 8,
    colorBgContainer: '#1f2937',
    colorBgLayout: '#111827',
  },
};

export function App() {
  const isDark = useThemeStore((state) => state.isDark);
  const { isAuthenticated, rememberMe } = useAuthStore();
  const { i18n: i18nInstance } = useTranslation();

  const antdLocale = antdLocaleMap[i18nInstance.language] || enUS;

  // Schedule token refresh on app load if authenticated with rememberMe
  useEffect(() => {
    if (isAuthenticated && rememberMe) {
      scheduleTokenRefresh();
    }
  }, [isAuthenticated, rememberMe]);

  return (
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider theme={isDark ? darkTheme : lightTheme} locale={antdLocale}>
            <AntApp>
              <BrowserRouter basename={import.meta.env.BASE_URL}>
                <Suspense fallback={<GlobalLoading />}>
                  <AppRouter />
                </Suspense>
              </BrowserRouter>
            </AntApp>
          </ConfigProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </I18nextProvider>
    </ErrorBoundary>
  );
}
