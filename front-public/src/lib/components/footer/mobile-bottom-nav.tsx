"use client";

import { usePathname } from "@/i18n/routing";
import {
  IconHeart,
  IconUser,
  IconPlus,
  IconHome,
  IconSearch,
} from "@tabler/icons-react";
import TransitionLink from "@/lib/components/transition-link";
import { cn } from "@/lib/external/utils";
import { useAuth } from "@/lib/hooks/use-auth";
import { useScrollDirection } from "@/lib/hooks/use-scroll-direction";
import { useTranslations } from "next-intl";

export default function MobileBottomNav() {
  const scrollDirection = useScrollDirection();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const t = useTranslations("common");
  const tNav = useTranslations("navigation");

  // Navigation items configuration
  const navItems = [
    {
      href: "/",
      icon: IconHome,
      label: tNav("home"),
      matchPaths: ["/"],
    },
    {
      href: "/ads/s",
      icon: IconSearch,
      label: t("search"),
      matchPaths: ["/ads/s"],
    },
    {
      href: "/ads/ad-placement",
      icon: IconPlus,
      label: tNav("postAd"),
      matchPaths: ["/ads/ad-placement"],
      isAccent: true,
    },
    {
      href: "/ads/favorites",
      icon: IconHeart,
      label: tNav("favorites"),
      matchPaths: ["/ads/favorites"],
    },
    {
      href: "/my-account",
      icon: IconUser,
      label: isAuthenticated ? tNav("myAccount") : tNav("login"),
      matchPaths: ["/my-account", "/my-ads", "/auth"],
    },
  ];

  // Check if current path matches any of the item's match paths
  const isActive = (item: (typeof navItems)[0]) => {
    return item.matchPaths.some(
      (path) => pathname === path || pathname.startsWith(path + "/"),
    );
  };

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-10",
        "md:hidden",
        "bg-white border-t-2 border-gray-200",
        "transition-transform duration-300",
        scrollDirection === "down" ? "translate-y-full" : "translate-y-0",
      )}
    >
      <div className="safe-area-inset-bottom">
        <div className="flex items-end justify-around px-4 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);

            if (item.isAccent) {
              return (
                <TransitionLink
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center -mt-6"
                >
                  <div className="w-14 h-14 rounded-full bg-pink-600 hover:bg-pink-700 transition-all duration-200 flex items-center justify-center shadow-lg">
                    <Icon size={28} className="text-white" strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-medium text-gray-600 mt-2">
                    {item.label}
                  </span>
                </TransitionLink>
              );
            }

            return (
              <TransitionLink
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 py-1 px-2 min-w-[60px]"
              >
                <Icon
                  size={24}
                  className={cn(
                    "flex-shrink-0",
                    active ? "text-pink-600" : "text-gray-500",
                  )}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium leading-tight text-center",
                    active ? "text-pink-600" : "text-gray-600",
                  )}
                >
                  {item.label}
                </span>
              </TransitionLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
