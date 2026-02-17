import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Badge, Tooltip, Drawer } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ApartmentOutlined,
  BgColorsOutlined,
  TagOutlined,
  AppstoreOutlined,
  GoldOutlined,
  BulbOutlined,
  MessageOutlined,
  FileImageOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CloseOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useSidebarStore } from "@/shared/stores/sidebarStore";
import {
  usePendingListingsCount,
  useNewMessagesCount,
} from "@/features/dashboard/api/dashboardApi";
import { useIsMobile } from "@/shared/hooks/useIsMobile";
import type { MenuProps } from "antd";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

export function Sidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isCollapsed, toggleSidebar, isMobileOpen, closeMobile } =
    useSidebarStore();
  const isMobile = useIsMobile();

  // Get badge counts
  const { data: pendingCount = 0 } = usePendingListingsCount();
  const { data: newMessagesCount = 0 } = useNewMessagesCount();

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        key: "/dashboard",
        icon: <DashboardOutlined />,
        label: t("nav.dashboard"),
      },
      {
        key: "/create-ad",
        icon: <PlusCircleOutlined />,
        label: t("nav.createAd"),
        className: "sidebar-item-create-ad",
      },
      {
        key: "/listings",
        icon: (
          <span className={pendingCount > 0 ? "text-error-500" : ""}>
            <FileTextOutlined />
          </span>
        ),
        label: (
          <span
            className={pendingCount > 0 ? "text-error-500 font-medium" : ""}
          >
            {t("nav.listings")}
          </span>
        ),
        className: pendingCount > 0 ? "sidebar-item-danger" : "",
      },
      {
        key: "/users",
        icon: <UserOutlined />,
        label: t("nav.users"),
      },
      {
        key: "/cities",
        icon: <EnvironmentOutlined />,
        label: t("nav.cities"),
      },
      {
        key: "/districts",
        icon: <ApartmentOutlined />,
        label: t("nav.districts"),
      },
      {
        key: "/colors",
        icon: <BgColorsOutlined />,
        label: t("nav.colors"),
      },
      {
        key: "/listing-types",
        icon: <TagOutlined />,
        label: t("nav.listingTypes"),
      },
      {
        key: "/categories",
        icon: <AppstoreOutlined />,
        label: t("nav.categories"),
      },
      {
        key: "/breeds",
        icon: <GoldOutlined />,
        label: t("nav.breeds"),
      },
      {
        key: "/breed-suggestions",
        icon: <BulbOutlined />,
        label: t("nav.breedSuggestions"),
      },
      {
        key: "/contact-messages",
        icon: (
          <span className={newMessagesCount > 0 ? "text-error-500" : ""}>
            <MessageOutlined />
          </span>
        ),
        label: (
          <span
            className={newMessagesCount > 0 ? "text-error-500 font-medium" : ""}
          >
            {t("nav.contactMessages")}
          </span>
        ),
        className: newMessagesCount > 0 ? "sidebar-item-danger" : "",
      },
      {
        key: "/static-sections",
        icon: <FileImageOutlined />,
        label: t("nav.staticSections"),
      },
    ],
    [t, pendingCount, newMessagesCount],
  );

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    navigate(key);
    if (isMobile) {
      closeMobile();
    }
  };

  // Get currently selected key from path
  const selectedKey = useMemo(() => {
    const path = location.pathname;
    const matchingItem = menuItems.find(
      (item) => item && "key" in item && path.startsWith(item.key as string),
    );
    return matchingItem && "key" in matchingItem
      ? [matchingItem.key as string]
      : ["/dashboard"];
  }, [location.pathname, menuItems]);

  const sidebarContent = (
    <>
      {/* Logo / Brand */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-info-500 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">🐕</span>
          </div>
          {(!isCollapsed || isMobile) && (
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-none">
                puppy.az
              </h1>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Admin
              </span>
            </div>
          )}
        </div>

        {isMobile ? (
          <button
            onClick={closeMobile}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
            aria-label="Close sidebar"
          >
            <CloseOutlined />
          </button>
        ) : (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <Menu
        mode="inline"
        selectedKeys={selectedKey}
        onClick={handleMenuClick}
        items={menuItems.map((item) => {
          if (!item || !("key" in item) || !("label" in item)) return item;

          const menuItem = item as {
            key: string;
            label: React.ReactNode;
            icon?: React.ReactNode;
            danger?: boolean;
          };
          const key = menuItem.key;
          const isPendingListing = key === "/listings" && pendingCount > 0;
          const isNewMessages =
            key === "/contact-messages" && newMessagesCount > 0;
          const hasBadge = isPendingListing || isNewMessages;
          const badgeCount = isPendingListing
            ? pendingCount
            : isNewMessages
              ? newMessagesCount
              : 0;

          if (isCollapsed && !isMobile && hasBadge) {
            return {
              ...menuItem,
              label: (
                <Tooltip title={menuItem.label} placement="right">
                  <Badge count={badgeCount} size="small" offset={[8, 0]}>
                    <span>{menuItem.label}</span>
                  </Badge>
                </Tooltip>
              ),
            };
          }

          if (hasBadge) {
            return {
              ...menuItem,
              label: (
                <div className="flex items-center justify-between w-full">
                  <span>{menuItem.label}</span>
                  <Badge
                    count={badgeCount}
                    size="small"
                    style={{
                      backgroundColor: "#ef4444",
                      marginLeft: 8,
                    }}
                  />
                </div>
              ),
            };
          }

          return item;
        })}
        className="border-none mt-4 px-2"
        style={{
          background: "transparent",
        }}
      />

      {/* Footer */}
      {(!isCollapsed || isMobile) && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            © {new Date().getFullYear()} puppy.az
          </p>
        </div>
      )}
    </>
  );

  // Mobile: use Drawer overlay
  if (isMobile) {
    return (
      <Drawer
        placement="left"
        open={isMobileOpen}
        onClose={closeMobile}
        width={280}
        styles={{
          body: { padding: 0 },
          header: { display: "none" },
        }}
        className="sidebar-drawer"
      >
        <div className="h-full bg-white dark:bg-gray-800 relative">
          {sidebarContent}
        </div>
      </Drawer>
    );
  }

  // Desktop: use fixed Sider
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={isCollapsed}
      width={260}
      collapsedWidth={80}
      className="fixed left-0 top-0 bottom-0 z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm"
      style={{
        overflow: "auto",
        height: "100vh",
      }}
    >
      {sidebarContent}
    </Sider>
  );
}
