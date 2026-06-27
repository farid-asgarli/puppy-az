import { useState } from "react";
import { Form, Input, InputNumber, Select, Button, Row, Col } from "antd";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useCategories } from "@/features/categories";
import { useCities } from "@/features/cities";
import { useDistrictsByCity } from "@/features/districts";
import { api } from "@/shared/api/httpClient";
import type { Listing } from "@/shared/api/types";
import { ListingType, Gender, AnimalSize } from "@/shared/api/types";
import { useUpdateListing } from "../api/listingsApi";

const { TextArea } = Input;

interface ListingEditFormProps {
  listing: Listing;
  onCancel: () => void;
  onSaved: () => void;
}

interface EditFormValues {
  title: string;
  description: string;
  adType: ListingType;
  petCategoryId?: number;
  petBreedId?: number;
  cityId: number;
  districtId?: number;
  ageYears?: number;
  ageMonths?: number;
  gender?: Gender;
  color?: string;
  weight?: number;
  size?: AnimalSize;
  price: number;
}

export function ListingEditForm({
  listing,
  onCancel,
  onSaved,
}: ListingEditFormProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm<EditFormValues>();
  const updateMutation = useUpdateListing();

  const initialCategoryId = listing.petCategoryId ?? listing.categoryId;
  const initialCityId = listing.cityId;
  const initialAgeInMonths = listing.ageInMonths ?? 0;

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(initialCategoryId);
  const [selectedCityId, setSelectedCityId] = useState<number | undefined>(
    initialCityId,
  );
  const [selectedAdType, setSelectedAdType] = useState<ListingType | undefined>(
    listing.adType,
  );

  // Reference data (same public endpoints used by the Create Ad wizard)
  const { data: categories } = useCategories();
  const { data: citiesResponse } = useCities({ page: 1, pageSize: 500 });
  const { data: districts } = useDistrictsByCity(selectedCityId);
  const { data: breeds } = useQuery({
    queryKey: ["public-breeds", selectedCategoryId],
    queryFn: async () => {
      const params = selectedCategoryId
        ? `?categoryId=${selectedCategoryId}`
        : "";
      return api.get<{ id: number; title: string; categoryId: number }[]>(
        `/pet-ads/breeds${params}`,
      );
    },
    enabled: !!selectedCategoryId,
  });
  const { data: colors } = useQuery({
    queryKey: ["public-colors-az"],
    queryFn: async () =>
      api.get<{ id: number; title: string }[]>("/pet-ads/colors", {
        headers: { "Accept-Language": "az" },
      }),
  });
  const { data: adTypes } = useQuery({
    queryKey: ["public-ad-types"],
    queryFn: async () =>
      api.get<{ id: number; title: string; emoji: string }[]>("/pet-ads/types"),
  });

  const cities = citiesResponse?.items || [];

  const adTypeOptions = (adTypes || []).map((type) => ({
    value: type.id,
    label: `${type.emoji} ${type.title}`,
  }));

  const genderOptions = [
    { value: Gender.Male, label: t("listings.gender.male") },
    { value: Gender.Female, label: t("listings.gender.female") },
  ];

  const sizeOptions = [
    { value: AnimalSize.ExtraSmall, label: t("listings.size.extraSmall") },
    { value: AnimalSize.Small, label: t("listings.size.small") },
    { value: AnimalSize.Medium, label: t("listings.size.medium") },
    { value: AnimalSize.Large, label: t("listings.size.large") },
    { value: AnimalSize.ExtraLarge, label: t("listings.size.extraLarge") },
  ];

  const isBreedRequired =
    selectedAdType === ListingType.Sale ||
    selectedAdType === ListingType.Match ||
    selectedAdType === ListingType.Lost;

  const handleFinish = (values: EditFormValues) => {
    const ageInMonths =
      (values.ageYears || 0) * 12 + (values.ageMonths || 0) || undefined;

    updateMutation.mutate(
      {
        id: listing.id,
        data: {
          title: values.title,
          description: values.description,
          adType: values.adType,
          petCategoryId: values.petCategoryId,
          petBreedId: values.petBreedId,
          cityId: values.cityId,
          districtId: values.districtId || undefined,
          ageInMonths,
          gender: values.gender,
          size: values.size,
          color: values.color || "",
          weight: values.weight,
          price: values.price,
        },
      },
      {
        onSuccess: () => onSaved(),
      },
    );
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        title: listing.title,
        description: listing.description,
        adType: listing.adType,
        petCategoryId: initialCategoryId,
        petBreedId: listing.petBreedId ?? listing.breedId,
        cityId: initialCityId,
        districtId: listing.districtId,
        ageYears: Math.floor(initialAgeInMonths / 12) || undefined,
        ageMonths: initialAgeInMonths % 12 || undefined,
        gender: listing.gender,
        color: listing.color,
        weight: listing.weight ?? undefined,
        size: listing.size,
        price: listing.price ?? 0,
      }}
    >
      <Row gutter={[16, 0]}>
        {/* Ad Type */}
        <Col xs={24} md={12}>
          <Form.Item
            name="adType"
            label={t("createAd.adType")}
            rules={[{ required: true, message: t("createAd.adTypeRequired") }]}
          >
            <Select
              placeholder={t("createAd.selectAdType")}
              options={adTypeOptions}
              onChange={(value) => setSelectedAdType(value)}
            />
          </Form.Item>
        </Col>

        {/* Price */}
        <Col xs={24} md={12}>
          <Form.Item
            name="price"
            label={t("createAd.price")}
            rules={[
              { required: true, message: t("createAd.priceRequired") },
              { type: "number", min: 0, message: t("createAd.priceMinimum") },
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              precision={2}
              addonAfter="AZN"
              controls={false}
            />
          </Form.Item>
        </Col>

        {/* Title */}
        <Col xs={24}>
          <Form.Item
            name="title"
            label={t("createAd.titleLabel")}
            rules={[
              { required: true, message: t("createAd.titleRequired") },
              { max: 200, message: t("createAd.titleMaxLength") },
            ]}
          >
            <Input maxLength={200} showCount />
          </Form.Item>
        </Col>

        {/* Description */}
        <Col xs={24}>
          <Form.Item
            name="description"
            label={t("createAd.descriptionLabel")}
            rules={[
              { required: true, message: t("createAd.descriptionRequired") },
              { max: 2000, message: t("createAd.descriptionMaxLength") },
            ]}
          >
            <TextArea rows={4} maxLength={2000} showCount />
          </Form.Item>
        </Col>

        {/* Category */}
        <Col xs={24} md={12}>
          <Form.Item name="petCategoryId" label={t("createAd.category")}>
            <Select
              placeholder={t("createAd.selectCategory")}
              allowClear
              showSearch
              optionFilterProp="label"
              options={categories?.map((cat: { id: number; title?: string }) => ({
                value: cat.id,
                label: cat.title,
              }))}
              onChange={(value) => {
                setSelectedCategoryId(value);
                form.setFieldValue("petBreedId", undefined);
              }}
            />
          </Form.Item>
        </Col>

        {/* Breed */}
        <Col xs={24} md={12}>
          <Form.Item
            name="petBreedId"
            label={t("createAd.breed")}
            rules={[
              { required: isBreedRequired, message: t("createAd.breedRequired") },
            ]}
          >
            <Select
              placeholder={t("createAd.selectBreed")}
              allowClear
              disabled={!selectedCategoryId}
              showSearch
              optionFilterProp="label"
              options={breeds?.map((breed) => ({
                value: breed.id,
                label: breed.title,
              }))}
            />
          </Form.Item>
        </Col>

        {/* City */}
        <Col xs={24} md={12}>
          <Form.Item
            name="cityId"
            label={t("createAd.city")}
            rules={[{ required: true, message: t("createAd.cityRequired") }]}
          >
            <Select
              showSearch
              placeholder={t("createAd.selectCity")}
              optionFilterProp="label"
              options={cities.map(
                (city: {
                  id: number;
                  nameAz?: string;
                  nameEn?: string;
                  nameRu?: string;
                }) => ({
                  value: city.id,
                  label: city.nameAz || city.nameEn || city.nameRu,
                }),
              )}
              onChange={(value) => {
                setSelectedCityId(value);
                form.setFieldValue("districtId", undefined);
              }}
            />
          </Form.Item>
        </Col>

        {/* District */}
        <Col xs={24} md={12}>
          <Form.Item name="districtId" label={t("createAd.district")}>
            <Select
              placeholder={t("createAd.selectDistrict")}
              allowClear
              disabled={!selectedCityId}
              showSearch
              optionFilterProp="label"
              options={districts?.map((d: { id: number; name: string }) => ({
                value: d.id,
                label: d.name,
              }))}
            />
          </Form.Item>
        </Col>

        {/* Age */}
        <Col xs={24} md={12}>
          <Form.Item label={t("createAd.age", "Yaş")}>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="ageYears" noStyle>
                  <InputNumber
                    min={0}
                    max={30}
                    placeholder="0"
                    style={{ width: "100%" }}
                    addonAfter={t("createAd.year", "İl")}
                    controls={false}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="ageMonths" noStyle>
                  <InputNumber
                    min={0}
                    max={11}
                    placeholder="0"
                    style={{ width: "100%" }}
                    addonAfter={t("createAd.month", "Ay")}
                    controls={false}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Col>

        {/* Gender */}
        <Col xs={24} md={12}>
          <Form.Item name="gender" label={t("createAd.gender")}>
            <Select
              placeholder={t("createAd.selectGender")}
              allowClear
              options={genderOptions}
            />
          </Form.Item>
        </Col>

        {/* Color */}
        <Col xs={24} md={12}>
          <Form.Item name="color" label={t("createAd.color")}>
            <Select
              placeholder={t("createAd.selectColor")}
              allowClear
              showSearch
              optionFilterProp="label"
              options={colors?.map((color) => ({
                value: color.title,
                label: color.title,
              }))}
            />
          </Form.Item>
        </Col>

        {/* Weight */}
        <Col xs={24} md={12}>
          <Form.Item name="weight" label={t("createAd.weight")}>
            <InputNumber
              min={0}
              max={500}
              style={{ width: "100%" }}
              precision={2}
              addonAfter="kg"
              controls={false}
            />
          </Form.Item>
        </Col>

        {/* Size */}
        <Col xs={24} md={12}>
          <Form.Item name="size" label={t("createAd.size")}>
            <Select
              placeholder={t("createAd.selectSize")}
              allowClear
              options={sizeOptions}
            />
          </Form.Item>
        </Col>
      </Row>

      <div className="flex justify-end gap-2 pt-2">
        <Button icon={<CloseOutlined />} onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          icon={<SaveOutlined />}
          loading={updateMutation.isPending}
        >
          {t("common.save", "Yadda saxla")}
        </Button>
      </div>
    </Form>
  );
}
