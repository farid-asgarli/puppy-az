import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/shared/stores/authStore";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
}

export function ProtectedRoute({
  children,
  requiredRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) =>
      user?.roles?.includes(role),
    );

    if (!hasRequiredRole) {
      return <Navigate to="/no-access" replace />;
    }
  }

  return <>{children}</>;
}
