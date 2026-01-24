"use client";

import {
  IconCalendarEvent,
  IconMapPin,
  IconUsers,
  IconBell,
  IconArrowRight,
  IconPaw,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Heading, Text } from "@/lib/primitives/typography";
import TransitionLink from "@/lib/components/transition-link";

const EventsView = () => {
  const t = useTranslations("events");

  const eventIdeas = [
    {
      icon: IconUsers,
      title: t("ideas.meetup.title"),
      description: t("ideas.meetup.description"),
    },
    {
      icon: IconPaw,
      title: t("ideas.adoption.title"),
      description: t("ideas.adoption.description"),
    },
    {
      icon: IconMapPin,
      title: t("ideas.walk.title"),
      description: t("ideas.walk.description"),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 border-b border-primary-100">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 text-primary-700 text-sm font-medium mb-4">
              <IconCalendarEvent size={16} />
              {t("hero.badge")}
            </div>
            <Heading variant="page-title" as="h1" className="mb-4">
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
        <div className="space-y-16">
          {/* No Events Message */}
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <IconCalendarEvent size={40} className="text-gray-400" />
            </div>
            <Heading variant="section" as="h2" className="mb-3">
              {t("empty.title")}
            </Heading>
            <Text
              variant="body-lg"
              color="secondary"
              className="max-w-md mx-auto"
            >
              {t("empty.description")}
            </Text>
          </div>

          {/* Future Event Ideas */}
          <div>
            <div className="text-center mb-10">
              <Heading variant="subsection" as="h3" className="mb-2">
                {t("ideas.title")}
              </Heading>
              <Text variant="body" color="secondary">
                {t("ideas.subtitle")}
              </Text>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {eventIdeas.map((idea, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl border-2 border-dashed border-gray-200 space-y-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <idea.icon size={20} className="text-gray-500" />
                  </div>
                  <Heading variant="label" as="h4">
                    {idea.title}
                  </Heading>
                  <Text variant="small" color="secondary">
                    {idea.description}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          {/* Notification CTA */}
          <div className="p-8 rounded-2xl bg-gray-50 text-center">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
              <IconBell size={24} className="text-gray-600" />
            </div>
            <Heading variant="card" as="h3" className="mb-2">
              {t("notify.title")}
            </Heading>
            <Text
              variant="body"
              color="secondary"
              className="mb-6 max-w-md mx-auto"
            >
              {t("notify.description")}
            </Text>
            <div className="flex items-center justify-center gap-3">
              <a
                href="https://instagram.com/puppy.az"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
              >
                {t("notify.followInstagram")}
                <IconArrowRight size={18} />
              </a>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center py-8 border-t border-gray-200">
            <Text variant="body" color="secondary" className="mb-4">
              {t("cta.question")}
            </Text>
            <div className="flex items-center justify-center gap-4">
              <TransitionLink
                href="/community"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-gray-200 font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                {t("cta.community")}
              </TransitionLink>
              <TransitionLink
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-gray-200 font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                {t("cta.contact")}
              </TransitionLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsView;
