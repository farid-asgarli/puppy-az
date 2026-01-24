import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { PartnershipView } from "@/lib/views/partnership";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("partnership.title"),
    description: t("partnership.description"),
  };
}

const PartnershipPage = () => {
  return <PartnershipView />;
};

export default PartnershipPage;
