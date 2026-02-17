"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  IconUser,
  IconHeart,
  IconPlus,
  IconLayoutGrid,
  IconSettings,
  IconShield,
  IconLogout,
  IconChevronRight,
  IconEdit,
  IconCamera,
  IconCheck,
  IconMapPin,
  IconHelp,
  IconMessages,
  IconMessage,
  IconQuestionMark,
} from "@tabler/icons-react";
import { cn } from "@/lib/external/utils";
import { Heading, Text } from "@/lib/primitives/typography";
import { useAuth } from "@/lib/hooks/use-auth";
import { logoutAction, getDashboardStatsAction } from "@/lib/auth/actions";
import type { UserDashboardStatsDto } from "@/lib/api/types/auth.types";
import { Spinner } from "@/lib/primitives/spinner";
import { IconButton } from "@/lib/primitives/icon-button";
import TransitionLink from "@/lib/components/transition-link";
import { Avatar } from "@/lib/components/avatar";
import { formatMonthYear } from "@/lib/utils/date-utils";
import { AccountMenuItem } from "@/lib/components/views/my-account/menu-item/account-menu-item.component";
import type { Icon } from "@tabler/icons-react";
import { messageService } from "@/lib/api/services/message.service";
import { useSignalROptional } from "@/lib/hooks/use-signalr";

interface MenuItem {
  icon: Icon;
  title: string;
  subtitle: string;
  href: string;
  premium?: boolean;
  badge?: number;
}

const MyAccountView = () => {
  const { user, loading, getToken } = useAuth();
  const signalR = useSignalROptional();
  const tMyAccount = useTranslations("myAccount");
  const tCommon = useTranslations("common");
  const tDate = useTranslations("dateTime");

  const [stats, setStats] = useState<UserDashboardStatsDto | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  // Flash animation states for new notifications
  const [messageFlash, setMessageFlash] = useState(false);
  const [questionFlash, setQuestionFlash] = useState(false);

  // Format date with proper Azerbaijani month names
  const memberSince = React.useMemo(() => {
    if (!user?.createdAt) return tCommon("loading");
    return formatMonthYear(user.createdAt, tDate);
  }, [user?.createdAt, tCommon, tDate]);

  // Fetch dashboard statistics
  const fetchStats = useCallback(async () => {
    if (!user) return;
    setStatsLoading(true);
    const result = await getDashboardStatsAction();
    if (result.success) {
      setStats(result.data);
    }
    setStatsLoading(false);
  }, [user]);

  // Fetch unread messages count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const count = await messageService.getUnreadCount(token);
      setUnreadMessagesCount(count);
    } catch (error) {
      console.error("Failed to fetch unread messages count:", error);
    }
  }, [getToken]);

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchStats();
      fetchUnreadCount();
    }
  }, [user, fetchStats, fetchUnreadCount]);

  // SignalR real-time updates
  useEffect(() => {
    if (!signalR) return;

    console.log("[Dashboard] Setting up SignalR listeners");

    // Listen for new messages
    const unsubscribeNewMessage = signalR.onNewMessage((notification) => {
      console.log("[Dashboard] SignalR: New message received", notification);
      setUnreadMessagesCount((prev) => prev + 1);

      // Flash animation
      setMessageFlash(true);
      setTimeout(() => setMessageFlash(false), 2000);
    });

    // Listen for new questions on my ads
    const unsubscribeNewQuestion = signalR.onNewQuestion((notification) => {
      console.log("[Dashboard] SignalR: New question received", notification);
      // Refresh stats to get updated unanswered count
      fetchStats();

      // Flash animation
      setQuestionFlash(true);
      setTimeout(() => setQuestionFlash(false), 2000);
    });

    // Listen for question answered (to update count)
    const unsubscribeQuestionAnswered = signalR.onQuestionAnswered(() => {
      console.log("[Dashboard] SignalR: Question answered");
      fetchStats();
    });

    return () => {
      unsubscribeNewMessage();
      unsubscribeNewQuestion();
      unsubscribeQuestionAnswered();
    };
  }, [signalR, fetchStats]);

  // Fallback polling (only when SignalR is not connected)
  useEffect(() => {
    if (signalR?.isConnected) {
      console.log("[Dashboard] SignalR connected, using reduced polling");
    }

    // Poll every 60 seconds as fallback (longer interval when SignalR is active)
    const pollInterval = signalR?.isConnected ? 60000 : 30000;

    const interval = setInterval(() => {
      if (user) {
        fetchStats();
        fetchUnreadCount();
      }
    }, pollInterval);

    return () => clearInterval(interval);
  }, [user, signalR?.isConnected, fetchStats, fetchUnreadCount]);

  // Listen for custom events (for compatibility)
  useEffect(() => {
    const handleQuestionAnswered = () => {
      console.log("[Dashboard] Question answered event received");
      fetchStats();
    };

    const handleMessagesRead = () => {
      console.log("[Dashboard] Messages read event received");
      fetchUnreadCount();
    };

    window.addEventListener("questionAnswered", handleQuestionAnswered);
    window.addEventListener("messagesRead", handleMessagesRead);

    return () => {
      window.removeEventListener("questionAnswered", handleQuestionAnswered);
      window.removeEventListener("messagesRead", handleMessagesRead);
    };
  }, [fetchStats, fetchUnreadCount]);

  // User data with real stats
  const userData = {
    name: user ? `${user.firstName} ${user.lastName}` : tCommon("loading"),
    email: user?.email || tCommon("loading"),
    phone: user?.phoneNumber || "+994 50 123 45 67",
    location: tMyAccount("defaultLocation"),
    memberSince,
    isVerified: true,
    avatar: user?.profilePictureUrl || null,
    stats: {
      totalAds: stats?.totalAdCount || 0,
      activeAds: stats?.activeAdCount || 0,
      pendingAds: stats?.pendingAdCount || 0,
      rejectedAds: stats?.rejectedAdCount || 0,
      viewsThisMonth: stats?.totalViews || 0,
      favorites: stats?.myFavoritesCount || 0,
      unansweredQuestions: stats?.unansweredQuestions || 0,
    },
  };

  const handleLogout = async () => {
    await logoutAction();
  };

  // Show loading state while fetching user data
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Spinner size="xl" text={tCommon("loading")} centered />
      </div>
    );
  }

  const quickActions = [
    {
      id: "new-ad",
      title: tMyAccount("quickActions.newAd.title"),
      subtitle: tMyAccount("quickActions.newAd.subtitle"),
      icon: IconPlus,
      href: "/ads/ad-placement",
    },
    {
      id: "favorites",
      title: tMyAccount("quickActions.favorites.title"),
      subtitle: tMyAccount("quickActions.favorites.subtitle", {
        count: userData.stats.favorites,
      }),
      icon: IconHeart,
      href: "/ads/favorites",
    },
    {
      id: "questions",
      title: tMyAccount("menu.questions.title"),
      subtitle: tMyAccount("menu.questions.subtitle", {
        count: userData.stats.unansweredQuestions,
      }),
      icon: IconMessages,
      href: "/my-account/questions",
    },
  ];

  const menuItems: { section: string; items: MenuItem[] }[] = [
    {
      section: tMyAccount("sections.account"),
      items: [
        {
          icon: IconUser,
          title: tMyAccount("menu.profileInfo.title"),
          subtitle: tMyAccount("menu.profileInfo.subtitle"),
          href: "/my-account/profile-info",
        },
        {
          icon: IconShield,
          title: tMyAccount("menu.security.title"),
          subtitle: tMyAccount("menu.security.subtitle"),
          href: "/my-account/security",
        },
      ],
    },
    {
      section: tMyAccount("sections.myAds"),
      items: [
        {
          icon: IconLayoutGrid,
          title: tMyAccount("menu.myAds.title"),
          subtitle: tMyAccount("menu.myAds.subtitle", {
            count: userData.stats.totalAds,
          }),
          href: "/my-account/ads",
        },
        {
          icon: IconMessage,
          title: tMyAccount("menu.messages.title"),
          subtitle: tMyAccount("menu.messages.subtitle"),
          href: "/my-account/messages",
          badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
        },
        {
          icon: IconQuestionMark,
          title: tMyAccount("menu.questions.title"),
          subtitle: tMyAccount("menu.questions.subtitle", {
            count: userData.stats.unansweredQuestions,
          }),
          href: "/my-account/questions",
          badge:
            userData.stats.unansweredQuestions > 0
              ? userData.stats.unansweredQuestions
              : undefined,
        },
      ],
    },
    {
      section: tMyAccount("sections.support"),
      items: [
        {
          icon: IconHelp,
          title: tMyAccount("menu.helpCenter.title"),
          subtitle: tMyAccount("menu.helpCenter.subtitle"),
          href: "/help",
        },
        {
          icon: IconSettings,
          title: tMyAccount("menu.settings.title"),
          subtitle: tMyAccount("menu.settings.subtitle"),
          href: "/my-account/settings",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="space-y-1 sm:space-y-2">
            <Heading
              variant="page-title"
              as="h1"
              className="text-2xl sm:text-3xl lg:text-4xl"
            >
              {tMyAccount("title")}
            </Heading>
            <Text
              variant="body-lg"
              color="secondary"
              className="text-base sm:text-lg"
            >
              {tMyAccount("subtitle")}
            </Text>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
        <div className="space-y-8 sm:space-y-10 lg:space-y-12">
          {/* Profile Section */}
          <div className="space-y-6 sm:space-y-8">
            {/* User Profile Card */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="relative flex-shrink-0 mx-auto sm:mx-0">
                <Avatar
                  src={userData.avatar}
                  name={userData.name}
                  size="xl"
                  rounded="2xl"
                />
                {userData.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <IconCheck
                      size={12}
                      className="sm:w-[14px] sm:h-[14px] text-white"
                    />
                  </div>
                )}
                <IconButton
                  icon={
                    <IconCamera
                      size={12}
                      className="sm:w-[14px] sm:h-[14px] text-white"
                    />
                  }
                  variant="overlay-dark"
                  size="sm"
                  position="top-right-tight"
                  ariaLabel={tMyAccount("changeProfilePicture")}
                />
              </div>

              {/* User Info */}
              <div className="flex-1 space-y-3 sm:space-y-4 text-center sm:text-left w-full">
                <div>
                  <Heading
                    variant="subsection"
                    as="h2"
                    className="mb-1 text-xl sm:text-2xl"
                  >
                    {userData.name}
                  </Heading>
                  <Text
                    variant="body"
                    color="secondary"
                    className="mb-2 text-sm sm:text-base"
                  >
                    {userData.email}
                  </Text>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <IconMapPin size={14} className="sm:w-4 sm:h-4" />
                    <Text
                      variant="small"
                      color="tertiary"
                      className="text-xs sm:text-sm"
                    >
                      {userData.location} •{" "}
                      {tMyAccount("memberSince", {
                        date: userData.memberSince,
                      })}
                    </Text>
                  </div>
                </div>

                {/* Edit Button */}
                <TransitionLink
                  href="/my-account/profile-info"
                  className={cn(
                    "inline-flex items-center justify-center gap-2",
                    "px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl border-2 border-gray-200",
                    "hover:border-gray-400 transition-all duration-200",
                    "text-gray-900 text-sm sm:text-base",
                  )}
                >
                  <IconEdit size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <Text
                    variant="body"
                    weight="medium"
                    as="span"
                    className="text-sm sm:text-base"
                  >
                    {tMyAccount("editProfile")}
                  </Text>
                </TransitionLink>
              </div>
            </div>

            {/* Stats Grid */}
            {statsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="p-4 sm:p-6 rounded-xl border-2 border-gray-200"
                  >
                    <div className="h-6 sm:h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 sm:h-4 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
                {/* Total Ads - Clickable */}
                <TransitionLink
                  href="/my-account/ads"
                  className="p-4 sm:p-6 rounded-xl border-2 border-gray-200 text-center transition-all duration-200 hover:border-gray-300 hover:shadow-md"
                >
                  <Heading
                    variant="section"
                    className="mb-1 text-xl sm:text-2xl lg:text-3xl"
                  >
                    {userData.stats.totalAds}
                  </Heading>
                  <Text
                    variant="small"
                    color="secondary"
                    className="text-xs sm:text-sm"
                  >
                    {tMyAccount("stats.totalAds")}
                  </Text>
                </TransitionLink>

                {/* Views - Clickable (goes to ads) */}
                <TransitionLink
                  href="/my-account/ads"
                  className="p-4 sm:p-6 rounded-xl border-2 border-gray-200 text-center transition-all duration-200 hover:border-gray-300 hover:shadow-md"
                >
                  <Heading
                    variant="section"
                    className="mb-1 text-xl sm:text-2xl lg:text-3xl"
                  >
                    {userData.stats.viewsThisMonth.toLocaleString()}
                  </Heading>
                  <Text
                    variant="small"
                    color="secondary"
                    className="text-xs sm:text-sm"
                  >
                    {tMyAccount("stats.viewsThisMonth")}
                  </Text>
                </TransitionLink>

                {/* Favorites - Clickable */}
                <TransitionLink
                  href="/ads/favorites"
                  className="p-4 sm:p-6 rounded-xl border-2 border-gray-200 text-center transition-all duration-200 hover:border-gray-300 hover:shadow-md"
                >
                  <Heading
                    variant="section"
                    className="mb-1 text-xl sm:text-2xl lg:text-3xl"
                  >
                    {userData.stats.favorites}
                  </Heading>
                  <Text
                    variant="small"
                    color="secondary"
                    className="text-xs sm:text-sm"
                  >
                    {tMyAccount("stats.favorites")}
                  </Text>
                </TransitionLink>

                {/* Messages - Clickable with notification */}
                <TransitionLink
                  href="/my-account/messages"
                  className={cn(
                    "p-4 sm:p-6 rounded-xl border-2 text-center transition-all duration-200",
                    unreadMessagesCount > 0
                      ? "border-red-300 bg-red-50 hover:border-red-400 hover:shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md",
                    messageFlash && "animate-pulse ring-2 ring-red-400",
                  )}
                >
                  <div className="relative inline-block">
                    <Heading
                      variant="section"
                      className={cn(
                        "mb-1 text-xl sm:text-2xl lg:text-3xl",
                        unreadMessagesCount > 0 && "text-red-600",
                      )}
                    >
                      {unreadMessagesCount}
                    </Heading>
                    {unreadMessagesCount > 0 && (
                      <div className="absolute -top-1 -right-6 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <Text
                    variant="small"
                    color="secondary"
                    className="text-xs sm:text-sm"
                  >
                    {tMyAccount("stats.unreadMessages")}
                  </Text>
                </TransitionLink>

                {/* Unanswered Questions - Clickable with notification */}
                <TransitionLink
                  href="/my-account/questions"
                  className={cn(
                    "p-4 sm:p-6 rounded-xl border-2 text-center transition-all duration-200",
                    userData.stats.unansweredQuestions > 0
                      ? "border-red-300 bg-red-50 hover:border-red-400 hover:shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md",
                    questionFlash && "animate-pulse ring-2 ring-red-400",
                  )}
                >
                  <div className="relative inline-block">
                    <Heading
                      variant="section"
                      className={cn(
                        "mb-1 text-xl sm:text-2xl lg:text-3xl",
                        userData.stats.unansweredQuestions > 0 &&
                          "text-red-600",
                      )}
                    >
                      {userData.stats.unansweredQuestions}
                    </Heading>
                    {userData.stats.unansweredQuestions > 0 && (
                      <div className="absolute -top-1 -right-6 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <Text
                    variant="small"
                    color="secondary"
                    className="text-xs sm:text-sm"
                  >
                    {tMyAccount("stats.unansweredQuestions")}
                  </Text>
                </TransitionLink>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-4 sm:space-y-6">
            <Heading variant="card" as="h2" className="text-lg sm:text-xl">
              {tMyAccount("quickActionsTitle")}
            </Heading>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {quickActions.map((action) => (
                <TransitionLink
                  key={action.id}
                  href={action.href}
                  className={cn(
                    "p-5 sm:p-6 rounded-xl border-2 border-gray-200",
                    "hover:border-gray-400 hover:shadow-md",
                    "transition-all duration-200",
                    "flex flex-col items-center text-center gap-2 sm:gap-3",
                  )}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                    <action.icon
                      size={20}
                      className="sm:w-6 sm:h-6 text-gray-700"
                    />
                  </div>
                  <div>
                    <Text
                      variant="body"
                      weight="semibold"
                      className="mb-1 text-sm sm:text-base"
                    >
                      {action.title}
                    </Text>
                    <Text
                      variant="small"
                      color="secondary"
                      className="text-xs sm:text-sm"
                    >
                      {action.subtitle}
                    </Text>
                  </div>
                </TransitionLink>
              ))}
            </div>
          </div>

          {/* Recently Viewed Ads */}
          {/* <RecentlyViewed /> */}

          {/* Menu Sections */}
          {menuItems.map((section) => (
            <div key={section.section} className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {section.section}
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {section.items.map((item) => (
                  <AccountMenuItem
                    key={item.title}
                    icon={item.icon}
                    title={item.title}
                    subtitle={item.subtitle}
                    href={item.href}
                    premium={item.premium}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Logout */}
          <div className="pt-4 sm:pt-6">
            <button
              onClick={handleLogout}
              className={cn(
                "w-full p-4 sm:p-5 rounded-xl border-2 border-gray-200",
                "hover:border-red-200 hover:bg-red-50",
                "transition-all duration-200",
                "flex items-center justify-between gap-3 sm:gap-4",
              )}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red-100 flex items-center justify-center">
                  <IconLogout
                    size={20}
                    className="sm:w-[22px] sm:h-[22px] text-red-600"
                  />
                </div>
                <div className="text-left">
                  <span className="font-semibold text-red-600 block text-sm sm:text-base">
                    {tMyAccount("logout")}
                  </span>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {tMyAccount("logoutDescription")}
                  </p>
                </div>
              </div>
              <IconChevronRight
                size={18}
                className="sm:w-5 sm:h-5 text-red-400 flex-shrink-0"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountView;
