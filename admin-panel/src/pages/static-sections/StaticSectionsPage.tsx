import { useState, useEffect, useMemo } from "react";
import {
  Typography,
  Card,
  Row,
  Col,
  Tabs,
  Input,
  Button,
  Space,
  Spin,
  Empty,
} from "antd";
import { SaveOutlined, EditOutlined, LoadingOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LOCALES, type Locale } from "@/app/i18n";
import {
  useStaticSections,
  useStaticSection,
  useUpdateStaticSection,
} from "@/features/static-sections";
import type { StaticSectionListItem } from "@/shared/api/types";

const { Title, Text } = Typography;

// Section key to i18n label mapping
const SECTION_LABELS: Record<string, string> = {
  home_hero: "staticSections.sections.homeHero",
  home_how_it_works: "staticSections.sections.homeHowItWorks",
  home_why_puppy: "staticSections.sections.homeWhyPuppy",
  home_ready_start: "staticSections.sections.homeReadyStart",
  about: "staticSections.sections.about",
  contact: "staticSections.sections.contact",
  terms: "staticSections.sections.terms",
  privacy: "staticSections.sections.privacy",
  safety: "staticSections.sections.safety",
  career: "staticSections.sections.career",
  press: "staticSections.sections.press",
  blog: "staticSections.sections.blog",
  help_center: "staticSections.sections.helpCenter",
  complaint: "staticSections.sections.complaint",
  community: "staticSections.sections.community",
  events: "staticSections.sections.events",
  guides: "staticSections.sections.guides",
  partnership: "staticSections.sections.partnership",
};

interface EditedContent {
  title: Record<Locale, string>;
  subtitle: Record<Locale, string>;
  content: Record<Locale, string>;
  metadata: Record<Locale, string | null>;
}

export default function StaticSectionsPage() {
  const { t } = useTranslation();
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(
    null,
  );
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState<EditedContent>({
    title: { az: "", en: "", ru: "" },
    subtitle: { az: "", en: "", ru: "" },
    content: { az: "", en: "", ru: "" },
    metadata: { az: null, en: null, ru: null },
  });

  // API hooks
  const { data: sections, isLoading: sectionsLoading } = useStaticSections();
  const { data: selectedSection, isLoading: sectionLoading } =
    useStaticSection(selectedSectionId);
  const updateMutation = useUpdateStaticSection();

  // Find currently selected section from list
  const selectedSectionListItem = useMemo(() => {
    if (!sections || !selectedSectionId) return null;
    return sections.find((s) => s.id === selectedSectionId) || null;
  }, [sections, selectedSectionId]);

  // Populate form when section is loaded
  useEffect(() => {
    if (selectedSection?.localizations) {
      const newContent: EditedContent = {
        title: { az: "", en: "", ru: "" },
        subtitle: { az: "", en: "", ru: "" },
        content: { az: "", en: "", ru: "" },
        metadata: { az: null, en: null, ru: null },
      };

      selectedSection.localizations.forEach((loc) => {
        const locale = loc.localeCode as Locale;
        if (SUPPORTED_LOCALES.includes(locale)) {
          newContent.title[locale] = loc.title || "";
          newContent.subtitle[locale] = loc.subtitle || "";
          newContent.content[locale] = loc.content || "";
          newContent.metadata[locale] = loc.metadata || null;
        }
      });

      setEditedContent(newContent);
      setEditMode(false);
    }
  }, [selectedSection]);

  const handleSelectSection = (section: StaticSectionListItem) => {
    setSelectedSectionId(section.id);
    setEditMode(false);
  };

  const handleSave = () => {
    if (!selectedSection || !selectedSectionId) return;

    const localizations = SUPPORTED_LOCALES.map((locale) => ({
      localeCode: locale,
      title: editedContent.title[locale],
      subtitle: editedContent.subtitle[locale],
      content: editedContent.content[locale],
      metadata: editedContent.metadata[locale],
    }));

    updateMutation.mutate(
      {
        id: selectedSectionId,
        data: {
          id: selectedSectionId,
          key: selectedSection.key,
          localizations,
          isActive: selectedSection.isActive,
        },
      },
      {
        onSuccess: () => {
          setEditMode(false);
        },
      },
    );
  };

  const getSectionLabel = (key: string): string => {
    const labelKey = SECTION_LABELS[key];
    if (labelKey) {
      return t(labelKey);
    }
    // Format key as fallback: home_hero -> Home Hero
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const localeLabels: Record<Locale, string> = {
    az: t("translationTabs.az"),
    en: t("translationTabs.en"),
    ru: t("translationTabs.ru"),
  };

  if (sectionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Title level={2} className="!mb-0">
        {t("staticSections.pageTitle")}
      </Title>

      <Row gutter={24}>
        {/* Sections List */}
        <Col xs={24} lg={8}>
          <div className="space-y-3">
            {sections && sections.length > 0 ? (
              sections.map((section) => (
                <Card
                  key={section.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedSectionId === section.id
                      ? "border-primary-500 border-2"
                      : ""
                  }`}
                  onClick={() => handleSelectSection(section)}
                  size="small"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Text strong className="block">
                        {getSectionLabel(section.key)}
                      </Text>
                      <Text type="secondary" className="text-xs">
                        {t("staticSections.lastUpdated")}:{" "}
                        {section.updatedAt
                          ? new Date(section.updatedAt).toLocaleDateString()
                          : new Date(section.createdAt).toLocaleDateString()}
                      </Text>
                    </div>
                    <EditOutlined className="text-gray-400" />
                  </div>
                </Card>
              ))
            ) : (
              <Empty description={t("common.noData")} />
            )}
          </div>
        </Col>

        {/* Editor */}
        <Col xs={24} lg={16}>
          {selectedSectionId && selectedSectionListItem ? (
            <Card
              loading={sectionLoading}
              title={
                <div className="flex items-center justify-between">
                  <span>{getSectionLabel(selectedSectionListItem.key)}</span>
                  <Space>
                    {editMode ? (
                      <>
                        <Button onClick={() => setEditMode(false)}>
                          {t("common.cancel")}
                        </Button>
                        <Button
                          type="primary"
                          icon={<SaveOutlined />}
                          onClick={handleSave}
                          loading={updateMutation.isPending}
                        >
                          {t("common.save")}
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => setEditMode(true)}
                      >
                        {t("common.edit")}
                      </Button>
                    )}
                  </Space>
                </div>
              }
            >
              <Tabs
                items={SUPPORTED_LOCALES.map((locale) => ({
                  key: locale,
                  label: localeLabels[locale],
                  children: (
                    <div className="space-y-4">
                      {/* Title */}
                      <div>
                        <Text strong className="block mb-2">
                          {t("common.title", "Başlıq")}
                        </Text>
                        {editMode ? (
                          <Input
                            value={editedContent.title[locale]}
                            onChange={(e) =>
                              setEditedContent((prev) => ({
                                ...prev,
                                title: {
                                  ...prev.title,
                                  [locale]: e.target.value,
                                },
                              }))
                            }
                            placeholder={`${t("common.title")} (${localeLabels[locale]})`}
                          />
                        ) : (
                          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            {editedContent.title[locale] || (
                              <Text type="secondary">{t("common.noData")}</Text>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Subtitle */}
                      <div>
                        <Text strong className="block mb-2">
                          {t("common.subtitle", "Alt başlıq")}
                        </Text>
                        {editMode ? (
                          <Input
                            value={editedContent.subtitle[locale]}
                            onChange={(e) =>
                              setEditedContent((prev) => ({
                                ...prev,
                                subtitle: {
                                  ...prev.subtitle,
                                  [locale]: e.target.value,
                                },
                              }))
                            }
                            placeholder={`${t("common.subtitle")} (${localeLabels[locale]})`}
                          />
                        ) : (
                          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            {editedContent.subtitle[locale] || (
                              <Text type="secondary">{t("common.noData")}</Text>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ),
                }))}
              />
            </Card>
          ) : (
            <Card>
              <div className="py-20 text-center text-gray-400">
                <EditOutlined className="text-5xl mb-4" />
                <p>
                  {t(
                    "staticSections.selectSection",
                    "Redaktə etmək üçün bölmə seçin",
                  )}
                </p>
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
}
