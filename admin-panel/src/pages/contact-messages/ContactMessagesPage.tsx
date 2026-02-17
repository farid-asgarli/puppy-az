import { useState, useMemo } from "react";
import {
  Typography,
  Button,
  Input,
  Tag,
  Drawer,
  Descriptions,
  Segmented,
  Badge,
  message,
  Space,
  Tooltip,
  Spin,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  SendOutlined,
  StarOutlined,
  StarFilled,
  InboxOutlined,
  WarningOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/shared/components/DataTable";
import { LanguageBadge } from "@/shared/components/StatusBadge";
import { usePagination } from "@/shared/hooks/useCrud";
import {
  useContactMessages,
  useContactMessage,
  useContactMessageStats,
  useReplyContactMessage,
  useToggleStar,
  useMarkAsSpam,
  useArchiveMessage,
} from "@/features/contact-messages";
import type { ContactMessage, MessageStatus } from "@/shared/api/types";
import type { Locale } from "@/app/i18n";
import dayjs from "dayjs";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

type TabFilter = "all" | "new" | "read" | "replied" | "spam" | "archived";

export default function ContactMessagesPage() {
  const { t } = useTranslation();
  const pagination = usePagination(10);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(
    null,
  );
  const [replyText, setReplyText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Build query params
  const queryParams = useMemo(() => {
    const params: Record<string, unknown> = {
      page: pagination.page,
      pageSize: pagination.pageSize,
    };
    if (search) params.search = search;
    switch (activeTab) {
      case "new":
        params.status = 0;
        break;
      case "read":
        params.status = 1;
        break;
      case "replied":
        params.status = 2;
        break;
      case "spam":
        params.isSpam = true;
        break;
      case "archived":
        params.isArchived = true;
        break;
    }
    return params;
  }, [pagination.page, pagination.pageSize, search, activeTab]);

  // Queries
  const {
    data: messagesData,
    isLoading,
    error,
    refetch,
  } = useContactMessages(queryParams);
  const { data: stats } = useContactMessageStats();
  const { data: selectedMessage, isLoading: messageLoading } =
    useContactMessage(selectedMessageId ?? 0, !!selectedMessageId);

  // Mutations
  const replyMutation = useReplyContactMessage();
  const toggleStarMutation = useToggleStar();
  const markSpamMutation = useMarkAsSpam();
  const archiveMutation = useArchiveMessage();

  const messages = messagesData?.data ?? [];
  const totalCount = messagesData?.pagination?.totalCount ?? 0;

  const getStatusColor = (status: MessageStatus) => {
    switch (status) {
      case 0:
        return "red";
      case 1:
        return "orange";
      case 2:
        return "green";
      default:
        return "default";
    }
  };

  const getStatusText = (status: MessageStatus) => {
    switch (status) {
      case 0:
        return t("contactMessages.status.new");
      case 1:
        return t("contactMessages.status.read");
      case 2:
        return t("contactMessages.status.replied");
      default:
        return "Unknown";
    }
  };

  const handleViewMessage = (msg: ContactMessage) => {
    setSelectedMessageId(msg.id);
    setDrawerOpen(true);
    setReplyText("");
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedMessageId(null);
    setReplyText("");
    // Refetch list to show updated status (New -> Read)
    refetch();
  };

  const handleSendReply = async () => {
    if (!selectedMessageId || !replyText.trim()) return;
    try {
      await replyMutation.mutateAsync({
        id: selectedMessageId,
        data: { reply: replyText.trim() },
      });
      message.success(t("contactMessages.replySuccess"));
      setReplyText("");
      refetch();
    } catch {
      message.error(t("contactMessages.replyError"));
    }
  };

  const handleToggleStar = async (msg: ContactMessage, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const isStarred = (msg as ContactMessage & { isStarred?: boolean })
        .isStarred;
      await toggleStarMutation.mutateAsync({ id: msg.id, starred: !isStarred });
    } catch {
      message.error(t("common.error"));
    }
  };

  const handleMarkSpam = async () => {
    if (!selectedMessageId) return;
    try {
      await markSpamMutation.mutateAsync(selectedMessageId);
      message.success(t("contactMessages.markedAsSpam"));
      handleCloseDrawer();
      refetch();
    } catch {
      message.error(t("common.error"));
    }
  };

  const handleArchive = async () => {
    if (!selectedMessageId) return;
    try {
      await archiveMutation.mutateAsync(selectedMessageId);
      message.success(t("contactMessages.archived"));
      handleCloseDrawer();
      refetch();
    } catch {
      message.error(t("common.error"));
    }
  };

  const columns: ColumnsType<ContactMessage> = useMemo(
    () => [
      {
        title: "",
        key: "star",
        width: 40,
        render: (_, record) => {
          const isStarred = (record as ContactMessage & { isStarred?: boolean })
            .isStarred;
          return (
            <Button
              type="text"
              size="small"
              icon={
                isStarred ? (
                  <StarFilled className="text-yellow-500" />
                ) : (
                  <StarOutlined className="text-gray-400" />
                )
              }
              onClick={(e) => handleToggleStar(record, e)}
            />
          );
        },
      },
      {
        title: t("contactMessages.table.from"),
        dataIndex: "senderName",
        key: "senderName",
        render: (name: string, record) => (
          <div>
            <span
              className={`font-medium ${record.status === 0 ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}
            >
              {name || t("common.anonymous")}
            </span>
            {record.status === 0 && (
              <Badge
                status="processing"
                className="ml-2"
                title={t("contactMessages.status.new")}
              />
            )}
          </div>
        ),
      },
      {
        title: t("contactMessages.table.phone"),
        dataIndex: "senderPhone",
        key: "senderPhone",
        width: 150,
        render: (phone: string) => phone || "-",
      },
      {
        title: t("contactMessages.table.message"),
        dataIndex: "messagePreview",
        key: "messagePreview",
        ellipsis: true,
        render: (text: string, record) => (
          <span
            className={
              record.status === 0
                ? "text-gray-900 dark:text-white font-medium"
                : "text-gray-600 dark:text-gray-400"
            }
          >
            {text && text.length > 60
              ? `${text.substring(0, 60)}...`
              : text || record.message}
          </span>
        ),
      },
      {
        title: t("contactMessages.table.language"),
        dataIndex: "languageCode",
        key: "languageCode",
        width: 80,
        render: (language: Locale) => <LanguageBadge language={language} />,
      },
      {
        title: t("common.status"),
        dataIndex: "status",
        key: "status",
        width: 100,
        render: (status: MessageStatus) => (
          <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
        ),
      },
      {
        title: t("common.createdAt"),
        dataIndex: "createdAt",
        key: "createdAt",
        width: 150,
        render: (date: string) => (
          <span className="text-gray-500">
            {dayjs(date).format("DD MMM YYYY HH:mm")}
          </span>
        ),
      },
      {
        title: t("common.actions"),
        key: "actions",
        width: 80,
        render: (_, record) => (
          <Tooltip title={t("common.view")}>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewMessage(record)}
              className="text-primary-500"
            />
          </Tooltip>
        ),
      },
    ],
    [t],
  );

  const tabOptions = [
    {
      label: (
        <span>
          {t("contactMessages.tabs.all")}
          <Badge
            count={stats?.totalMessages}
            showZero
            size="small"
            className="ml-2"
            style={{ backgroundColor: "#8c8c8c" }}
          />
        </span>
      ),
      value: "all",
    },
    {
      label: (
        <span>
          {t("contactMessages.tabs.new")}
          <Badge
            count={stats?.newMessages}
            size="small"
            className="ml-2"
            style={{ backgroundColor: "#f5222d" }}
          />
        </span>
      ),
      value: "new",
    },
    {
      label: (
        <span>
          {t("contactMessages.tabs.read")}
          <Badge
            count={stats?.readMessages}
            showZero
            size="small"
            className="ml-2"
            style={{ backgroundColor: "#fa8c16" }}
          />
        </span>
      ),
      value: "read",
    },
    {
      label: (
        <span>
          {t("contactMessages.tabs.replied")}
          <Badge
            count={stats?.repliedMessages}
            showZero
            size="small"
            className="ml-2"
            style={{ backgroundColor: "#52c41a" }}
          />
        </span>
      ),
      value: "replied",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Title level={2} className="!mb-0">
            {t("contactMessages.pageTitle")}
          </Title>
          {stats && stats.newMessages > 0 && (
            <Tag color="red" className="rounded-full px-3 py-1">
              {stats.newMessages} {t("contactMessages.newCount")}
            </Tag>
          )}
        </div>
        <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
          {t("common.refresh")}
        </Button>
      </div>

      <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0">
        <Segmented
          value={activeTab}
          onChange={(v) => {
            setActiveTab(v as TabFilter);
            pagination.onChange(1, pagination.pageSize);
          }}
          options={tabOptions}
          className="bg-gray-100 dark:bg-gray-800"
        />
      </div>

      <div className="max-w-md">
        <Input
          placeholder={t("contactMessages.searchPlaceholder")}
          prefix={<SearchOutlined className="text-gray-400" />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            pagination.onChange(1, pagination.pageSize);
          }}
          allowClear
        />
      </div>

      <DataTable<ContactMessage>
        columns={columns}
        data={messages}
        loading={isLoading}
        error={error}
        rowKey="id"
        pagination={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total: totalCount,
          onChange: pagination.onChange,
        }}
        scroll={{ x: 900 }}
        searchable={false}
        onRowClick={(record) => handleViewMessage(record)}
      />

      <Drawer
        title={t("contactMessages.drawer.title")}
        placement="right"
        width={window.innerWidth < 768 ? "100%" : 600}
        open={drawerOpen}
        onClose={handleCloseDrawer}
        extra={
          <Space>
            <Tooltip title={t("contactMessages.markAsSpam")}>
              <Button
                icon={<WarningOutlined />}
                onClick={handleMarkSpam}
                loading={markSpamMutation.isPending}
              />
            </Tooltip>
            <Tooltip title={t("contactMessages.archive")}>
              <Button
                icon={<InboxOutlined />}
                onClick={handleArchive}
                loading={archiveMutation.isPending}
              />
            </Tooltip>
          </Space>
        }
      >
        {messageLoading ? (
          <div className="flex items-center justify-center h-64">
            <Spin size="large" />
          </div>
        ) : selectedMessage ? (
          <div className="space-y-6">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label={t("contactMessages.table.from")}>
                <Text strong>
                  {selectedMessage.senderName || t("common.anonymous")}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={t("contactMessages.table.phone")}>
                {selectedMessage.senderPhone || "-"}
              </Descriptions.Item>
              <Descriptions.Item label={t("contactMessages.table.language")}>
                <LanguageBadge language={selectedMessage.languageCode} />
              </Descriptions.Item>
              <Descriptions.Item label={t("common.status")}>
                <Tag color={getStatusColor(selectedMessage.status)}>
                  {getStatusText(selectedMessage.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t("common.createdAt")}>
                {dayjs(selectedMessage.createdAt).format(
                  "DD MMM YYYY HH:mm:ss",
                )}
              </Descriptions.Item>
            </Descriptions>

            {/* Registered User Info */}
            {(selectedMessage.user || selectedMessage.matchedUserByPhone) && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    {selectedMessage.user
                      ? t("contactMessages.drawer.registeredUser")
                      : t("contactMessages.drawer.matchedUserByPhone")}
                  </span>
                  {selectedMessage.user ? (
                    <Tag color="green">
                      {t("contactMessages.drawer.loggedIn")}
                    </Tag>
                  ) : (
                    <Tag color="orange">
                      {t("contactMessages.drawer.phoneMatch")}
                    </Tag>
                  )}
                </div>
                {(() => {
                  const userInfo =
                    selectedMessage.user || selectedMessage.matchedUserByPhone;
                  return userInfo ? (
                    <Descriptions bordered column={1} size="small">
                      <Descriptions.Item label={t("users.fullName")}>
                        <Text strong>{userInfo.fullName || "-"}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label={t("users.phone")}>
                        {userInfo.phoneNumber || "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label={t("users.email")}>
                        {userInfo.email || "-"}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={t("contactMessages.drawer.totalAds")}
                      >
                        <Tag color="blue">{userInfo.totalAdsCount || 0}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={t("contactMessages.drawer.memberSince")}
                      >
                        {userInfo.createdAt
                          ? dayjs(userInfo.createdAt).format("DD MMM YYYY")
                          : "-"}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={t("contactMessages.drawer.verified")}
                      >
                        {userInfo.isVerified ? (
                          <Tag color="green">{t("common.yes")}</Tag>
                        ) : (
                          <Tag color="default">{t("common.no")}</Tag>
                        )}
                      </Descriptions.Item>
                    </Descriptions>
                  ) : null;
                })()}
              </div>
            )}

            <div>
              <Text strong className="block mb-2">
                {t("contactMessages.table.message")}
              </Text>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <Paragraph className="!mb-0 whitespace-pre-wrap">
                  {selectedMessage.message}
                </Paragraph>
              </div>
            </div>

            {selectedMessage.reply && (
              <div>
                <Text strong className="block mb-2 text-green-600">
                  {t("contactMessages.drawer.previousReply")}
                </Text>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                  <Paragraph className="!mb-0 whitespace-pre-wrap">
                    {selectedMessage.reply}
                  </Paragraph>
                  {selectedMessage.repliedAt && (
                    <Text type="secondary" className="block mt-2 text-xs">
                      {dayjs(selectedMessage.repliedAt).format(
                        "DD MMM YYYY HH:mm",
                      )}
                    </Text>
                  )}
                </div>
              </div>
            )}

            <div>
              <Text strong className="block mb-2">
                {t("contactMessages.drawer.reply")}
                <Text type="secondary" className="ml-2 font-normal text-xs">
                  ({selectedMessage.languageCode.toUpperCase()})
                </Text>
              </Text>
              <TextArea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={t("contactMessages.drawer.replyPlaceholder")}
                rows={4}
                className="mb-4"
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendReply}
                loading={replyMutation.isPending}
                disabled={!replyText.trim()}
                block
              >
                {t("contactMessages.drawer.send")}
              </Button>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}
