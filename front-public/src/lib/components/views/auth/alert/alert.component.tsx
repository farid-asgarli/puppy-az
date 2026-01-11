import { InfoBanner } from '@/lib/components/views/common';
import type { AuthAlertProps } from './alert.types';

/**
 * Build description content from description string and/or details array
 */
function buildDescriptionContent(description?: string, details?: string[]): React.ReactNode {
  if (!description && (!details || details.length === 0)) {
    return undefined;
  }

  return (
    <>
      {description && <span>{description}</span>}
      {details && details.length > 0 && (
        <ul className="mt-1 list-disc list-inside space-y-0.5">
          {details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      )}
    </>
  );
}

/**
 * Auth Alert Component
 * Lightweight wrapper around InfoBanner for auth flows
 * Maps auth-specific naming (message/description) to InfoBanner props (title/description)
 * Supports error, success, and info states
 * Now supports details array for displaying validation errors from ProblemDetails
 */
export const AuthAlert: React.FC<AuthAlertProps> = ({ variant, message, description, details, className }) => {
  const descriptionContent = buildDescriptionContent(description, details);
  return <InfoBanner variant={variant} title={message} description={descriptionContent} size="sm" className={className} />;
};

export default AuthAlert;
