import { Layout, Button, Dropdown, Space, Switch, Select } from "antd";
import {
  LogoutOutlined,
  GlobalOutlined,
  SunOutlined,
  MoonOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "@/shared/stores/themeStore";
import { useAuthStore, getGreetingName } from "@/shared/stores/authStore";
import { useLogout } from "@/features/auth/api/authApi";
import { SUPPORTED_LOCALES, type Locale } from "@/app/i18n";
import { useSidebarStore } from "@/shared/stores/sidebarStore";
import { useIsMobile } from "@/shared/hooks/useIsMobile";
import type { MenuProps } from "antd";

const { Header: AntHeader } = Layout;

export function Header() {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const logoutMutation = useLogout();
  const { setMobileOpen } = useSidebarStore();
  const isMobile = useIsMobile();

  const greeting = getGreetingName(user);

  const handleLanguageChange = (value: Locale) => {
    i18n.changeLanguage(value);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "user-info",
      label: (
        <div className="py-2 px-1">
          <p className="font-medium text-gray-900 dark:text-white">
            {user?.firstName || user?.userName}
          </p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: t("auth.logout"),
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 z-40"
      style={{ height: 64, padding: isMobile ? "0 12px" : "0 24px" }}
    >
      {/* Left side */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {isMobile && (
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300 flex-shrink-0"
            aria-label="Open menu"
          >
            <MenuOutlined className="text-lg" />
          </button>
        )}
        <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white truncate">
          {isMobile
            ? `👋 ${greeting}`
            : t("header.greeting.admin", {
                defaultValue: `Hello, ${greeting}`,
              })}
        </h2>
      </div>

      {/* Actions */}
      <Space size={isMobile ? "small" : "middle"} className="flex-shrink-0">
        {/* Language Selector */}
        <Select
          value={i18n.language as Locale}
          onChange={handleLanguageChange}
          className={isMobile ? "w-[70px]" : "w-28"}
          suffixIcon={<GlobalOutlined className="text-gray-400" />}
          options={SUPPORTED_LOCALES.map((locale) => ({
            value: locale,
            label: locale.toUpperCase(),
          }))}
          size={isMobile ? "small" : "middle"}
        />

        {/* Theme Toggle */}
        <div
          className={`flex items-center gap-1.5 ${isMobile ? "px-2 py-1" : "px-3 py-1.5"} bg-gray-100 dark:bg-gray-700 rounded-lg`}
        >
          <SunOutlined
            className={`text-sm ${!isDark ? "text-warning-500" : "text-gray-400"}`}
          />
          <Switch
            checked={isDark}
            onChange={toggleTheme}
            size="small"
            className="mx-0.5"
          />
          <MoonOutlined
            className={`text-sm ${isDark ? "text-info-400" : "text-gray-400"}`}
          />
        </div>

        {/* User Menu */}
        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button
            type="text"
            className="flex items-center gap-2 h-10 px-2 md:px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-info-500 flex items-center justify-center">
              <UserOutlined className="text-white text-sm" />
            </div>
            <span className="hidden md:inline text-gray-700 dark:text-gray-300 font-medium max-w-[120px] truncate">
              {user?.firstName || user?.userName}
            </span>
          </Button>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}
