"use client";

import { useState, useRef, useEffect } from "react";
import {
  IconUser,
  IconHeart,
  IconPlus,
  IconSettings,
  IconLogout,
  IconReceipt,
  IconHelpCircle,
  IconMenu2,
  IconPencil,
  IconUserPlus,
} from "@tabler/icons-react";
import { cn } from "@/lib/external/utils";
import TransitionLink from "@/lib/components/transition-link";
import { useAuth } from "@/lib/hooks/use-auth";
import { logoutAction } from "@/lib/auth/actions";
import { Text } from "@/lib/primitives/typography";
import { useClickOutside } from "@/lib/hooks/use-click-outside";
import { useTranslations } from "next-intl";

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "danger";
}

interface MenuAction {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "danger";
}

interface MenuSection {
  items: MenuAction[];
}

const MenuItem = ({
  icon,
  label,
  href,
  onClick,
  className,
  variant = "default",
}: MenuItemProps) => {
  const baseClasses = cn(
    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
    "text-left text-sm font-semibold",
    variant === "default" && "text-gray-700 hover:bg-gray-100",
    variant === "danger" && "text-red-600 hover:bg-red-50",
    className,
  );

  const iconClasses = cn(
    "flex-shrink-0",
    variant === "default" && "text-gray-700",
    variant === "danger" && "text-red-600",
  );

  const content = (
    <>
      <span className={iconClasses}>{icon}</span>
      <span>{label}</span>
    </>
  );

  if (href) {
    return (
      <TransitionLink href={href} className={baseClasses} onClick={onClick}>
        {content}
      </TransitionLink>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
};

const MenuDivider = () => <div className="h-px bg-gray-200 my-2" />;

export default function NavbarUserMenu() {
  const { isAuthenticated, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("navigation");
  const tAccessibility = useTranslations("accessibility");

  // Check for saved draft in localStorage
  useEffect(() => {
    const checkDraft = () => {
      if (!user?.id) {
        setHasDraft(false);
        return;
      }
      try {
        const draftKey = `ad_placement_draft_${user.id}`;
        const saved = localStorage.getItem(draftKey);
        if (!saved) {
          setHasDraft(false);
          return;
        }
        const parsed = JSON.parse(saved);
        const expirationTime = 5 * 24 * 60 * 60 * 1000; // 5 days
        const isExpired = Date.now() - parsed.timestamp > expirationTime;
        setHasDraft(!isExpired);
      } catch {
        setHasDraft(false);
      }
    };

    checkDraft();
    // Re-check when window gains focus (user might have created draft in another tab)
    window.addEventListener("focus", checkDraft);
    return () => window.removeEventListener("focus", checkDraft);
  }, [user?.id]);

  console.log(
    "NavbarUserMenu - isAuthenticated:",
    isAuthenticated,
    "user:",
    user,
  );

  useClickOutside(menuRef, () => setIsMenuOpen(false));

  const closeMenu = () => setIsMenuOpen(false);

  const getUserInitials = () => {
    if (!user?.firstName) return "U";
    return user.firstName.charAt(0).toUpperCase();
  };

  const handleLogout = async () => {
    await logoutAction();
    closeMenu();
  };

  const authenticatedMenuSections: MenuSection[] = [
    {
      items: [
        {
          icon: <IconPlus size={20} className="stroke-[2.5]" />,
          label: t("postAd"),
          href: hasDraft ? "/ads/ad-placement?new=true" : "/ads/ad-placement",
        },
        {
          icon: <IconReceipt size={20} />,
          label: t("myAds"),
          href: "/my-account/ads/active",
        },
        {
          icon: <IconHeart size={20} />,
          label: t("favorites"),
          href: "/ads/favorites",
        },
        ...(hasDraft
          ? [
              {
                icon: <IconPencil size={20} />,
                label: t("draftAds"),
                href: "/ads/ad-placement",
              },
            ]
          : []),
      ],
    },
    {
      items: [
        {
          icon: <IconUser size={20} />,
          label: t("myAccount"),
          href: "/my-account",
        },
        {
          icon: <IconSettings size={20} />,
          label: t("settings"),
          href: "/my-account/settings",
        },
        {
          icon: <IconHelpCircle size={20} />,
          label: t("help"),
          href: "/help",
        },
      ],
    },
    {
      items: [
        {
          icon: <IconLogout size={20} />,
          label: t("logout"),
          onClick: handleLogout,
          variant: "danger",
        },
      ],
    },
  ];

  const guestMenuSections: MenuSection[] = [
    {
      items: [
        {
          icon: <IconUser size={20} />,
          label: t("login"),
          href: "/auth",
        },
        {
          icon: <IconUserPlus size={20} />,
          label: t("register"),
          href: "/register",
        },
      ],
    },
    {
      items: [
        {
          icon: <IconHeart size={20} />,
          label: t("favorites"),
          href: "/ads/favorites",
        },
        {
          icon: <IconPlus size={20} className="stroke-[2.5]" />,
          label: t("postAd"),
          href: "/ads/ad-placement",
        },
        {
          icon: <IconHelpCircle size={20} />,
          label: t("help"),
          href: "/help",
        },
      ],
    },
  ];

  const menuSections = isAuthenticated
    ? authenticatedMenuSections
    : guestMenuSections;

  return (
    <div className="flex items-center gap-2 relative" ref={menuRef}>
      {isAuthenticated && (
        <TransitionLink
          href="/my-account"
          className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors overflow-hidden"
          aria-label={tAccessibility("userMenu")}
        >
          {user?.profilePictureUrl ? (
            <img
              src={user.profilePictureUrl}
              alt={user.firstName || "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-sm font-medium">
              {getUserInitials()}
            </span>
          )}
        </TransitionLink>
      )}

      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
        aria-label={tAccessibility("menu")}
      >
        <IconMenu2 className="w-4 h-4 text-gray-700" />
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 top-14 z-50 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 overflow-hidden">
          {isAuthenticated && user && (
            <>
              <div className="px-4 py-4 bg-gray-50 m-2 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                    {user.profilePictureUrl ? (
                      <img
                        src={user.profilePictureUrl}
                        alt={user.firstName || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.firstName?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Text
                      variant="body"
                      weight="semibold"
                      className="text-sm truncate text-gray-900"
                    >
                      {user.firstName} {user.lastName}
                    </Text>
                    <Text
                      variant="small"
                      className="text-xs truncate text-gray-600"
                    >
                      {user.email}
                    </Text>
                  </div>
                </div>
              </div>
              <MenuDivider />
            </>
          )}

          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <div className="px-2 py-1">
                {section.items.map((item, itemIndex) => (
                  <MenuItem
                    key={itemIndex}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    onClick={item.onClick ? item.onClick : closeMenu}
                    variant={item.variant}
                  />
                ))}
              </div>
              {sectionIndex < menuSections.length - 1 && <MenuDivider />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
