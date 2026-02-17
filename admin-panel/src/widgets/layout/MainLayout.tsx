import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useSidebarStore } from "@/shared/stores/sidebarStore";
import { useIsMobile } from "@/shared/hooks/useIsMobile";

const { Content } = Layout;

export function MainLayout() {
  const { isCollapsed } = useSidebarStore();
  const isMobile = useIsMobile();

  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout
        style={{
          marginLeft: isMobile ? 0 : isCollapsed ? 80 : 260,
          transition: "margin-left 0.2s ease",
        }}
      >
        <Header />
        <Content
          className={`${isMobile ? "p-3" : "p-6"} bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-64px)]`}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
