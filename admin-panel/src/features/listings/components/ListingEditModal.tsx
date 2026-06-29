import { useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Image,
  Tooltip,
  Spin,
  App,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  StarFilled,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useUpdateListing, useUploadListingImages } from "../api/listingsApi";
import type { Listing } from "@/shared/api/types";
import { ListingType, Gender, AnimalSize } from "@/shared/api/types";
import { useAllCities } from "@/features/cities";
import { useCategories } from "@/features/categories";
import { useBreeds } from "@/features/breeds";
import { useDistrictsByCity } from "@/features/districts";

const { TextArea } = Input;

const MAX_IMAGES = 10;

interface ListingEditModalProps {
  open: boolean;
  listing: Listing | null;
  onClose: () => void;
}

interface EditImage {
  id: number;
  url: string;
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
  const { message } = App.useApp();
  const [form] = Form.useForm<EditFormValues>();
  const updateMutation = useUpdateListing();
  const uploadMutation = useUploadListingImages();

  const locale = i18n.language;

  // Local, ordered image list. The first entry is the cover (primary) image.
  const [images, setImages] = useState<EditImage[]>([]);
  const [uploadingCount, setUploadingCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Build the form's initial values directly from the listing. Using
  // initialValues (instead of setFieldsValue in an effect) avoids the antd
  // "form instance not connected" timing problem where the prefill ran before
  // the Form mounted, leaving fields (e.g. Title) empty and breaking submit.
  const initialValues = useMemo<Partial<EditFormValues>>(() => {
    if (!listing) return {};
    return {
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
    };
  }, [listing]);

  // Seed the local image list from the ad's current images (primary first).
  useEffect(() => {
    if (open && listing) {
      const seeded = (listing.images ?? [])
        .map((img) => ({
          id: img.id,
          url: (img.url || img.imageUrl) ?? "",
        }))
        .filter((img) => img.id != null);
      setImages(seeded);
    }
  }, [open, listing]);

  const handleImageSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_IMAGES - images.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    if (filesToUpload.length === 0) {
      message.warning(
        t("listings.edit.maxImages", `Maksimum ${MAX_IMAGES} şəkil`),
      );
      e.target.value = "";
      return;
    }

    setUploadingCount(filesToUpload.length);
    for (const file of filesToUpload) {
      try {
        const uploaded = await uploadMutation.mutateAsync({
          file,
          userId: listing?.userId ?? null,
        });
        if (uploaded?.id) {
          setImages((prev) => [
            ...prev,
            { id: uploaded.id, url: uploaded.url },
          ]);
        }
      } catch {
        // error toast handled inside the hook
      } finally {
        setUploadingCount((prev) => Math.max(0, prev - 1));
      }
    }
    // Reset so the same file can be re-selected.
    e.target.value = "";
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    setImages((prev) => {
      const updated = [...prev];
      const [removed] = updated.splice(fromIndex, 1);
      if (removed) updated.splice(toIndex, 0, removed);
      return updated;
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

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

    if (images.length === 0) {
      message.warning(
        t("listings.edit.atLeastOneImage", "Ən azı bir şəkil olmalıdır"),
      );
      return;
    }

    // Fall back to the listing's own values for required fields so the request
    // can never be sent with a missing Title/Description/etc.
    const title = (values.title ?? listing.title ?? "").trim();
    const description = (
      values.description ??
      listing.description ??
      ""
    ).trim();
    const color = (
      values.color ??
      listing.color ??
      ""
    ).trim();

    updateMutation.mutate(
      {
        id: listing.id,
        title,
        description,
        adType: values.adType ?? listing.adType,
        petCategoryId:
          values.petCategoryId ??
          listing.petCategoryId ??
          listing.categoryId ??
          null,
        petBreedId:
          values.petBreedId ?? listing.petBreedId ?? listing.breedId ?? null,
        cityId: values.cityId ?? (listing.cityId as number),
        districtId: values.districtId ?? listing.districtId ?? null,
        gender: values.gender ?? null,
        size: values.size ?? null,
        ageInMonths: values.ageInMonths ?? null,
        color,
        // Weight must be > 0 when sent; treat 0/empty as "not set".
        weight: values.weight && values.weight > 0 ? values.weight : null,
        // Price is a non-nullable decimal on the backend.
        price: values.price ?? 0,
        // Ordered list; the first image becomes the primary/cover. The
        // backend detaches removed images and attaches newly uploaded ones.
        imageIds: images.map((img) => img.id),
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
        key={listing?.id ?? "edit"}
        form={form}
        layout="vertical"
        requiredMark="optional"
        className="mt-2"
        initialValues={initialValues}
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
        {/* Image management: upload, reorder, delete. First image is the cover. */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {t("listings.edit.images", "Şəkillər")}{" "}
              <span className="text-xs text-gray-400">
                ({images.length}/{MAX_IMAGES})
              </span>
            </span>
            <Button
              size="small"
              icon={<PlusOutlined />}
              onClick={() => fileInputRef.current?.click()}
              disabled={images.length >= MAX_IMAGES || uploadingCount > 0}
            >
              {t("listings.edit.addImage", "Şəkil əlavə et")}
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleImageSelect}
          />
          <div className="text-xs text-gray-400 mb-2">
            {t(
              "listings.edit.imagesHint",
              "İlk şəkil əsas (cover) şəkildir. Sıralamanı oxlarla dəyişə bilərsiniz.",
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {images.map((img, index) => (
              <div
                key={img.id}
                className="relative group w-24 h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <Image
                  src={img.url}
                  alt={`image-${img.id}`}
                  width={96}
                  height={96}
                  className="object-cover"
                  style={{ objectFit: "cover", width: 96, height: 96 }}
                />
                {index === 0 && (
                  <div className="absolute top-1 left-1 bg-amber-500 text-white rounded px-1 py-0.5 text-[10px] flex items-center gap-0.5 z-10">
                    <StarFilled style={{ fontSize: 10 }} />
                    {t("listings.edit.cover", "Əsas")}
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity py-1 z-10">
                  <Tooltip title={t("listings.edit.moveLeft", "Sola")}>
                    <Button
                      type="text"
                      size="small"
                      icon={
                        <ArrowLeftOutlined style={{ color: "#fff" }} />
                      }
                      disabled={index === 0}
                      onClick={() => moveImage(index, index - 1)}
                    />
                  </Tooltip>
                  <Tooltip title={t("listings.edit.delete", "Sil")}>
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={
                        <DeleteOutlined style={{ color: "#ff7875" }} />
                      }
                      onClick={() => removeImage(index)}
                    />
                  </Tooltip>
                  <Tooltip title={t("listings.edit.moveRight", "Sağa")}>
                    <Button
                      type="text"
                      size="small"
                      icon={
                        <ArrowRightOutlined style={{ color: "#fff" }} />
                      }
                      disabled={index === images.length - 1}
                      onClick={() => moveImage(index, index + 1)}
                    />
                  </Tooltip>
                </div>
              </div>
            ))}
            {uploadingCount > 0 && (
              <div className="w-24 h-24 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                <Spin />
              </div>
            )}
            {images.length === 0 && uploadingCount === 0 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-400 transition-colors"
              >
                <PlusOutlined />
                <span className="text-[10px] mt-1">
                  {t("listings.edit.addImage", "Şəkil əlavə et")}
                </span>
              </button>
            )}
          </div>
        </div>

        <Form.Item
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
          <TextArea rows={4} maxLength={2000} showCount />
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
            <InputNumber min={0.1} step={0.1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="color"
            label={t("listings.edit.fieldColor", "Rəng")}
            rules={[
              {
                required: true,
                message: t("listings.edit.colorRequired", "Rəng tələb olunur"),
              },
            ]}
          >
            <Input maxLength={100} />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
