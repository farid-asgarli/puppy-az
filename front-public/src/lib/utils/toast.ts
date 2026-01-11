import toast from 'react-hot-toast';

/**
 * Toast Utility
 *
 * Wrapper around react-hot-toast with convenient methods for showing notifications.
 * Can be extended with additional custom toast types as needed.
 */

export const showToast = {
  /**
   * Show a success toast notification
   */
  success: (message: string) => {
    toast.success(message);
  },

  /**
   * Show an error toast notification
   */
  error: (message: string) => {
    toast.error(message);
  },

  /**
   * Show an info/default toast notification
   */
  info: (message: string) => {
    toast(message);
  },

  /**
   * Show a loading toast notification
   * Returns a toast ID that can be used to dismiss it later
   */
  loading: (message: string) => {
    return toast.loading(message);
  },

  /**
   * Dismiss a specific toast by ID
   */
  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },

  /**
   * Show a promise-based toast that updates based on promise state
   */
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages);
  },
};
