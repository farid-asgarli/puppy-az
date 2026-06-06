'use client';

import { useEffect, useState } from 'react';
import { IconX, IconPaw, IconUser } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname, useSearchParams } from '@/i18n';
import Button from '@/lib/primitives/button/button.component';

/**
 * One-time welcome dialog shown after a user's first successful login.
 *
 * It activates when the current URL carries the `welcome=1` query parameter
 * (added by the login flow when the backend reports `isNewUser`). The parameter
 * is removed immediately so the dialog only appears once, even on refresh.
 */
export function WelcomeModal() {
  const t = useTranslations('welcome');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('welcome') === '1') {
      setOpen(true);
      // Strip the flag so the welcome is only shown a single time.
      router.replace(pathname);
    }
    // Only evaluate on mount; we intentionally clean the URL right away.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!open) return null;

  const handleClose = () => setOpen(false);

  const handleCompleteProfile = () => {
    setOpen(false);
    router.push('/my-account/profile-info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-xl my-auto">
        <button
          type="button"
          onClick={handleClose}
          aria-label={t('close')}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <IconX size={20} className="text-gray-500" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mb-4">
            <IconPaw size={32} className="text-primary-600" />
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">{t('title')}</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">{t('subtitle')}</p>

          <div className="w-full space-y-3">
            <Button
              variant="accent"
              size="lg"
              fullWidth
              onClick={handleCompleteProfile}
              leftSection={<IconUser size={18} />}
              className="rounded-xl font-semibold"
            >
              {t('completeProfile')}
            </Button>
            <Button variant="secondary" size="lg" fullWidth onClick={handleClose} className="rounded-xl font-semibold">
              {t('explore')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeModal;
