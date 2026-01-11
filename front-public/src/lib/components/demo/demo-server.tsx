import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export async function DemoServer() {
  const t = await getTranslations('Demo');
  const tNav = await getTranslations('Navigation');

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-md border border-green-200">
      <h2 className="text-2xl font-bold text-emerald-900 mb-4">
        {t('serverComponent')}
      </h2>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <p className="text-gray-700 font-medium mb-2">{t('title')}</p>
          <p className="text-gray-600 text-sm">{t('description')}</p>
        </div>

        <div className="bg-white p-4 rounded-md shadow-sm">
          <p className="text-gray-700 font-medium mb-2">
            {t('greeting', { name: 'User' })}
          </p>
        </div>

        <div className="bg-white p-4 rounded-md shadow-sm">
          <p className="text-gray-700 font-medium mb-3">Navigation Links:</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              {tNav('home')}
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              {tNav('about')}
            </Link>
            <Link
              href="/help"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              {tNav('contact')}
            </Link>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This is a Server Component. It renders on the server and automatically uses the locale from the URL.
          </p>
        </div>
      </div>
    </div>
  );
}
