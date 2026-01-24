"use client";

import {
  IconRocket,
  IconHeart,
  IconUsers,
  IconBulb,
  IconMail,
  IconArrowRight,
  IconSparkles,
  IconBrandInstagram,
  IconBrandLinkedin,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Heading, Text } from "@/lib/primitives/typography";
import TransitionLink from "@/lib/components/transition-link";

const CareersView = () => {
  const t = useTranslations("careers");

  const perks = [
    {
      icon: IconUsers,
      title: t("perks.smallTeam.title"),
      description: t("perks.smallTeam.description"),
    },
    {
      icon: IconBulb,
      title: t("perks.growth.title"),
      description: t("perks.growth.description"),
    },
    {
      icon: IconRocket,
      title: t("perks.impact.title"),
      description: t("perks.impact.description"),
    },
    {
      icon: IconSparkles,
      title: t("perks.learning.title"),
      description: t("perks.learning.description"),
    },
  ];

  const values = [
    {
      icon: IconHeart,
      title: t("values.mission.title"),
      description: t("values.mission.description"),
    },
    {
      icon: IconUsers,
      title: t("values.team.title"),
      description: t("values.team.description"),
    },
    {
      icon: IconSparkles,
      title: t("values.impact.title"),
      description: t("values.impact.description"),
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
          {/* Mission Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-8 rounded-xl border-2 border-gray-200 space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                  <value.icon size={24} className="text-primary-600" />
                </div>
                <Heading variant="card" as="h3">
                  {value.title}
                </Heading>
                <Text variant="body" color="secondary">
                  {value.description}
                </Text>
              </div>
            ))}
          </div>

          {/* Perks Section */}
          <div>
            <div className="text-center mb-12">
              <Heading variant="section" as="h2" className="mb-3">
                {t("perks.title")}
              </Heading>
              <Text variant="body-lg" color="secondary">
                {t("perks.subtitle")}
              </Text>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {perks.map((perk, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-gray-50 flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
                    <perk.icon size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <Heading variant="label" as="h4" className="mb-1">
                      {perk.title}
                    </Heading>
                    <Text variant="body-sm" color="secondary">
                      {perk.description}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Join Our Talent Network */}
          <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto shadow-sm">
                <IconSparkles size={32} className="text-primary-600" />
              </div>

              <div>
                <Heading variant="section" as="h2" className="mb-3">
                  {t("talentNetwork.title")}
                </Heading>
                <Text variant="body-lg" color="secondary" className="mb-6">
                  {t("talentNetwork.description")}
                </Text>
              </div>

              <a
                href="mailto:careers@puppy.az"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                <IconMail size={20} />
                {t("talentNetwork.sendResume")}
                <IconArrowRight size={18} />
              </a>

              <Text variant="body-sm" color="secondary" className="pt-2">
                {t("talentNetwork.hint")}
              </Text>
            </div>
          </div>

          {/* Follow Us */}
          <div className="text-center space-y-6">
            <div>
              <Heading variant="subsection" as="h3" className="mb-2">
                {t("social.title")}
              </Heading>
              <Text variant="body" color="secondary">
                {t("social.subtitle")}
              </Text>
            </div>

            <div className="flex items-center justify-center gap-4">
              <a
                href="https://instagram.com/puppy.az"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <IconBrandInstagram size={24} className="text-gray-700" />
              </a>
              <a
                href="https://linkedin.com/company/puppy-az"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <IconBrandLinkedin size={24} className="text-gray-700" />
              </a>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center py-8 border-t border-gray-200">
            <Text variant="body" color="secondary" className="mb-4">
              {t("cta.curious")}
            </Text>
            <div className="flex items-center justify-center gap-4">
              <TransitionLink
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-gray-200 font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                {t("cta.aboutUs")}
              </TransitionLink>
              <TransitionLink
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
              >
                {t("cta.contactUs")}
              </TransitionLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareersView;
