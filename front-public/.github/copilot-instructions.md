# Copilot Instructions for puppy.az

## Architecture Overview

This is a **Next.js 16 (App Router)** multilingual pet marketplace with **server-first architecture**. The app uses:

- **next-intl** for i18n routing (`src/i18n/routing.ts` defines `az`, `en`, `ru` locales, default: `az`)
- **Server Actions** (`src/lib/auth/actions.ts`) as the primary API bridge, not direct client-side API calls
- **Two-layout pattern**: Root `layout.tsx` is minimal; `[locale]/layout.tsx` handles providers, fonts, and SSR auth/favorites initialization

## Critical Patterns

### 1. Server Actions Over Direct API Calls

Never call `authService`, `petAdService`, etc. directly from client components. Always use Server Actions from `@/lib/auth/actions.ts`.

```tsx
// ❌ WRONG - client component calling API directly
import { petAdService } from "@/lib/api/services/pet-ad.service";
const data = await petAdService.getPetAds();

// ✅ CORRECT - using Server Action
import { getPetAdsAction } from "@/lib/auth/actions";
const result = await getPetAdsAction(params);
```

**Locale Propagation Pattern:**
Server Actions must pass locale to service calls for backend localization:

```tsx
import { getCurrentLocale } from "@/lib/auth/locale-utils";

export async function getProfileAction(): Promise<
  ActionResult<UserProfileDto>
> {
  const locale = await getCurrentLocale(); // Always get locale first
  return withAuth(async (token) => {
    const profile = await authService.getProfile(token, locale); // Pass as last param
    return { success: true, data: profile };
  });
}
```

Service methods accept optional `locale` as **last parameter** and pass to `withAuth(token, locale)` or `withLocale(locale)`.

**Client Component Exception:**
If a client component absolutely must call a service (rare cases like prefetching for cache warming), use URL-based locale:

```tsx
"use client";
import { useParams } from "next/navigation";

export function MyClientComponent() {
  const params = useParams();
  const locale = params.locale as string; // az | en | ru

  useEffect(() => {
    // Pass locale from URL params
    petAdService.getPetBreeds(categoryId, locale);
  }, [categoryId, locale]);
}
```

**Better approach**: Create a Server Action for it instead.

### 2. Global State: Auth & Favorites Providers

`AuthProvider` and `FavoritesProvider` (in `src/lib/hooks/`) are initialized with SSR data in `[locale]/layout.tsx`:

```tsx
const isAuth = await checkAuthAction();
const profileResult = isAuth ? await getProfileAction() : null;
const favoritesResult = await getFavoriteAdIdsAction();
```

Never initialize these providers again in child components. Always consume via `useAuth()` and `useFavorites()`.

### 3. Filter Architecture: URL-First, No State Store

**Filters use URL params as the single source of truth** (`src/lib/filtering/use-filter-url.ts`).

- DO NOT create separate filter state stores
- Read filters from URL: `const filters = useMemo(() => FilterValidator.validateFilters(params), [searchParams])`
- Update filters by navigating with new search params
- Use `useViewTransition()` for smooth filter updates with React 19 View Transitions

### 4. Component Library: Primitives + CVA

UI components live in `src/lib/primitives/` and use **class-variance-authority (CVA)** for variant management:

```tsx
const buttonVariants = cva(
  'base-classes',
  {
    variants: {
      variant: { primary: 'rounded-24 bg-black text-white', ... },
      size: { sm: 'h-10 px-4', md: 'h-12 px-5', ... }
    }
  }
);
```

Always import primitives from `@/lib/primitives` barrel export. Combine classes with `cn()` from `@/lib/external/utils`.

### 5. Typography System

Use semantic typography components (`src/lib/primitives/typography/`):

- `<Heading variant="page-title" />` for page titles (not raw `<h1>`)
- `<Text variant="body" />` for body text (not raw `<p>`)
- See `src/lib/primitives/typography/README.md` for full variant table

### 6. Forms: Controlled with Form Utilities

Form components in `src/lib/form/components/` use shared utilities for consistent styling:

- `<TextInput>`, `<PhoneInput>`, `<SelectInput>` with rounded-2xl borders, blue focus states
- Wrap with `FormFieldWrapper` for error/label handling
- Icons use `shrink-0` to prevent squeezing; inputs use `min-w-0` to prevent overflow

### 7. Caching Strategy

- **DisplayCache** (`src/lib/caching/display-cache.ts`): In-memory cache for categories/cities/breeds UI data
- **CacheManager** (`src/lib/utils/cache-manager.ts`): Generic TTL-based cache with request deduplication
- Cache initialization happens in SSR pages, client components read from DisplayCache

### 8. Internationalization (i18n)

- Client: `const t = useTranslations('namespace');` then `t('key')`
- Server: `const t = await getTranslations('namespace');`
- Messages in `src/messages/{az,en,ru}.json`
- Navigation: Import `Link`, `redirect`, `useRouter` from `@/i18n/routing`, NOT `next/navigation`

**Backend Localization:**
Backend API accepts `Accept-Language` header on all endpoints. Locale is automatically injected via `LocaleInterceptor`:

- Server Actions: Use `getCurrentLocale()` from `@/lib/auth/locale-utils`
- SSR Pages: Use `getLocale()` from `next-intl/server`
- Services: Add `locale?: string` as last parameter, pass to `withAuth(token, locale)` or `withLocale(locale)`

## Development Commands

```bash
npm run dev          # Start dev server (Turbopack enabled)
npm run build        # Production build
npm run lint         # ESLint check
npm run lint:fix     # Auto-fix linting issues
```

## File Naming Conventions

- Components: `*.component.tsx` (e.g., `button.component.tsx`)
- Views: `*.view.tsx` (e.g., `home.view.tsx`)
- Sections: `*.section.tsx` (e.g., `hero.section.tsx`)
- Hooks: `use-*.ts` (e.g., `use-auth.ts`)
- Actions: `*.actions.ts` (Server Actions only)
- Services: `*.service.ts` (API clients in `src/lib/api/services/`)

## View Organization

Views in `src/lib/views/` are page-level components with optional `sections/` subdirectories:

```
src/lib/views/
  pet-ad-details/
    pet-ad-details.view.tsx
    sections/
      hero.section.tsx
      quick-info.section.tsx
```

Pages import views: `import { HomeView } from '@/lib/views/home';`

## API Layer

Backend integration:

- Base URL: `process.env.NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5005`)
- Client: `ApiClient` in `src/lib/api/client.ts` with automatic JWT header injection
- Services: `authService`, `petAdService`, `citiesService`, `favoriteAdService`
- **Remember**: Only call services from Server Actions, not client components

## Client/Server Boundary

- `'use client'` at top of file for hooks, context, event handlers, browser APIs
- Server components (default): Data fetching, metadata generation, SSR
- Server Actions (`'use server'`): API calls, cookie management, redirects

## Known Gotchas

1. **Image optimization**: `next.config.ts` allows local IPs with `dangerouslyAllowLocalIP: true` for dev
2. **Font loading**: Uses `localFont` for DM Sans and Poppins in `[locale]/layout.tsx`
3. **Filtering**: Never store filter state outside URL params—causes sync issues
4. **Auth refresh**: `useAuth()` auto-refreshes tokens before expiry (see `TOKEN_EXPIRY_BUFFER_SECONDS`)
5. **Draft persistence**: `AdPlacementContext` auto-saves to localStorage with 5-day expiration

PLEASE FOLLOW THE BEST PRACTICES TO ENSURE CODE QUALITY AND CONSISTENCY ACROSS THE PROJECT.

AND DO NOT GENERATE README DOCUMENT UNLESS REQUESTED.
