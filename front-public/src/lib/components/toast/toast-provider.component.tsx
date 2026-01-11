'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

/**
 * ToastProvider Component
 *
 * Global toast notification provider with custom styling matching the design system.
 * Uses react-hot-toast under the hood with custom configuration.
 *
 * Should be added to the root layout to enable toast notifications throughout the app.
 */
export function ToastProvider() {
  return (
    <HotToaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options applied to all toasts
        duration: 3000,
        style: {
          background: '#ffffff',
          color: '#1a1a1a',
          borderRadius: '24px',
          padding: '16px 20px',
          fontSize: '14px',
          fontWeight: 500,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          maxWidth: '500px',
        },
        // Success toast styling
        success: {
          duration: 3000,
          style: {
            background: '#f0fdf4',
            color: '#166534',
            border: '1px solid #86efac',
          },
          iconTheme: {
            primary: '#16a34a',
            secondary: '#f0fdf4',
          },
        },
        // Error toast styling
        error: {
          duration: 4000,
          style: {
            background: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #fca5a5',
          },
          iconTheme: {
            primary: '#dc2626',
            secondary: '#fef2f2',
          },
        },
        // Loading toast styling
        loading: {
          style: {
            background: '#f3f4f6',
            color: '#374151',
            border: '1px solid #d1d5db',
          },
          iconTheme: {
            primary: '#6b7280',
            secondary: '#f3f4f6',
          },
        },
        // Custom toast styling
        custom: {
          duration: 3000,
        },
      }}
    />
  );
}
