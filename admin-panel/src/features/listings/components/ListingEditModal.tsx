import { useEffect, useMemo } from "react";
import { Modal, Form, Input, InputNumber, Select, Button } from "antd";
import { useTranslation } from "react-i18next";
import { useUpdateListing } from "../api/listingsApi";
import type { Listing } from "@/shared/api/types";
import { ListingType, Gender, AnimalSize } from "@/shared/api/types";
import { useAllCities } from "@/features/cities";
import { useCategories } from "@/features/categories";
import { useBreeds } from "@/features/breeds";
import { useDistrictsByCity } from "@/features/districts";

const { TextArea } = Input;

interface ListingEditModalProps {
  open: boolean;
  listing: Listing | null;
  onClose: () => void;
}

interface EditFormValues {
  title: string;
  description: string;
  adType: ListingType;
  petCategoryId?: number | null;
  petBreedId?: number | null;
  cityId: number;
  districtId?: number | null;
  gender?: Gender | null;
  size?: AnimalSize | null;
  ageInMonths?: number | null;
  color?: string;
  weight?: number | null;
  price?: number | null;
}

// Ad types where the breed is optional (mirrors the backend rule).
const OPTIONAL_BREED_TYPES = [ListingType.Found, ListingType.Owning];

export function ListingEditModal({
  open,
  listing,
  onClose,
}: ListingEditModalProps) {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm<EditFormValues>();
  const updateMutation = useUpdateListing();

  const locale = i18n.language;

  const { data: cities = [] } = useAllCities();
  const { data: categories = [] } = useCategories();

  // Watch category + city to drive dependent dropdowns.
  const selectedCategoryId = Form.useWatch("petCategoryId", form);
  const selectedCityId = Form.useWatch("cityId", form);
  const selectedAdType = Form.useWatch("adType", form);

  const { data: breeds = [] } = useBreeds(
    selectedCategoryId ? { petCategoryId: selectedCategoryId } : undefined,
  );
  const { data: districts = [] } = useDistrictsByCity(selectedCityId);

  useEffect(() => {
    if (open && listing) {
      form.setFieldsValue({
        title: listing.title ?? "",
        description: listing.description ?? "",
        adType: listing.adType,
        petCategoryId: listing.petCategoryId ?? listing.categoryId ?? null,
        petBreedId: listing.petBreedId ?? listing.breedId ?? null,
        cityId: listing.cityId as number,
        districtId: listing.districtId ?? null,
        gender: listing.gender ?? null,
        size: listing.size ?? null,
        ageInMonths: listing.ageInMonths ?? null,
        color: listing.color ?? "",
        weight: listing.weight ?? null,
        price: listing.price ?? null,
      });
    }
  }, [open, listing, form]);

  const getCategoryName = (cat: (typeof categories)[number]) => {
    const loc = cat.localizations?.find((l) => l.localeCode === locale);
    return loc?.title || cat.title || `#${cat.id}`;
  };

  const getBreedName = (breed: (typeof breeds)[number]) => {
    const loc = breed.localizations?.find((l) => l.localeCode === locale);
    return loc?.title || breed.title || `#${breed.id}`;
  };

  const getCityName = (city: (typeof cities)[number]) => {
    if (locale === "ru") return city.nameRu;
    if (locale === "en") return city.nameEn;
    return city.nameAz;
  };

  const categoryOptions = useMemo(
    () =>
      categories.map((c) => ({ value: c.id, label: getCategoryName(c) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categories, locale],
  );

  const breedOptions = useMemo(
    () => breeds.map((b) => ({ value: b.id, label: getBreedName(b) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [breeds, locale],
  );

  const cityOptions = useMemo(
    () => cities.map((c) => ({ value: c.id, label: getCityName(c) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cities, locale],
  );

  const districtOptions = useMemo(
    () => districts.map((d) => ({ value: d.id, label: d.name })),
    [districts],
  );

  const adTypeOptions = [
    { value: ListingType.Sale, label: t("listings.type.sale") },
    { value: ListingType.Match, label: t("listings.type.match") },
    { value: ListingType.Found, label: t("listings.type.found") },
    { value: ListingType.Lost, label: t("listings.type.lost") },
    { value: ListingType.Owning, label: t("listings.type.owning") },
  ];

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

  const breedRequired = !OPTIONAL_BREED_TYPES.includes(selectedAdType);

  const handleSubmit = async () => {
    if (!listing) return;
    const values = await form.validateFields();
    updateMutation.mutate(
      {
        id: listing.id,
        title: values.title,
        description: values.description,
        adType: values.adType,
        petCategoryId: values.petCategoryId ?? null,
        petBreedId: values.petBreedId ?? null,
        cityId: values.cityId,
        districtId: values.districtId ?? null,
        gender: values.gender ?? null,
        size: values.size ?? null,
        ageInMonths: values.ageInMonths ?? null,
        color: values.color ?? "",
        weight: values.weight ?? null,
        price: values.price ?? null,
        // imageIds omitted on purpose: leaving it null preserves the
        // existing images (the backend only touches images when a
        // non-empty list is provided).
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      open={open}
      title={t("listings.edit.title", "Elanı redaktə et")}
      onCancel={onClose}
      width={"95vw"}
      style={{ maxWidth: 760 }}
      centered
      destroyOnHidden
      footer={[
        <Button key="cancel" onClick={onClose}>
          {t("common.cancel", "Ləğv et")}
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={updateMutation.isPending}
          onClick={handleSubmit}
        >
          {t("common.save", "Yadda saxla")}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        className="mt-2"
        onValuesChange={(changed) => {
          // Reset breed when category changes; reset district when city changes.
          if ("petCategoryId" in changed) {
            form.setFieldValue("petBreedId", null);
          }
          if ("cityId" in changed) {
            form.setFieldValue("districtId", null);
          }
        }}
      >
        <Form.Item
          name="title"
          label={t("listings.edit.fieldTitle", "Başlıq")}
          rules={[
            {
              required: true,
              message: t("listings.edit.titleRequired", "Başlıq tələb olunur"),
            },
          ]}
        >
          <Input maxLength={200} />
        </Form.Item>

        <Form.Item
          name="description"
          label={t("listings.edit.fieldDescription", "Təsvir")}
          rules={[
            {
              required: true,
              message: t(
                "listings.edit.descriptionRequired",
                "Təsvir tələb olunur",
              ),
            },
          ]}
        >
          <TextArea rows={4} maxLength={4000} showCount />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <Form.Item
            name="adType"
            label={t("listings.edit.fieldType", "Elan növü")}
            rules={[{ required: true }]}
          >
            <Select options={adTypeOptions} />
          </Form.Item>

          <Form.Item
            name="price"
            label={t("listings.edit.fieldPrice", "Qiymət (₼)")}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="0"
            />
          </Form.Item>

          <Form.Item
            name="petCategoryId"
            label={t("listings.edit.fieldCategory", "Kateqoriya")}
          >
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              options={categoryOptions}
              placeholder={t("listings.edit.selectCategory", "Seçin")}
            />
          </Form.Item>

          <Form.Item
            name="petBreedId"
            label={t("listings.edit.fieldBreed", "Cins")}
            rules={[
              {
                required: breedRequired,
                message: t(
                  "listings.edit.breedRequired",
                  "Bu elan növü üçün cins tələb olunur",
                ),
              },
            ]}
          >
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              options={breedOptions}
              disabled={!selectedCategoryId}
              placeholder={
                selectedCategoryId
                  ? t("listings.edit.selectBreed", "Seçin")
                  : t("listings.edit.selectCategoryFirst", "Əvvəlcə kateqoriya seçin")
              }
            />
          </Form.Item>

          <Form.Item
            name="cityId"
            label={t("listings.edit.fieldCity", "Şəhər")}
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              options={cityOptions}
            />
          </Form.Item>

          <Form.Item
            name="districtId"
            label={t("listings.edit.fieldDistrict", "Rayon")}
          >
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              options={districtOptions}
              disabled={!selectedCityId}
              placeholder={t("listings.edit.selectDistrict", "Seçin")}
            />
          </Form.Item>

          <Form.Item
            name="gender"
            label={t("listings.edit.fieldGender", "Cinsiyyət")}
          >
            <Select allowClear options={genderOptions} />
          </Form.Item>

          <Form.Item
            name="size"
            label={t("listings.edit.fieldSize", "Ölçü")}
          >
            <Select allowClear options={sizeOptions} />
          </Form.Item>

          <Form.Item
            name="ageInMonths"
            label={t("listings.edit.fieldAge", "Yaş (ay)")}
          >
            <InputNumber min={0} max={600} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="weight"
            label={t("listings.edit.fieldWeight", "Çəki (kq)")}
          >
            <InputNumber min={0} step={0.1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="color"
            label={t("listings.edit.fieldColor", "Rəng")}
          >
            <Input maxLength={100} />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
