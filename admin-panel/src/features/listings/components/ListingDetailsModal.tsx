import { useState } from "react";
import {
  Modal,
  Image,
  Button,
  Alert,
  Input,
  Tag,
  Row,
  Col,
  Typography,
  Tooltip,
  Descriptions,
  Divider,
  InputNumber,
  Select,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  HeartOutlined,
  UserOutlined,
  CopyOutlined,
  QuestionCircleOutlined,
  CrownOutlined,
  StarOutlined,
  SwapOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import {
  StatusBadge,
  MembershipBadge,
  LanguageBadge,
} from "@/shared/components/StatusBadge";
import {
  useReviewListing,
  useSetPremium,
  useSetVip,
  useSetListingStatus,
  useAssignBreedToListing,
  useAssignDistrictToListing,
} from "../api/listingsApi";
import type { Listing } from "@/shared/api/types";
import {
  ListingStatus,
  ListingType,
  Gender,
  AnimalSize,
} from "@/shared/api/types";
import dayjs from "dayjs";
import { BreedModal } from "@/features/breeds/components/BreedModal";
import { DistrictModal } from "@/features/districts/components/DistrictModal";

const { Title, Text, Paragraph } = Typography;

interface ListingDetailsModalProps {
  open: boolean;
  listing: Listing | null;
  onClose: () => void;
}

export function ListingDetailsModal({
  open,
  listing: listingProp,
  onClose,
}: ListingDetailsModalProps) {
  const { t } = useTranslation();
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [premiumDays, setPremiumDays] = useState<number>(30);
  const [vipDays, setVipDays] = useState<number>(30);
  const [selectedStatus, setSelectedStatus] = useState<ListingStatus | null>(
    null,
  );
  const reviewMutation = useReviewListing();
  const premiumMutation = useSetPremium();
  const vipMutation = useSetVip();
  const statusMutation = useSetListingStatus();
  const assignBreedMutation = useAssignBreedToListing();
  const assignDistrictMutation = useAssignDistrictToListing();
  const [showBreedModal, setShowBreedModal] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);

  const listing = listingProp;

  if (!listing) return null;

  const isPending = listing.status === ListingStatus.Pending;

  const handleApprove = () => {
    reviewMutation.mutate(
      { id: listing.id, data: { approve: true } },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    reviewMutation.mutate(
      {
        id: listing.id,
        data: {
          approve: false,
          rejectionReason: rejectReason,
        },
      },
      {
        onSuccess: () => {
          setShowRejectInput(false);
          setRejectReason("");
          onClose();
        },
      },
    );
  };

  const handleSetPremium = () => {
    premiumMutation.mutate({
      id: listing.id,
      data: { isPremium: true, durationInDays: premiumDays },
    });
  };

  const handleRemovePremium = () => {
    premiumMutation.mutate({
      id: listing.id,
      data: { isPremium: false },
    });
  };

  const handleSetVip = () => {
    vipMutation.mutate({
      id: listing.id,
      data: { isVip: true, durationInDays: vipDays },
    });
  };

  const handleRemoveVip = () => {
    vipMutation.mutate({
      id: listing.id,
      data: { isVip: false },
    });
  };

  const handleStatusChange = () => {
    if (selectedStatus !== null && selectedStatus !== listing.status) {
      statusMutation.mutate(
        { id: listing.id, status: selectedStatus },
        {
          onSuccess: () => {
            setSelectedStatus(null);
          },
        },
      );
    }
  };

  const handleBreedCreated = (breedId: number) => {
    assignBreedMutation.mutate(
      { petAdId: listing.id, petBreedId: breedId },
      { onSuccess: () => onClose() },
    );
    setShowBreedModal(false);
  };

  const handleDistrictCreated = (districtId: number) => {
    assignDistrictMutation.mutate(
      { petAdId: listing.id, districtId },
      { onSuccess: () => onClose() },
    );
    setShowDistrictModal(false);
  };

  const getStatusBannerConfig = () => {
    switch (listing.status) {
      case ListingStatus.Pending:
        return {
          type: "warning" as const,
          message: t("listings.modal.statusBanner.pending"),
        };
      case ListingStatus.Published:
        return {
          type: "success" as const,
          message: t("listings.modal.statusBanner.active"),
        };
      case ListingStatus.Rejected:
        return {
          type: "error" as const,
          message: t("listings.modal.statusBanner.rejected"),
        };
      case ListingStatus.Expired:
        return {
          type: "info" as const,
          message: t("listings.modal.statusBanner.expired"),
        };
      default:
        return null;
    }
  };

  const statusBanner = getStatusBannerConfig();

  const getListingTypeConfig = (type: ListingType) => {
    const configs: Record<
      ListingType,
      { label: string; color: string; icon: string }
    > = {
      [ListingType.Sale]: {
        label: t("listings.type.sale"),
        color: "green",
        icon: "💰",
      },
      [ListingType.Match]: {
        label: t("listings.type.match"),
        color: "magenta",
        icon: "💕",
      },
      [ListingType.Found]: {
        label: t("listings.type.found"),
        color: "blue",
        icon: "🔍",
      },
      [ListingType.Lost]: {
        label: t("listings.type.lost"),
        color: "orange",
        icon: "😢",
      },
      [ListingType.Owning]: {
        label: t("listings.type.owning"),
        color: "purple",
        icon: "🏠",
      },
    };
    return configs[type];
  };

  const getGenderLabel = (gender?: Gender) => {
    if (!gender) return null;
    return gender === Gender.Male
      ? t("listings.gender.male")
      : t("listings.gender.female");
  };

  const getSizeLabel = (size?: AnimalSize) => {
    if (!size) return null;
    const labels: Record<AnimalSize, string> = {
      [AnimalSize.ExtraSmall]: t("listings.size.extraSmall"),
      [AnimalSize.Small]: t("listings.size.small"),
      [AnimalSize.Medium]: t("listings.size.medium"),
      [AnimalSize.Large]: t("listings.size.large"),
      [AnimalSize.ExtraLarge]: t("listings.size.extraLarge"),
    };
    return labels[size];
  };

  const listingTypeConfig = getListingTypeConfig(listing.adType);

  // Get all images
  const allImages = listing.images?.length
    ? (listing.images
        .map((img) => img.url || img.imageUrl)
        .filter(Boolean) as string[])
    : listing.primaryImageUrl
      ? [listing.primaryImageUrl]
      : [];

  const mainImage = allImages[selectedImageIndex] || allImages[0];

  return (
    <Modal
      open={open}
      title={null}
      onCancel={onClose}
      width={"95vw"}
      style={{ maxWidth: 900 }}
      footer={null}
      destroyOnHidden
      styles={{ body: { padding: 0 } }}
      centered
    >
      {/* Status Banner */}
      {statusBanner && (
        <Alert
          type={statusBanner.type}
          message={statusBanner.message}
          showIcon
          className="rounded-none border-x-0 border-t-0"
        />
      )}

      <div className="p-5">
        {/* Header with Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Tag
            color={listingTypeConfig.color}
            className="m-0 px-3 py-1 text-sm font-medium"
          >
            {listingTypeConfig.icon} {listingTypeConfig.label}
          </Tag>
          {listing.status !== undefined && (
            <StatusBadge status={listing.status} />
          )}
          <MembershipBadge
            type={
              listing.isPremium ? "premium" : listing.isVip ? "vip" : "standard"
            }
          />
          {listing.language && <LanguageBadge language={listing.language} />}
        </div>

        {/* Title & Price */}
        <div className="flex items-start justify-between mb-4">
          <Title level={3} className="!mb-0 !leading-tight flex-1">
            {listing.title}
          </Title>
          {listing.price != null && listing.price > 0 && (
            <div className="text-2xl font-bold text-emerald-600 ml-4">
              {listing.price.toLocaleString()} ₼
            </div>
          )}
        </div>

        {/* Admin Controls - Premium, VIP & Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {/* Status Management */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-200 dark:border-blue-700 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <SwapOutlined className="text-white text-lg" />
              </div>
              <div>
                <div className="font-semibold text-blue-800 dark:text-blue-200">
                  {t("listings.modal.changeStatus")}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  {t("listings.modal.currentStatus")}:{" "}
                  {listing.status && <StatusBadge status={listing.status} />}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={selectedStatus ?? listing.status}
                onChange={(value) => setSelectedStatus(value)}
                style={{ flex: 1 }}
                size="small"
                options={[
                  {
                    value: ListingStatus.Pending,
                    label: t("listings.status.pending"),
                  },
                  {
                    value: ListingStatus.Published,
                    label: t("listings.status.active"),
                  },
                  {
                    value: ListingStatus.Rejected,
                    label: t("listings.status.rejected"),
                  },
                  {
                    value: ListingStatus.Expired,
                    label: t("listings.status.expired"),
                  },
                  {
                    value: ListingStatus.Closed,
                    label: t("listings.status.closed"),
                  },
                ]}
              />
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={handleStatusChange}
                loading={statusMutation.isPending}
                disabled={
                  selectedStatus === null || selectedStatus === listing.status
                }
                size="small"
                className="bg-blue-600 hover:!bg-blue-700"
              >
                {t("common.apply")}
              </Button>
            </div>
          </div>

          {/* Premium Management */}
          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl border border-amber-200 dark:border-amber-700 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                <CrownOutlined className="text-white text-lg" />
              </div>
              <div>
                <div className="font-semibold text-amber-800 dark:text-amber-200">
                  {t("listings.modal.premiumManagement")}
                </div>
                <div className="text-xs text-amber-600 dark:text-amber-400">
                  {listing.isPremium ? (
                    <>
                      ✓ {t("listings.modal.premiumActive")}
                      {listing.premiumExpiresAt && (
                        <>
                          {" "}
                          •{" "}
                          {dayjs(listing.premiumExpiresAt).format(
                            "DD MMM YYYY",
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    t("listings.membership.standard")
                  )}
                </div>
              </div>
            </div>
            {listing.isPremium ? (
              <Button
                danger
                block
                size="small"
                onClick={handleRemovePremium}
                loading={premiumMutation.isPending}
              >
                {t("listings.modal.removePremium")}
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <InputNumber
                  min={1}
                  max={365}
                  value={premiumDays}
                  onChange={(value) => setPremiumDays(value || 30)}
                  addonAfter={t("listings.modal.days")}
                  style={{ flex: 1 }}
                  size="small"
                />
                <Button
                  type="primary"
                  icon={<CrownOutlined />}
                  onClick={handleSetPremium}
                  loading={premiumMutation.isPending}
                  size="small"
                  className="bg-amber-500 hover:!bg-amber-600 border-amber-500"
                >
                  {t("listings.modal.setPremium")}
                </Button>
              </div>
            )}
          </div>

          {/* VIP Management */}
          <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 rounded-xl border border-purple-200 dark:border-purple-700 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                <StarOutlined className="text-white text-lg" />
              </div>
              <div>
                <div className="font-semibold text-purple-800 dark:text-purple-200">
                  {t("listings.modal.vipManagement")}
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400">
                  {listing.isVip ? (
                    <>
                      ✓ {t("listings.modal.vipActive")}
                      {listing.vipExpiresAt && (
                        <>
                          {" "}
                          • {dayjs(listing.vipExpiresAt).format("DD MMM YYYY")}
                        </>
                      )}
                    </>
                  ) : (
                    t("listings.membership.standard")
                  )}
                </div>
              </div>
            </div>
            {listing.isVip ? (
              <Button
                danger
                block
                size="small"
                onClick={handleRemoveVip}
                loading={vipMutation.isPending}
              >
                {t("listings.modal.removeVip")}
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <InputNumber
                  min={1}
                  max={365}
                  value={vipDays}
                  onChange={(value) => setVipDays(value || 30)}
                  addonAfter={t("listings.modal.days")}
                  style={{ flex: 1 }}
                  size="small"
                />
                <Button
                  type="primary"
                  icon={<StarOutlined />}
                  onClick={handleSetVip}
                  loading={vipMutation.isPending}
                  size="small"
                  className="bg-purple-500 hover:!bg-purple-600 border-purple-500"
                >
                  {t("listings.modal.setVip")}
                </Button>
              </div>
            )}
          </div>
        </div>

        <Row gutter={24}>
          {/* Left: Images */}
          <Col xs={24} md={12}>
            {/* Main Image */}
            <div className="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-[4/3] mb-3">
              {allImages.length > 0 ? (
                <Image.PreviewGroup items={allImages}>
                  <Image
                    src={mainImage}
                    alt={listing.title}
                    className="!w-full !h-full"
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                    preview={{
                      mask: (
                        <div className="flex flex-col items-center">
                          <EyeOutlined style={{ fontSize: 24 }} />
                          <span className="mt-1 text-sm">
                            {t("common.view")}
                          </span>
                        </div>
                      ),
                    }}
                  />
                </Image.PreviewGroup>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-5xl mb-2">🐾</div>
                    <div className="text-sm">
                      {t("listings.modal.noImages")}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {allImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`cursor-pointer rounded-lg overflow-hidden aspect-square border-2 transition-all ${
                      idx === selectedImageIndex
                        ? "border-blue-500 shadow-md"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${listing.title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Image Count Info */}
            {allImages.length > 0 && (
              <div className="text-center text-sm text-gray-500 mt-2">
                {t("listings.modal.totalImages")}: {allImages.length}
              </div>
            )}
          </Col>

          {/* Right: All Details */}
          <Col xs={24} md={12}>
            <Descriptions
              column={1}
              size="small"
              bordered
              className="listing-details-table"
              labelStyle={{ width: "40%", fontWeight: 500 }}
            >
              {/* Basic Info */}
              <Descriptions.Item label="ID">{listing.id}</Descriptions.Item>

              <Descriptions.Item label={t("listings.table.category")}>
                {listing.petCategory?.localizations?.[0]?.title ||
                  listing.categoryTitle ||
                  "-"}
              </Descriptions.Item>

              <Descriptions.Item label={t("listings.table.breed")}>
                {listing.breedTitle ||
                  listing.petBreed?.localizations?.[0]?.title ||
                  (listing.suggestedBreedName ? (
                    <Tooltip
                      title={t(
                        "listings.modal.clickToCreateBreed",
                        "Klikləyin və bu cinsi yaradın",
                      )}
                    >
                      <Tag
                        color="orange"
                        icon={<PlusCircleOutlined />}
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowBreedModal(true)}
                      >
                        {t("listings.modal.suggestedBreed")}:{" "}
                        {listing.suggestedBreedName}
                      </Tag>
                    </Tooltip>
                  ) : (
                    "-"
                  ))}
              </Descriptions.Item>

              <Descriptions.Item label={t("listings.modal.gender")}>
                {getGenderLabel(listing.gender) || "-"}
              </Descriptions.Item>

              <Descriptions.Item label={t("listings.modal.size")}>
                {getSizeLabel(listing.size) || "-"}
              </Descriptions.Item>

              <Descriptions.Item label={t("listings.modal.age")}>
                {listing.age ||
                  (listing.ageInMonths ? `${listing.ageInMonths} ay` : "-")}
              </Descriptions.Item>

              <Descriptions.Item label={t("listings.table.city")}>
                <span className="flex items-center gap-1">
                  <EnvironmentOutlined className="text-gray-400" />
                  {listing.city?.nameEn || listing.cityName || "-"}
                </span>
              </Descriptions.Item>

              <Descriptions.Item label={t("listings.table.district", "Rayon")}>
                <span className="flex items-center gap-1">
                  <EnvironmentOutlined className="text-gray-400" />
                  {listing.districtName ? (
                    listing.districtName
                  ) : listing.customDistrictName ? (
                    <Tooltip
                      title={t(
                        "listings.modal.clickToCreateDistrict",
                        "Klikləyin və bu rayonu yaradın",
                      )}
                    >
                      <Tag
                        color="orange"
                        icon={<PlusCircleOutlined />}
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowDistrictModal(true)}
                      >
                        {t("listings.modal.suggestedDistrict", "Təklif edilən")}
                        : {listing.customDistrictName}
                      </Tag>
                    </Tooltip>
                  ) : (
                    "-"
                  )}
                </span>
              </Descriptions.Item>

              <Descriptions.Item label={t("listings.table.price")}>
                {listing.price != null && listing.price > 0 ? (
                  <span className="font-semibold text-emerald-600">
                    {listing.price.toLocaleString()} ₼
                  </span>
                ) : (
                  "-"
                )}
              </Descriptions.Item>

              <Descriptions.Item label={t("listings.table.status")}>
                {listing.status !== undefined ? (
                  <StatusBadge status={listing.status} />
                ) : (
                  "-"
                )}
              </Descriptions.Item>

              <Descriptions.Item label={t("listings.table.type")}>
                <Tag color={listingTypeConfig.color} className="m-0">
                  {listingTypeConfig.icon} {listingTypeConfig.label}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label={t("listings.filters.membership")}>
                <MembershipBadge
                  type={listing.isPremium ? "premium" : "standard"}
                />
              </Descriptions.Item>

              {listing.language && (
                <Descriptions.Item label={t("listings.table.language")}>
                  <LanguageBadge language={listing.language} />
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* Stats */}
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-medium">
                {t("listings.modal.statistics")}
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <Tooltip title={t("listings.modal.views")}>
                  <div>
                    <div className="text-xl font-bold text-gray-700 dark:text-gray-200">
                      {listing.viewCount || 0}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                      <EyeOutlined /> {t("listings.modal.views")}
                    </div>
                  </div>
                </Tooltip>
                <Tooltip title={t("listings.modal.favorites")}>
                  <div>
                    <div className="text-xl font-bold text-gray-700 dark:text-gray-200">
                      {listing.favoriteCount || 0}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                      <HeartOutlined /> {t("listings.modal.favorites")}
                    </div>
                  </div>
                </Tooltip>
                <Tooltip title={t("listings.modal.questions")}>
                  <div>
                    <div className="text-xl font-bold text-gray-700 dark:text-gray-200">
                      {listing.questionCount || 0}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                      <QuestionCircleOutlined /> {t("listings.modal.questions")}
                    </div>
                  </div>
                </Tooltip>
              </div>
            </div>

            {/* Dates */}
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-medium">
                {t("listings.modal.dates")}
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    {t("listings.modal.createdAt")}:
                  </span>
                  <span className="font-medium">
                    {listing.createdAt
                      ? dayjs(listing.createdAt).format("DD MMM YYYY, HH:mm")
                      : "-"}
                  </span>
                </div>
                {listing.publishedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      {t("listings.modal.publishedAt")}:
                    </span>
                    <span className="font-medium">
                      {dayjs(listing.publishedAt).format("DD MMM YYYY, HH:mm")}
                    </span>
                  </div>
                )}
                {listing.updatedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      {t("listings.modal.updatedAt")}:
                    </span>
                    <span className="font-medium">
                      {dayjs(listing.updatedAt).format("DD MMM YYYY, HH:mm")}
                    </span>
                  </div>
                )}
                {listing.premiumExpiresAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      {t("listings.modal.premiumUntil")}:
                    </span>
                    <span className="font-medium text-amber-600">
                      {dayjs(listing.premiumExpiresAt).format(
                        "DD MMM YYYY, HH:mm",
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* User Info */}
            {(listing.user?.firstName || listing.user?.phoneNumber) && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2 font-medium">
                  {t("listings.modal.owner")}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <UserOutlined className="text-blue-600 dark:text-blue-400 text-lg" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {listing.user?.firstName} {listing.user?.lastName}
                    </div>
                    {listing.user?.phoneNumber && (
                      <Text
                        className="text-sm text-gray-500"
                        copyable={{
                          icon: <CopyOutlined className="text-xs" />,
                          tooltips: false,
                        }}
                      >
                        {listing.user.phoneNumber}
                      </Text>
                    )}
                    {listing.user?.email && (
                      <div className="text-sm text-gray-500">
                        {listing.user.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Col>
        </Row>

        {/* Description */}
        {listing.description && (
          <>
            <Divider className="!my-4" />
            <div>
              <Text
                type="secondary"
                className="text-xs uppercase tracking-wide mb-2 block font-medium"
              >
                {t("listings.modal.description")}
              </Text>
              <Paragraph className="!mb-0 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {listing.description}
              </Paragraph>
            </div>
          </>
        )}

        {/* Rejection Reason (if rejected) */}
        {listing.status === ListingStatus.Rejected &&
          listing.rejectionReason && (
            <Alert
              type="error"
              className="mt-4"
              message={t("listings.modal.rejectReason")}
              description={listing.rejectionReason}
              showIcon
            />
          )}
      </div>

      {/* Actions for Pending Listings */}
      {isPending && (
        <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          {!showRejectInput ? (
            <div className="flex justify-end gap-3">
              <Button
                danger
                icon={<CloseOutlined />}
                onClick={() => setShowRejectInput(true)}
              >
                {t("listings.modal.reject")}
              </Button>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={handleApprove}
                loading={reviewMutation.isPending}
                className="bg-emerald-600 hover:!bg-emerald-700 border-emerald-600"
              >
                {t("listings.modal.approve")}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Input.TextArea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder={t("listings.modal.rejectReasonPlaceholder")}
                rows={3}
                maxLength={500}
                showCount
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button size="small" onClick={() => setShowRejectInput(false)}>
                  {t("common.cancel")}
                </Button>
                <Button
                  danger
                  size="small"
                  type="primary"
                  onClick={handleReject}
                  loading={reviewMutation.isPending}
                  disabled={!rejectReason.trim()}
                >
                  {t("listings.modal.reject")}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Breed Creation Modal from Suggested Breed */}
      {listing.suggestedBreedName && (
        <BreedModal
          open={showBreedModal}
          breed={null}
          onClose={() => setShowBreedModal(false)}
          defaultCategoryId={listing.petCategoryId || listing.categoryId}
          initialAzName={listing.suggestedBreedName}
          onSuccess={handleBreedCreated}
        />
      )}

      {/* District Creation Modal from Suggested District */}
      {listing.customDistrictName && (
        <DistrictModal
          open={showDistrictModal}
          district={null}
          onClose={() => setShowDistrictModal(false)}
          defaultCityId={listing.cityId}
          initialAzName={listing.customDistrictName}
          onSuccess={handleDistrictCreated}
        />
      )}
    </Modal>
  );
}
