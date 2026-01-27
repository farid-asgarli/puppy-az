import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Lightweight wrappers around Next.js' navigation
// APIs that consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

// Re-export Next.js navigation APIs that don't need locale handling
// These are re-exported for centralized imports and DRY principle
export { useParams, useSearchParams, notFound } from "next/navigation";

// Re-export useServerInsertedHTML from next/navigation for SSR
export { useServerInsertedHTML } from "next/navigation";
