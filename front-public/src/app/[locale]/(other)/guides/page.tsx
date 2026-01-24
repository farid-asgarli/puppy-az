import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { GuidesView } from "@/lib/views/guides";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("guides.title"),
    description: t("guides.description"),
  };
}

const GuidesPage = () => {
  return <GuidesView />;
};

export default GuidesPage;
