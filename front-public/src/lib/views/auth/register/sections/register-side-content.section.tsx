'use client';

import { useTranslations } from 'next-intl';

export const RegisterSideContent = () => {
  const t = useTranslations('login');
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005';

  return (
    <div className="relative w-full h-full bg-gray-900 overflow-hidden">
      {/* Background Video */}
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src={`${backendUrl}/uploads/videos/login-3.mp4`} type="video/mp4" />
      </video>

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Bottom Content - Takes 1/3 vertically */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 flex items-end p-8 lg:p-10 xl:p-12">
        <div className="space-y-4">
          <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white leading-tight">{t('sideContent.title')}</h2>
          <p className="text-base lg:text-lg text-gray-200 leading-relaxed max-w-md">{t('sideContent.description')}</p>
        </div>
      </div>
    </div>
  );
};
