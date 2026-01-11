/**
 * Formats a date as "month year" (e.g., "november 2025")
 * Use this for consistent month-year formatting without hydration issues
 *
 * @param dateInput - Date to format
 * @param t - Translation function from useTranslations('dateTime')
 */
export const formatMonthYear = (dateInput: string | Date, t: (key: string) => string): string => {
  let date: Date;

  if (typeof dateInput === 'string') {
    const cleanedDateString = dateInput.replace(/(\.\d{3})\d+(Z?)$/, '$1$2');
    date = new Date(cleanedDateString);
  } else {
    date = dateInput;
  }

  if (isNaN(date.getTime())) {
    console.error('Invalid date:', dateInput);
    return t('noDate');
  }

  const monthKey = `months.${date.getMonth()}` as const;
  return `${t(monthKey)} ${date.getFullYear()}`;
};

export const formatDate = (dateInput: string | Date, t: (key: string) => string): string => {
  let date: Date;

  if (typeof dateInput === 'string') {
    // Handle dates with microseconds (e.g., "2025-11-01T08:51:19.751947Z")
    // Some browsers don't handle microseconds well, so we truncate to milliseconds
    const cleanedDateString = dateInput.replace(/(\.\d{3})\d+(Z?)$/, '$1$2');
    date = new Date(cleanedDateString);
  } else {
    date = dateInput;
  }

  // Validate date
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', dateInput);
    return t('noDate');
  }

  const now = Date.now();
  const timestamp = date.getTime();
  const diff = now - timestamp;

  // Handle future dates - if timestamp is in the future, format as full date
  if (diff < 0) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const timeFormat = new Intl.DateTimeFormat('az', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
    return `${day}.${month}.${year}, ${timeFormat}`;
  }

  // Calculate time differences
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  // Less than 1 minute
  if (minutes < 1) return t('justNow');

  // Less than 60 minutes
  if (minutes < 60) return `${minutes} ${t('minutesAgo')}`;

  // Less than 24 hours
  if (hours < 24) return `${hours} ${t('hoursAgo')}`;

  // Yesterday (1 day ago)
  if (days === 1) return t('yesterday');

  // Less than 7 days
  if (days < 7) return `${days} ${t('daysAgo')}`;

  // Otherwise, format as "5.10.2025, HH:mm"
  const dateObj = new Date(timestamp);
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1; // +1 because getMonth() returns 0-11
  const year = dateObj.getFullYear();

  // Format time as HH:mm
  const timeFormat = new Intl.DateTimeFormat('az', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(dateObj);

  return `${day}.${month}.${year}, ${timeFormat}`;
};
