import { Tabs, Form, Input } from "antd";
import type { Locale } from "@/app/i18n";
import { SUPPORTED_LOCALES } from "@/app/i18n";
import { useTranslation } from "react-i18next";

interface TranslationTabsProps {
  fieldName: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}

export function TranslationTabs({
  fieldName,
  label,
  required = false,
  placeholder,
  multiline = false,
  rows = 4,
}: TranslationTabsProps) {
  const { t } = useTranslation();

  const localeLabels: Record<Locale, string> = {
    az: t("translationTabs.az"),
    en: t("translationTabs.en"),
    ru: t("translationTabs.ru"),
  };

  const items = SUPPORTED_LOCALES.map((locale) => ({
    key: locale,
    label: <span className="font-medium">{localeLabels[locale]}</span>,
    children: (
      <Form.Item
        name={[fieldName, locale]}
        label={`${label} (${localeLabels[locale]})`}
        rules={[
          {
            required,
            message: `${label} (${localeLabels[locale]}) ${t("common.required").toLowerCase()}`,
          },
        ]}
      >
        {multiline ? (
          <Input.TextArea
            placeholder={placeholder}
            rows={rows}
            showCount
            maxLength={5000}
          />
        ) : (
          <Input placeholder={placeholder} maxLength={255} />
        )}
      </Form.Item>
    ),
  }));

  return (
    <div className="border rounded-lg p-4 bg-gray-50/50 dark:bg-gray-800/50">
      <Tabs items={items} defaultActiveKey="az" />
    </div>
  );
}

// Simple translation fields (non-tabbed)
interface TranslationFieldsProps {
  fieldName: string;
  label: string;
  required?: boolean;
  placeholder?: string;
}

export function TranslationFields({
  fieldName,
  label,
  required = false,
  placeholder,
}: TranslationFieldsProps) {
  const { t } = useTranslation();

  const localeLabels: Record<Locale, string> = {
    az: t("translationTabs.az"),
    en: t("translationTabs.en"),
    ru: t("translationTabs.ru"),
  };

  return (
    <div className="space-y-4">
      {SUPPORTED_LOCALES.map((locale) => (
        <Form.Item
          key={locale}
          name={[fieldName, locale]}
          label={`${label} (${localeLabels[locale]})`}
          rules={[
            {
              required,
              message: `${label} (${localeLabels[locale]}) ${t("common.required").toLowerCase()}`,
            },
          ]}
        >
          <Input placeholder={placeholder} maxLength={255} />
        </Form.Item>
      ))}
    </div>
  );
}
