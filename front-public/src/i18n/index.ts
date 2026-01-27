export { routing, type Locale } from "./routing";
export { Link, redirect, usePathname, useRouter, getPathname, useParams, useSearchParams, notFound, useServerInsertedHTML } from "./navigation";

// Re-export common next-intl hooks and functions for convenience
export { useTranslations, useLocale, useMessages, useNow, useTimeZone, useFormatter } from "next-intl";
export { getTranslations, getLocale, getMessages, getNow, getTimeZone, getFormatter, setRequestLocale } from "next-intl/server";

// Import types to ensure global IntlMessages is available
import "./types";
