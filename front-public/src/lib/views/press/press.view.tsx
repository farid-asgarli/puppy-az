"use client";

import { useState } from "react";
import {
  IconMail,
  IconCalendar,
  IconNews,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandTiktok,
  IconArrowRight,
  IconSparkles,
  IconChevronDown,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/external/utils";
import { Heading, Text } from "@/lib/primitives/typography";
import TransitionLink from "@/lib/components/transition-link";
import { SectionHeader } from "@/lib/components/views/common";

const PressView = () => {
  const t = useTranslations("press");
  const [openId, setOpenId] = useState<string | null>(null);

  const pressReleases = [
    {
      id: "1",
      date: "2025-09-10",
      title: t("releases.newCategories.title"),
      excerpt: t("releases.newCategories.excerpt"),
    },
    {
      id: "2",
      date: "2024-03-01",
      title: t("releases.launch.title"),
      excerpt: t("releases.launch.excerpt"),
    },
  ];

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const socialLinks = [
    {
      icon: IconBrandInstagram,
      name: "Instagram",
      href: "https://instagram.com/puppy.az",
    },
    {
      icon: IconBrandFacebook,
      name: "Facebook",
      href: "https://facebook.com/puppy.az",
    },
    {
      icon: IconBrandTiktok,
      name: "TikTok",
      href: "https://tiktok.com/@puppy.az",
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
          {/* Press Contact Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Info */}
            <div className="p-8 rounded-xl border-2 border-gray-200 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <IconMail size={24} className="text-primary-600" />
              </div>
              <div>
                <Heading variant="card" as="h3" className="mb-2">
                  {t("contact.title")}
                </Heading>
                <Text variant="body" color="secondary" className="mb-4">
                  {t("contact.subtitle")}
                </Text>
                <a
                  href="mailto:press@puppy.az"
                  className="inline-flex items-center gap-2 text-lg font-medium text-gray-900 hover:text-primary-600 transition-colors"
                >
                  press@puppy.az
                  <IconArrowRight size={18} />
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-accent-50 via-primary-50 to-info-50 border-2 border-primary-200 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                <IconSparkles size={24} className="text-primary-600" />
              </div>
              <div>
                <Heading variant="card" as="h3" className="mb-2">
                  {t("social.title")}
                </Heading>
                <Text variant="body" color="secondary" className="mb-4">
                  {t("social.subtitle")}
                </Text>
                <div className="flex items-center gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
                      aria-label={social.name}
                    >
                      <social.icon size={20} className="text-gray-700" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Press Releases Section */}
          <div className="space-y-10">
            <SectionHeader
              title={t("releases.title")}
              subtitle={t("releases.subtitle")}
            />

            <div className="space-y-3">
              {pressReleases.map((release) => {
                const isOpen = openId === release.id;
                return (
                  <div
                    key={release.id}
                    className="rounded-xl border-2 border-gray-200 overflow-hidden transition-colors hover:border-gray-300"
                  >
                    <button
                      onClick={() => toggleAccordion(release.id)}
                      className="w-full p-5 flex items-center gap-4 text-left bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <IconNews size={20} className="text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <IconCalendar size={14} className="text-gray-400" />
                          <Text variant="small" color="tertiary">
                            {new Date(release.date).toLocaleDateString(
                              "az-AZ",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </Text>
                        </div>
                        <Heading
                          variant="card"
                          as="h3"
                          className="text-gray-900"
                        >
                          {release.title}
                        </Heading>
                      </div>
                      <IconChevronDown
                        size={20}
                        className={cn(
                          "text-gray-400 transition-transform duration-200 flex-shrink-0",
                          isOpen && "rotate-180",
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-200",
                        isOpen ? "max-h-96" : "max-h-0",
                      )}
                    >
                      <div className="px-5 pb-5 pt-0 ml-14">
                        <Text variant="body" color="secondary">
                          {release.excerpt}
                        </Text>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="p-8 rounded-xl bg-gray-50 border-2 border-gray-200">
            <div className="text-center max-w-2xl mx-auto">
              <Heading variant="subsection" as="h2" className="mb-3">
                {t("cta.title")}
              </Heading>
              <Text variant="body" color="secondary" className="mb-6">
                {t("cta.subtitle")}
              </Text>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <TransitionLink
                  href="/about"
                  className={cn(
                    "inline-flex items-center justify-center gap-2",
                    "px-6 py-3 rounded-xl",
                    "bg-gray-900 text-white",
                    "hover:bg-gray-800 transition-colors duration-200",
                    "font-semibold",
                  )}
                >
                  {t("cta.aboutUs")}
                </TransitionLink>
                <TransitionLink
                  href="/contact"
                  className={cn(
                    "inline-flex items-center justify-center gap-2",
                    "px-6 py-3 rounded-xl",
                    "border-2 border-gray-200 text-gray-700",
                    "hover:border-gray-300 hover:bg-gray-50 transition-colors duration-200",
                    "font-semibold",
                  )}
                >
                  {t("cta.contactUs")}
                </TransitionLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PressView;
