import {
  Typography,
  Input,
  Tag,
  Avatar,
  Card,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  TeamOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { useState, useMemo, useCallback } from "react";
import { DataTable } from "@/shared/components/DataTable";
import type { RegularUser } from "@/shared/api/types";
import { usePagination } from "@/shared/hooks/useCrud";
import { useRegularUsers } from "@/features/users";
import dayjs from "dayjs";

const { Title } = Typography;

export default function UsersPage() {
  const { t } = useTranslation();
  const pagination = usePagination(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      // Debounce the API call
      const timeoutId = setTimeout(() => {
        setDebouncedSearch(value);
        pagination.reset();
      }, 500);
      return () => clearTimeout(timeoutId);
    },
    [pagination],
  );

  // Query
  const usersQuery = useRegularUsers({
    page: pagination.page,
    pageSize: pagination.pageSize,
    search: debouncedSearch || undefined,
  });

  // Fetch all users count for stats (no search, no pagination)
  const allUsersQuery = useRegularUsers({
    page: 1,
    pageSize: 9999,
  });

  // Stats computed from all users data
  const stats = useMemo(() => {
    const allUsers = allUsersQuery.data?.items || [];
    const total = allUsers.length;
    const adminCreated = allUsers.filter((u) => u.isCreatedByAdmin).length;
    const selfRegistered = total - adminCreated;
    const active = allUsers.filter((u) => u.isActive).length;
    return { total, adminCreated, selfRegistered, active };
  }, [allUsersQuery.data]);

  const columns: ColumnsType<RegularUser> = useMemo(
    () => [
      {
        title: "",
        dataIndex: "profilePictureUrl",
        key: "avatar",
        width: 60,
        render: (url: string | undefined, record: RegularUser) => (
          <Avatar src={url} icon={!url && <UserOutlined />} size={40}>
            {!url && record.firstName?.charAt(0)}
          </Avatar>
        ),
      },
      {
        title: t("users.table.firstName"),
        dataIndex: "firstName",
        key: "firstName",
        render: (text: string, record: RegularUser) => (
          <div>
            <div className="font-medium">{text || "-"}</div>
            <div className="text-xs text-gray-500">{record.userName}</div>
          </div>
        ),
      },
      {
        title: t("users.table.lastName"),
        dataIndex: "lastName",
        key: "lastName",
      },
      {
        title: t("users.table.email"),
        dataIndex: "email",
        key: "email",
        render: (email: string) => {
          if (!email || email.includes("@placeholder.local")) {
            return <span className="text-gray-400">—</span>;
          }
          return email;
        },
      },
      {
        title: t("users.table.phone"),
        dataIndex: "phoneNumber",
        key: "phoneNumber",
      },
      {
        title: t("users.table.source"),
        key: "source",
        width: 160,
        render: (_: unknown, record: RegularUser) =>
          record.isCreatedByAdmin ? (
            <Tag icon={<UserAddOutlined />} color="orange">
              {t("users.source.admin")}
            </Tag>
          ) : (
            <Tag icon={<UserOutlined />} color="green">
              {t("users.source.self")}
            </Tag>
          ),
      },
      {
        title: t("listings.title"),
        key: "ads",
        width: 120,
        render: (_: unknown, record: RegularUser) => (
          <div className="text-center">
            <Tag color="blue">
              {record.activeAds} / {record.totalAds}
            </Tag>
          </div>
        ),
      },
      {
        title: t("common.status"),
        dataIndex: "isActive",
        key: "isActive",
        width: 100,
        render: (isActive: boolean) => (
          <Tag color={isActive ? "green" : "red"}>
            {isActive ? t("listings.status.active") : "Deaktiv"}
          </Tag>
        ),
      },
      {
        title: t("common.createdAt"),
        dataIndex: "createdAt",
        key: "createdAt",
        width: 120,
        render: (date: string) => dayjs(date).format("DD.MM.YYYY"),
      },
    ],
    [t],
  );

  return (
    <div className="space-y-6">
      <Title level={2} className="!mb-0">
        {t("users.pageTitle")}
      </Title>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card size="small" className="text-center">
            <Statistic
              title={t("users.stats.total")}
              value={stats.total}
              prefix={<TeamOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" className="text-center">
            <Statistic
              title={t("users.stats.real")}
              value={stats.selfRegistered}
              prefix={<UserOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" className="text-center">
            <Statistic
              title={t("users.stats.admin")}
              value={stats.adminCreated}
              prefix={<UserAddOutlined style={{ color: "#fa8c16" }} />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" className="text-center">
            <Statistic
              title={t("users.stats.active")}
              value={stats.active}
              prefix={<CheckCircleOutlined style={{ color: "#13c2c2" }} />}
              valueStyle={{ color: "#13c2c2" }}
            />
          </Card>
        </Col>
      </Row>

      <div className="max-w-md">
        <Input
          placeholder={t("common.search")}
          prefix={<SearchOutlined className="text-gray-400" />}
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          allowClear
        />
      </div>

      <DataTable<RegularUser>
        columns={columns}
        data={usersQuery.data?.items || []}
        loading={usersQuery.isLoading}
        error={usersQuery.error as Error | null}
        rowKey="id"
        pagination={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total: usersQuery.data?.totalCount || 0,
          onChange: pagination.onChange,
        }}
        scroll={{ x: 1000 }}
        searchable={false}
        onRefresh={() => usersQuery.refetch()}
      />
    </div>
  );
}
