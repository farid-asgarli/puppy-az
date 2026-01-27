"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  IconUser,
  IconHeart,
  IconPlus,
  IconLayoutGrid,
  IconSettings,
  IconBell,
  IconShield,
  IconLogout,
  IconChevronRight,
  IconCrown,
  IconEdit,
  IconCamera,
  IconCheck,
  IconTrendingUp,
  IconMapPin,
  IconHelp,
  IconMessages,
} from "@tabler/icons-react";
import { cn } from "@/lib/external/utils";
import { Heading, Text } from "@/lib/primitives/typography";
import { useAuth } from "@/lib/hooks/use-auth";
import { logoutAction, getDashboardStatsAction } from "@/lib/auth/actions";
import type { UserDashboardStatsDto } from "@/lib/api/types/auth.types";
import { Spinner } from "@/lib/primitives/spinner";
import { IconButton } from "@/lib/primitives/icon-button";
import TransitionLink from "@/lib/components/transition-link";
import { formatMonthYear } from "@/lib/utils/date-utils";
import { AccountMenuItem } from "@/lib/components/views/my-account/menu-item/account-menu-item.component";
import type { Icon } from "@tabler/icons-react";

interface MenuItem {
  icon: Icon;
  title: string;
  subtitle: string;
  href: string;
  premium?: boolean;
  badge?: number;
}

const MyAccountView = () => {
  const { user, loading } = useAuth();
  const tMyAccount = useTranslations("myAccount");
  const tCommon = useTranslations("common");
  const tDate = useTranslations("dateTime");

  const [stats, setStats] = useState<UserDashboardStatsDto | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Format date with proper Azerbaijani month names
  const memberSince = React.useMemo(() => {
    if (!user?.createdAt) return tCommon("loading");
    return formatMonthYear(user.createdAt, tDate);
  }, [user?.createdAt, tCommon, tDate]);

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      const result = await getDashboardStatsAction();
      if (result.success) {
        setStats(result.data);
      }

      setStatsLoading(false);
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

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
      favorites: stats?.totalFavoriteCount || 0,
      unansweredQuestions: stats?.unansweredQuestionCount || 0,
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
          icon: IconMessages,
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
      section: tMyAccount("sections.premium"),
      items: [
        {
          icon: IconCrown,
          title: tMyAccount("menu.premiumServices.title"),
          subtitle: tMyAccount("menu.premiumServices.subtitle"),
          href: "/premium",
          premium: true,
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
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
                  {userData.avatar ? (
                    <img
                      src={userData.avatar}
                      alt={userData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <IconUser
                      size={32}
                      className="sm:w-9 sm:h-9 text-gray-400"
                    />
                  )}
                </div>
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
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {[1, 2, 3].map((i) => (
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
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="p-4 sm:p-6 rounded-xl border-2 border-gray-200 text-center">
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
                </div>
                <div className="p-4 sm:p-6 rounded-xl border-2 border-gray-200 text-center">
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
                </div>
                <div className="p-4 sm:p-6 rounded-xl border-2 border-gray-200 text-center">
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
                </div>
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
