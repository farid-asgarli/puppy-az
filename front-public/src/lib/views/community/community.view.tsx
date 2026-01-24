"use client";

import {
  IconMessageCircle,
  IconUsers,
  IconHeart,
  IconBulb,
  IconArrowRight,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandTiktok,
  IconSparkles,
  IconPaw,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Heading, Text } from "@/lib/primitives/typography";
import TransitionLink from "@/lib/components/transition-link";

const CommunityView = () => {
  const t = useTranslations("community");

  const features = [
    {
      icon: IconMessageCircle,
      title: t("features.discuss.title"),
      description: t("features.discuss.description"),
    },
    {
      icon: IconHeart,
      title: t("features.share.title"),
      description: t("features.share.description"),
    },
    {
      icon: IconBulb,
      title: t("features.learn.title"),
      description: t("features.learn.description"),
    },
    {
      icon: IconUsers,
      title: t("features.connect.title"),
      description: t("features.connect.description"),
    },
  ];

  const socialLinks = [
    {
      icon: IconBrandInstagram,
      name: "Instagram",
      href: "https://instagram.com/puppy.az",
      description: t("social.instagram"),
    },
    {
      icon: IconBrandFacebook,
      name: "Facebook",
      href: "https://facebook.com/puppy.az",
      description: t("social.facebook"),
    },
    {
      icon: IconBrandTiktok,
      name: "TikTok",
      href: "https://tiktok.com/@puppy.az",
      description: t("social.tiktok"),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="space-y-2">
            <Heading variant="page-title" as="h1">
              {t("hero.title")}
            </Heading>
            <Text variant="body-lg" color="secondary">
              {t("hero.subtitle")}
            </Text>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-20">
          {/* Coming Soon Banner */}
          <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto shadow-sm">
                <IconSparkles size={32} className="text-primary-600" />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
                  <IconPaw size={16} />
                  {t("comingSoon.badge")}
                </div>
                <Heading variant="section" as="h2" className="mb-3">
                  {t("comingSoon.title")}
                </Heading>
                <Text variant="body-lg" color="secondary">
                  {t("comingSoon.description")}
                </Text>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div>
            <div className="text-center mb-12">
              <Heading variant="section" as="h2" className="mb-3">
                {t("features.title")}
              </Heading>
              <Text variant="body-lg" color="secondary">
                {t("features.subtitle")}
              </Text>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl border-2 border-gray-200 space-y-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                    <feature.icon size={24} className="text-primary-600" />
                  </div>
                  <div>
                    <Heading variant="card" as="h3" className="mb-2">
                      {feature.title}
                    </Heading>
                    <Text variant="body" color="secondary">
                      {feature.description}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media Section */}
          <div>
            <div className="text-center mb-8">
              <Heading variant="subsection" as="h3" className="mb-2">
                {t("social.title")}
              </Heading>
              <Text variant="body" color="secondary">
                {t("social.subtitle")}
              </Text>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                    <social.icon size={24} className="text-gray-700" />
                  </div>
                  <div>
                    <Text variant="body" className="font-medium">
                      {social.name}
                    </Text>
                    <Text variant="small" color="secondary">
                      {social.description}
                    </Text>
                  </div>
                  <IconArrowRight size={18} className="ml-auto text-gray-400" />
                </a>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center py-8 border-t border-gray-200">
            <Text variant="body" color="secondary" className="mb-4">
              {t("cta.question")}
            </Text>
            <div className="flex items-center justify-center gap-4">
              <TransitionLink
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-gray-200 font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                {t("cta.contact")}
              </TransitionLink>
              <TransitionLink
                href="/help"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
              >
                {t("cta.help")}
              </TransitionLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityView;
