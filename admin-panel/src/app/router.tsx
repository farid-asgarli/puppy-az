import { Routes, Route, Navigate } from "react-router-dom";
import { lazy } from "react";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { MainLayout } from "@/widgets/layout/MainLayout";

// Lazy load pages for code splitting
const LoginPage = lazy(() => import("@/pages/login/LoginPage"));
const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"));
const ListingsPage = lazy(() => import("@/pages/listings/ListingsPage"));
const ListingDetailPage = lazy(
  () => import("@/pages/listings/ListingDetailPage"),
);
const CreateAdPage = lazy(() => import("@/pages/create-ad"));
const UsersPage = lazy(() => import("@/pages/users/UsersPage"));
const CitiesPage = lazy(() => import("@/pages/cities/CitiesPage"));
const DistrictsPage = lazy(() => import("@/pages/districts/DistrictsPage"));
const ColorsPage = lazy(() => import("@/pages/colors/ColorsPage"));
const ListingTypesPage = lazy(
  () => import("@/pages/listing-types/ListingTypesPage"),
);
const CategoriesPage = lazy(() => import("@/pages/categories/CategoriesPage"));
const BreedsPage = lazy(() => import("@/pages/breeds/BreedsPage"));
const BreedSuggestionsPage = lazy(
  () => import("@/features/breed-suggestions/pages/BreedSuggestionsPage"),
);
const ContactMessagesPage = lazy(
  () => import("@/pages/contact-messages/ContactMessagesPage"),
);
const StaticSectionsPage = lazy(
  () => import("@/pages/static-sections/StaticSectionsPage"),
);
const NotFoundPage = lazy(() => import("@/pages/not-found/NotFoundPage"));
const NoAccessPage = lazy(() => import("@/pages/no-access/NoAccessPage"));

export function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="create-ad" element={<CreateAdPage />} />
        <Route path="listings" element={<ListingsPage />} />
        <Route path="listings/:id" element={<ListingDetailPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="cities" element={<CitiesPage />} />
        <Route path="districts" element={<DistrictsPage />} />
        <Route path="colors" element={<ColorsPage />} />
        <Route path="listing-types" element={<ListingTypesPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="breeds" element={<BreedsPage />} />
        <Route path="breed-suggestions" element={<BreedSuggestionsPage />} />
        <Route path="contact-messages" element={<ContactMessagesPage />} />
        <Route path="static-sections" element={<StaticSectionsPage />} />
        <Route path="no-access" element={<NoAccessPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
