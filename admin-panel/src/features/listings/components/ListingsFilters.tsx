import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Space,
  InputNumber,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  ClearOutlined,
  FilterOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import type { ListingSearchRequest } from "@/shared/api/types";
import { ListingStatus, ListingType } from "@/shared/api/types";
import { SUPPORTED_LOCALES } from "@/app/i18n";
import { useCategories } from "@/features/categories";
import { useIsMobile } from "@/shared/hooks/useIsMobile";

interface ListingsFiltersProps {
  filters: ListingSearchRequest;
  onFiltersChange: (filters: ListingSearchRequest) => void;
  onReset: () => void;
}

export function ListingsFilters({
  filters,
  onFiltersChange,
  onReset,
}: ListingsFiltersProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { data: categories = [] } = useCategories();
  const isMobile = useIsMobile();
  const [filtersOpen, setFiltersOpen] = useState(!isMobile);

  // Sync form with external filter changes (e.g., from status badge clicks)
  useEffect(() => {
    form.setFieldsValue({
      status: filters.status,
    });
  }, [filters.status, form]);

  const handleSearch = () => {
    const values = form.getFieldsValue();

    // Convert membership filter value to isPremium/isVip booleans
    let isPremium: boolean | undefined;
    let isVip: boolean | undefined;

    if (values.membership === "premium") {
      isPremium = true;
      isVip = undefined;
    } else if (values.membership === "vip") {
      isPremium = undefined;
      isVip = true;
    } else if (values.membership === "standard") {
      isPremium = false;
      isVip = false;
    }

    // Remove membership from values and add isPremium/isVip
    const { membership, ...restValues } = values;

    onFiltersChange({
      ...filters,
      ...restValues,
      isPremium,
      isVip,
      page: 1, // Reset to first page on new search
    });
  };

  const handleReset = () => {
    form.setFieldsValue({
      title: undefined,
      status: undefined,
      adType: undefined,
      petCategoryId: undefined,
      language: undefined,
      membership: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    });
    onReset();
  };

  const statusOptions = [
    { value: undefined, label: t("common.all") },
    { value: ListingStatus.Pending, label: t("listings.status.pending") },
    { value: ListingStatus.Published, label: t("listings.status.active") },
    { value: ListingStatus.Rejected, label: t("listings.status.rejected") },
    { value: ListingStatus.Expired, label: t("listings.status.expired") },
    { value: ListingStatus.Closed, label: t("listings.status.closed") },
    { value: ListingStatus.Draft, label: t("listings.status.draft") },
  ];

  const listingTypeOptions = [
    { value: undefined, label: t("common.all") },
    { value: ListingType.Sale, label: t("listings.type.sale") },
    { value: ListingType.Match, label: t("listings.type.match") },
    { value: ListingType.Found, label: t("listings.type.found") },
    { value: ListingType.Lost, label: t("listings.type.lost") },
    { value: ListingType.Owning, label: t("listings.type.owning") },
  ];

  const languageOptions = [
    { value: undefined, label: t("common.all") },
    ...SUPPORTED_LOCALES.map((locale) => ({
      value: locale,
      label: locale.toUpperCase(),
    })),
  ];

  const membershipOptions = [
    { value: undefined, label: t("common.all") },
    { value: "standard", label: t("listings.membership.standard") },
    { value: "premium", label: t("listings.membership.premium") },
    { value: "vip", label: t("listings.membership.vip") },
  ];

  const categoryOptions = [
    { value: undefined, label: t("common.all") },
    ...categories.map((cat) => ({
      value: cat.id,
      label: cat.localizations?.[0]?.title || `Category ${cat.id}`,
    })),
  ];

  return (
    <div className="card p-4 mb-6">
      {/* Mobile filter toggle */}
      {isMobile && (
        <Button
          block
          icon={filtersOpen ? <UpOutlined /> : <FilterOutlined />}
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="mb-3"
        >
          {filtersOpen
            ? t("common.hideFilters", "Filterləri gizlət")
            : t("common.showFilters", "Filterləri göstər")}
        </Button>
      )}

      <div style={{ display: filtersOpen ? "block" : "none" }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={filters}
          onFinish={handleSearch}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="title" label={t("listings.table.title")}>
                <Input placeholder={t("common.search")} allowClear />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="status" label={t("listings.table.status")}>
                <Select
                  options={statusOptions}
                  allowClear
                  placeholder={t("common.select")}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="adType" label={t("listings.table.listingType")}>
                <Select
                  options={listingTypeOptions}
                  allowClear
                  placeholder={t("common.select")}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item
                name="petCategoryId"
                label={t("listings.table.category")}
              >
                <Select
                  options={categoryOptions}
                  allowClear
                  placeholder={t("common.select")}
                  showSearch
                  optionFilterProp="label"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="language" label={t("listings.table.language")}>
                <Select
                  options={languageOptions}
                  allowClear
                  placeholder={t("common.select")}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item
                name="membership"
                label={t("listings.table.membership")}
              >
                <Select
                  options={membershipOptions}
                  allowClear
                  placeholder={t("common.select")}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="minPrice" label={t("listings.filter.minPrice")}>
                <InputNumber
                  className="w-full"
                  min={0}
                  placeholder="0"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="maxPrice" label={t("listings.filter.maxPrice")}>
                <InputNumber
                  className="w-full"
                  min={0}
                  placeholder="10000"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label=" " className="mb-0">
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                  >
                    {t("common.search")}
                  </Button>
                  <Button onClick={handleReset} icon={<ClearOutlined />}>
                    {t("common.reset")}
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}
