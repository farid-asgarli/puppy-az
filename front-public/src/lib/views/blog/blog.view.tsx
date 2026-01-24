import { useTranslations } from "next-intl";
import { Heading, Text } from "@/lib/primitives/typography";
import TransitionLink from "@/lib/components/transition-link";
import { IconPaw, IconArrowLeft, IconSparkles } from "@tabler/icons-react";

const BlogView = () => {
  const t = useTranslations("blog");

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Coming Soon Section */}
      <section className="relative overflow-hidden">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-white to-emerald-50/50" />

        {/* Decorative paws */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <IconPaw
            size={60}
            className="absolute top-20 left-[10%] text-primary-100 rotate-[-15deg]"
          />
          <IconPaw
            size={45}
            className="absolute top-32 right-[15%] text-emerald-100 rotate-[20deg]"
          />
          <IconPaw
            size={50}
            className="absolute bottom-24 left-[20%] text-primary-100/80 rotate-[10deg]"
          />
          <IconPaw
            size={35}
            className="absolute bottom-32 right-[12%] text-emerald-100 rotate-[-20deg]"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-24 sm:py-32 lg:py-40">
          <div className="max-w-xl mx-auto text-center space-y-8">
            {/* Icon */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-100 to-emerald-100 flex items-center justify-center mx-auto">
              <IconSparkles size={36} className="text-primary-600" />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-sm font-medium text-amber-700">
                {t("comingSoon.badge")}
              </span>
            </div>

            {/* Title */}
            <Heading variant="page-title" as="h1" className="text-gray-900">
              {t("comingSoon.title")}
            </Heading>

            {/* Description */}
            <Text
              variant="body-lg"
              className="text-gray-600 max-w-md mx-auto leading-relaxed"
            >
              {t("comingSoon.description")}
            </Text>

            {/* Back to home */}
            <div className="pt-4">
              <TransitionLink
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
              >
                <IconArrowLeft size={18} />
                {t("comingSoon.backHome")}
              </TransitionLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogView;
