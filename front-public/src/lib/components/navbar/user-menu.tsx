"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  IconMessageCircle,
} from "@tabler/icons-react";
import { cn } from "@/lib/external/utils";
import TransitionLink from "@/lib/components/transition-link";
import { useAuth } from "@/lib/hooks/use-auth";
import { logoutAction } from "@/lib/auth/actions";
import { Text } from "@/lib/primitives/typography";
import { useClickOutside } from "@/lib/hooks/use-click-outside";
import { useTranslations } from "next-intl";
import { messageService } from "@/lib/api";
import { getMyAdsQuestionsSummaryAction } from "@/lib/auth/actions";
import { useSignalROptional } from "@/lib/hooks/use-signalr";

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
  const { isAuthenticated, user, getToken } = useAuth();
  const signalR = useSignalROptional();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unansweredQuestionsCount, setUnansweredQuestionsCount] = useState(0);
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

  // Load unread message count
  const loadUnreadCount = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setUnreadCount(0);
      return;
    }
    try {
      const token = await getToken();
      if (!token) return;
      const count = await messageService.getUnreadCount(token);
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to load unread messages count:", error);
      setUnreadCount(0);
    }
  }, [isAuthenticated, user?.id, getToken]);

  // Load unanswered questions count
  const loadUnansweredCount = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setUnansweredQuestionsCount(0);
      return;
    }
    try {
      const result = await getMyAdsQuestionsSummaryAction();
      if (result.success && result.data) {
        setUnansweredQuestionsCount(result.data.unansweredQuestions);
      }
    } catch (error) {
      console.error("Failed to load unanswered questions count:", error);
      setUnansweredQuestionsCount(0);
    }
  }, [isAuthenticated, user?.id]);

  // Initial load of counts
  useEffect(() => {
    loadUnreadCount();
    loadUnansweredCount();
  }, [loadUnreadCount, loadUnansweredCount]);

  // SignalR real-time updates for counts
  useEffect(() => {
    if (!signalR) return;

    console.log("[Navbar] Setting up SignalR listeners for badge counts");

    // Subscribe to unread count updates
    const unsubscribeUnreadCount = signalR.onUnreadCountUpdate(
      (notification) => {
        console.log("[Navbar] SignalR unread count update:", notification);
        setUnreadCount(notification.unreadMessages);
      },
    );

    // Subscribe to new messages (increment unread count)
    const unsubscribeNewMessage = signalR.onNewMessage((notification) => {
      console.log("[Navbar] SignalR new message:", notification);
      setUnreadCount((prev) => prev + 1);
    });

    // Subscribe to new questions (increment unanswered count)
    const unsubscribeNewQuestion = signalR.onNewQuestion((notification) => {
      console.log("[Navbar] SignalR new question:", notification);
      setUnansweredQuestionsCount((prev) => prev + 1);
    });

    // Subscribe to question answered (decrement count)
    const unsubscribeQuestionAnswered = signalR.onQuestionAnswered(() => {
      setUnansweredQuestionsCount((prev) => Math.max(0, prev - 1));
    });

    return () => {
      unsubscribeUnreadCount();
      unsubscribeNewMessage();
      unsubscribeNewQuestion();
      unsubscribeQuestionAnswered();
    };
  }, [signalR]);

  // Fallback polling (only when SignalR is not connected)
  useEffect(() => {
    if (signalR?.isConnected) {
      console.log("[Navbar] SignalR connected, skipping polling");
      return;
    }

    // Refresh counts every 60 seconds as fallback
    const interval = setInterval(() => {
      console.log("[Navbar] Fallback polling for counts...");
      loadUnreadCount();
      loadUnansweredCount();
    }, 60000);

    return () => clearInterval(interval);
  }, [signalR?.isConnected, loadUnreadCount, loadUnansweredCount]);

  // Listen for custom events (for compatibility with existing code)
  useEffect(() => {
    const handleMessagesRead = () => {
      console.log("[Navbar] Messages read event received, refreshing count...");
      loadUnreadCount();
    };

    const handleQuestionAnswered = () => {
      console.log(
        "[Navbar] Question answered event received, refreshing count...",
      );
      loadUnansweredCount();
    };

    window.addEventListener("messagesRead", handleMessagesRead);
    window.addEventListener("questionAnswered", handleQuestionAnswered);

    return () => {
      window.removeEventListener("messagesRead", handleMessagesRead);
      window.removeEventListener("questionAnswered", handleQuestionAnswered);
    };
  }, [loadUnreadCount, loadUnansweredCount]);

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
          href: "/my-account/ads?tab=active",
        },
        {
          icon: <IconMessageCircle size={20} />,
          label: t("messages"),
          href: "/my-account/messages",
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
          className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors relative"
          aria-label={tAccessibility("userMenu")}
        >
          <div className="w-full h-full rounded-full overflow-hidden">
            {user?.profilePictureUrl ? (
              <img
                src={user.profilePictureUrl}
                alt={user.firstName || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-sm font-medium flex items-center justify-center w-full h-full">
                {getUserInitials()}
              </span>
            )}
          </div>
          {(unreadCount > 0 || unansweredQuestionsCount > 0) && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-md border-2 border-white">
              {unreadCount + unansweredQuestionsCount > 99
                ? "99+"
                : unreadCount + unansweredQuestionsCount}
            </div>
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
              <TransitionLink
                href="/my-account"
                onClick={closeMenu}
                className="block px-4 py-4 bg-gray-50 m-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
              >
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
              </TransitionLink>
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
