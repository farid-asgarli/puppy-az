import { useState } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Typography,
  Space,
  Badge,
  Select,
  Spin,
  Table,
  Tag,
} from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  CrownOutlined,
  EyeOutlined,
  RiseOutlined,
  HeartOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  CalendarOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  TrophyOutlined,
  EnvironmentOutlined,
  TagOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useDashboardStats, useChartStats } from "@/features/dashboard";
import { StatCardSkeleton } from "@/shared/components/Skeletons";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ChartStatsRequest, UserRankingItem } from "@/shared/api/types";

const { Title, Text } = Typography;

// Animated counter component
function AnimatedNumber({ value }: { value: number }) {
  return <span>{value.toLocaleString()}</span>;
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: stats, isLoading } = useDashboardStats();

  // Chart filters
  const currentYear = new Date().getFullYear();
  const [chartParams, setChartParams] = useState<ChartStatsRequest>({
    period: "monthly",
    year: currentYear,
  });

  const { data: chartStats, isLoading: chartLoading } =
    useChartStats(chartParams);

  // Year options
  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: currentYear - i,
    label: (currentYear - i).toString(),
  }));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Title level={2} className="!mb-0 dark:text-white">
          {t("dashboard.title")}
        </Title>
        <Row gutter={[24, 24]}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <StatCardSkeleton />
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  // Main stat cards
  const mainStatCards = [
    {
      title: t("dashboard.totalListings"),
      value: stats?.totalListings || 0,
      icon: <FileTextOutlined />,
      gradient: "from-blue-500 to-blue-600",
      bgGradient:
        "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      onClick: () => navigate("/listings"),
    },
    {
      title: t("dashboard.totalUsers"),
      value: stats?.totalUsers || 0,
      icon: <TeamOutlined />,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient:
        "from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20",
      onClick: () => navigate("/users"),
    },
    {
      title: t("dashboard.pendingApproval"),
      value: stats?.pendingApprovals || 0,
      icon: <ClockCircleOutlined />,
      gradient: "from-amber-500 to-orange-500",
      bgGradient:
        "from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-800/20",
      onClick: () => navigate("/listings?status=pending"),
      badge:
        stats?.pendingApprovals && stats.pendingApprovals > 0 ? true : false,
    },
    {
      title: t("dashboard.newMessages"),
      value: stats?.newMessages || 0,
      icon: <MessageOutlined />,
      gradient: "from-purple-500 to-purple-600",
      bgGradient:
        "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
    },
  ];

  // Secondary stat cards
  const secondaryStatCards = [
    {
      title: t("dashboard.premiumListings"),
      value: stats?.premiumListings || 0,
      icon: <CrownOutlined />,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      title: t("dashboard.totalViews"),
      value: stats?.totalViews || 0,
      icon: <EyeOutlined />,
      color: "text-cyan-500",
      bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
    },
    {
      title: t("dashboard.todayListings"),
      value: stats?.todayListings || 0,
      icon: <RiseOutlined />,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: t("dashboard.todayUsers"),
      value: stats?.todayUsers || 0,
      icon: <UserOutlined />,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      title: t("dashboard.totalQuestions"),
      value: stats?.totalQuestions || 0,
      icon: <QuestionCircleOutlined />,
      color: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
    },
    {
      title: t("dashboard.totalFavorites"),
      value: stats?.totalFavorites || 0,
      icon: <HeartOutlined />,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
  ];

  // Listing status data for progress
  const total = stats?.totalListings || 1;
  const activePercent = Math.round(
    ((stats?.activeListings || 0) / total) * 100,
  );
  const pendingPercent = Math.round(
    ((stats?.pendingApprovals || 0) / total) * 100,
  );
  const rejectedPercent = Math.round(
    ((stats?.rejectedListings || 0) / total) * 100,
  );

  // User rankings columns
  const userRankingColumns = [
    {
      title: "#",
      dataIndex: "rank",
      key: "rank",
      width: 50,
      render: (_: unknown, __: unknown, index: number) => (
        <span className="font-semibold">{index + 1}</span>
      ),
    },
    {
      title: t("dashboard.charts.user"),
      dataIndex: "fullName",
      key: "fullName",
      render: (fullName: string, record: UserRankingItem) => (
        <div>
          <div className="font-medium">{fullName}</div>
          <div className="text-xs text-gray-500">{record.phone}</div>
        </div>
      ),
    },
    {
      title: t("dashboard.charts.listings"),
      dataIndex: "listingsCount",
      key: "listingsCount",
      render: (count: number) => <Tag color="blue">{count}</Tag>,
    },
    {
      title: t("dashboard.charts.views"),
      dataIndex: "totalViews",
      key: "totalViews",
      render: (views: number) => (
        <span className="text-cyan-600">{views.toLocaleString()}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Title level={2} className="!mb-0 dark:text-white">
          {t("dashboard.title")}
        </Title>
        <Space>
          <Badge status="processing" />
          <Text type="secondary" className="text-sm">
            <CalendarOutlined className="mr-1" />
            {new Date().toLocaleDateString()}
          </Text>
        </Space>
      </div>

      {/* Main Stats */}
      <Row gutter={[24, 24]}>
        {mainStatCards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              className={`card cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${card.bgGradient} border-0`}
              onClick={card.onClick}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Text className="text-sm text-gray-600 dark:text-gray-300 block mb-2">
                    {card.title}
                  </Text>
                  <div className="flex items-center gap-2">
                    <Statistic
                      value={card.value}
                      valueStyle={{
                        fontSize: "2rem",
                        fontWeight: 700,
                        lineHeight: 1,
                      }}
                    />
                    {card.badge && (
                      <Badge
                        count={card.value}
                        style={{ backgroundColor: "#faad14" }}
                        overflowCount={999}
                      />
                    )}
                  </div>
                </div>
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg`}
                >
                  {card.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Secondary Stats Grid */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <ThunderboltOutlined className="text-yellow-500" />
                <span>{t("dashboard.quickStats")}</span>
              </Space>
            }
            className="card h-full"
          >
            <Row gutter={[16, 16]}>
              {secondaryStatCards.map((card, index) => (
                <Col xs={12} sm={8} key={index}>
                  <div
                    className={`${card.bgColor} rounded-xl p-4 text-center transition-transform hover:scale-105`}
                  >
                    <div className={`${card.color} text-2xl mb-2`}>
                      {card.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                      <AnimatedNumber value={card.value} />
                    </div>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      {card.title}
                    </Text>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* Listing Status Overview */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <FileTextOutlined className="text-blue-500" />
                <span>{t("dashboard.listingStatus")}</span>
              </Space>
            }
            className="card h-full"
          >
            <div className="space-y-6">
              {/* Active */}
              <div>
                <div className="flex justify-between mb-2">
                  <Space>
                    <CheckCircleOutlined className="text-green-500" />
                    <Text>{t("dashboard.activeListings")}</Text>
                  </Space>
                  <Text strong>{stats?.activeListings || 0}</Text>
                </div>
                <Progress
                  percent={activePercent}
                  strokeColor={{ from: "#52c41a", to: "#73d13d" }}
                  showInfo={false}
                />
              </div>

              {/* Pending */}
              <div>
                <div className="flex justify-between mb-2">
                  <Space>
                    <ClockCircleOutlined className="text-amber-500" />
                    <Text>{t("dashboard.pendingApproval")}</Text>
                  </Space>
                  <Text strong>{stats?.pendingApprovals || 0}</Text>
                </div>
                <Progress
                  percent={pendingPercent}
                  strokeColor={{ from: "#faad14", to: "#ffc53d" }}
                  showInfo={false}
                />
              </div>

              {/* Rejected */}
              <div>
                <div className="flex justify-between mb-2">
                  <Space>
                    <CloseCircleOutlined className="text-red-500" />
                    <Text>{t("dashboard.rejectedListings")}</Text>
                  </Space>
                  <Text strong>{stats?.rejectedListings || 0}</Text>
                </div>
                <Progress
                  percent={rejectedPercent}
                  strokeColor={{ from: "#ff4d4f", to: "#ff7875" }}
                  showInfo={false}
                />
              </div>

              {/* Expired */}
              <div>
                <div className="flex justify-between mb-2">
                  <Space>
                    <WarningOutlined className="text-gray-500" />
                    <Text>{t("dashboard.expiredListings")}</Text>
                  </Space>
                  <Text strong>{stats?.expiredListings || 0}</Text>
                </div>
                <Progress
                  percent={Math.round(
                    ((stats?.expiredListings || 0) / total) * 100,
                  )}
                  strokeColor={{ from: "#8c8c8c", to: "#bfbfbf" }}
                  showInfo={false}
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-8">
        <Title level={3} className="!mb-0 dark:text-white">
          <BarChartOutlined className="mr-2" />
          {t("dashboard.charts.title")}
        </Title>
        <Space>
          <Select
            value={chartParams.period}
            onChange={(value) =>
              setChartParams((prev) => ({ ...prev, period: value }))
            }
            options={[
              { value: "monthly", label: t("dashboard.charts.monthly") },
              { value: "yearly", label: t("dashboard.charts.yearly") },
            ]}
            style={{ width: 120 }}
          />
          <Select
            value={chartParams.year}
            onChange={(value) =>
              setChartParams((prev) => ({ ...prev, year: value }))
            }
            options={yearOptions}
            style={{ width: 100 }}
          />
        </Space>
      </div>

      {chartLoading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Trend Charts */}
          <Row gutter={[24, 24]}>
            {/* Listings Trend */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <LineChartOutlined className="text-blue-500" />
                    <span>{t("dashboard.charts.listingsTrend")}</span>
                  </Space>
                }
                className="card"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartStats?.listingsTrend || []}>
                    <defs>
                      <linearGradient
                        id="listingsGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#1890ff"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#1890ff"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <RechartsTooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#1890ff"
                      fill="url(#listingsGradient)"
                      strokeWidth={2}
                      name={t("dashboard.charts.listings")}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            {/* Users Trend */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <LineChartOutlined className="text-emerald-500" />
                    <span>{t("dashboard.charts.usersTrend")}</span>
                  </Space>
                }
                className="card"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartStats?.usersTrend || []}>
                    <defs>
                      <linearGradient
                        id="usersGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#52c41a"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#52c41a"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <RechartsTooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#52c41a"
                      fill="url(#usersGradient)"
                      strokeWidth={2}
                      name={t("dashboard.charts.users")}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          {/* Distribution Charts */}
          <Row gutter={[24, 24]}>
            {/* Listing Type Distribution */}
            <Col xs={24} lg={8}>
              <Card
                title={
                  <Space>
                    <PieChartOutlined className="text-purple-500" />
                    <span>{t("dashboard.charts.listingTypeDistribution")}</span>
                  </Space>
                }
                className="card"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartStats?.listingTypeDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="count"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {(chartStats?.listingTypeDistribution || []).map(
                        (entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ),
                      )}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            {/* Gender Distribution */}
            <Col xs={24} lg={8}>
              <Card
                title={
                  <Space>
                    <PieChartOutlined className="text-pink-500" />
                    <span>{t("dashboard.charts.genderDistribution")}</span>
                  </Space>
                }
                className="card"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartStats?.genderDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="count"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {(chartStats?.genderDistribution || []).map(
                        (entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ),
                      )}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            {/* Status Distribution */}
            <Col xs={24} lg={8}>
              <Card
                title={
                  <Space>
                    <PieChartOutlined className="text-orange-500" />
                    <span>{t("dashboard.charts.statusDistribution")}</span>
                  </Space>
                }
                className="card"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartStats?.statusDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="count"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {(chartStats?.statusDistribution || []).map(
                        (entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ),
                      )}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          {/* Rankings Charts */}
          <Row gutter={[24, 24]}>
            {/* Top Categories */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <TagOutlined className="text-blue-500" />
                    <span>{t("dashboard.charts.topCategories")}</span>
                  </Space>
                }
                className="card"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartStats?.topCategories || []}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      width={100}
                    />
                    <RechartsTooltip />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {(chartStats?.topCategories || []).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color || "#1890ff"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            {/* Top Breeds */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <ShoppingOutlined className="text-green-500" />
                    <span>{t("dashboard.charts.topBreeds")}</span>
                  </Space>
                }
                className="card"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartStats?.topBreeds || []}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      width={100}
                    />
                    <RechartsTooltip />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {(chartStats?.topBreeds || []).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color || "#52c41a"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          {/* More Rankings */}
          <Row gutter={[24, 24]}>
            {/* Top Cities */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <EnvironmentOutlined className="text-red-500" />
                    <span>{t("dashboard.charts.topCities")}</span>
                  </Space>
                }
                className="card"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartStats?.topCities || []}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      width={100}
                    />
                    <RechartsTooltip />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {(chartStats?.topCities || []).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color || "#f5222d"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            {/* Listings by Day of Week */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <CalendarOutlined className="text-purple-500" />
                    <span>{t("dashboard.charts.listingsByDayOfWeek")}</span>
                  </Space>
                }
                className="card"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartStats?.listingsByDayOfWeek || []}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <RechartsTooltip />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {(chartStats?.listingsByDayOfWeek || []).map(
                        (entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ),
                      )}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          {/* Bottom Rankings */}
          <Row gutter={[24, 24]}>
            {/* Bottom Categories */}
            <Col xs={24} lg={8}>
              <Card
                title={
                  <Space>
                    <TagOutlined className="text-gray-500" />
                    <span>{t("dashboard.charts.bottomCategories")}</span>
                  </Space>
                }
                className="card"
                size="small"
              >
                <div className="space-y-2">
                  {(chartStats?.bottomCategories || []).map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded"
                    >
                      <span className="text-sm">{item.name}</span>
                      <Tag color="default">{item.count}</Tag>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

            {/* Bottom Breeds */}
            <Col xs={24} lg={8}>
              <Card
                title={
                  <Space>
                    <ShoppingOutlined className="text-gray-500" />
                    <span>{t("dashboard.charts.bottomBreeds")}</span>
                  </Space>
                }
                className="card"
                size="small"
              >
                <div className="space-y-2">
                  {(chartStats?.bottomBreeds || []).map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded"
                    >
                      <span className="text-sm">{item.name}</span>
                      <Tag color="default">{item.count}</Tag>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

            {/* Bottom Cities */}
            <Col xs={24} lg={8}>
              <Card
                title={
                  <Space>
                    <EnvironmentOutlined className="text-gray-500" />
                    <span>{t("dashboard.charts.bottomCities")}</span>
                  </Space>
                }
                className="card"
                size="small"
              >
                <div className="space-y-2">
                  {(chartStats?.bottomCities || []).map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded"
                    >
                      <span className="text-sm">{item.name}</span>
                      <Tag color="default">{item.count}</Tag>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>

          {/* Size & Membership Distribution */}
          <Row gutter={[24, 24]}>
            {/* Size Distribution */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <BarChartOutlined className="text-cyan-500" />
                    <span>{t("dashboard.charts.sizeDistribution")}</span>
                  </Space>
                }
                className="card"
              >
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartStats?.sizeDistribution || []}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <RechartsTooltip />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {(chartStats?.sizeDistribution || []).map(
                        (entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ),
                      )}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            {/* Membership Distribution */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <CrownOutlined className="text-yellow-500" />
                    <span>{t("dashboard.charts.membershipDistribution")}</span>
                  </Space>
                }
                className="card"
              >
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={chartStats?.membershipDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      dataKey="count"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {(chartStats?.membershipDistribution || []).map(
                        (entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ),
                      )}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          {/* Top Users */}
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <Card
                title={
                  <Space>
                    <TrophyOutlined className="text-yellow-500" />
                    <span>{t("dashboard.charts.topUsers")}</span>
                  </Space>
                }
                className="card"
              >
                <Table
                  dataSource={chartStats?.topUsers || []}
                  columns={userRankingColumns}
                  pagination={false}
                  rowKey="userId"
                  size="small"
                  scroll={{ x: 600 }}
                />
              </Card>
            </Col>
          </Row>

          {/* Views Trend & Average Price */}
          <Row gutter={[24, 24]}>
            {/* Views Trend */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <EyeOutlined className="text-cyan-500" />
                    <span>{t("dashboard.charts.viewsTrend")}</span>
                  </Space>
                }
                className="card"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartStats?.viewsTrend || []}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <RechartsTooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#13c2c2"
                      strokeWidth={2}
                      dot={{ fill: "#13c2c2", strokeWidth: 2 }}
                      name={t("dashboard.charts.views")}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            {/* Average Price by Category */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <ShoppingOutlined className="text-green-500" />
                    <span>{t("dashboard.charts.averagePriceByCategory")}</span>
                  </Space>
                }
                className="card"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartStats?.averagePriceByCategory || []}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `₼${value}`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      width={100}
                    />
                    <RechartsTooltip
                      formatter={(value) => [`₼${value ?? 0}`, "Ort. Qiymət"]}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="#52c41a" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
