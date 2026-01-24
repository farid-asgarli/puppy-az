"use client";

import { useState } from "react";
import {
  IconBuildingStore,
  IconSpeakerphone,
  IconPencil,
  IconMail,
  IconArrowRight,
  IconChevronDown,
  IconStar,
  IconCheck,
  IconHeart,
  IconPaw,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/external/utils";

type PartnerKey = "sponsor" | "store" | "advertiser" | "creator";

const partnerTypes: Array<{ key: PartnerKey; icon: Icon }> = [
  { key: "sponsor", icon: IconStar },
  { key: "store", icon: IconBuildingStore },
  { key: "advertiser", icon: IconSpeakerphone },
  { key: "creator", icon: IconPencil },
];

function getBenefitKeys(
  raw: Record<string, unknown> | undefined,
  max = 5,
): string[] {
  return Object.keys(raw || {}).slice(0, max);
}

export function PartnershipView() {
  const t = useTranslations("partnership");
  const [active, setActive] = useState<PartnerKey>("sponsor");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(1);

  const activeTitle = t(`types.${active}.title`);
  const activeDesc = t(`types.${active}.description`);
  const benefitsRaw = t.raw(`types.${active}.benefits`) as
    | Record<string, unknown>
    | undefined;
  const benefits = getBenefitKeys(benefitsRaw, 6);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-indigo-50/70 to-white">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
                <IconStar size={16} />
                {t("hero.badge")}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {t("hero.title")}
              </h1>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                {t("hero.subtitle")}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                >
                  {t("hero.contact")}
                  <IconArrowRight size={20} />
                </a>
                <a
                  href="#details"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  {t("hero.cta")}
                </a>
              </div>
            </div>

            {/* Right - Visual Cards */}
            <div className="relative hidden lg:block">
              <div className="relative w-full h-[400px]">
                {/* Main card */}
                <div className="absolute top-8 left-8 w-64 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <IconPaw size={24} className="text-indigo-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        puppy.az
                      </div>
                      <div className="text-sm text-gray-500">
                        {t("hero.becomePartner")}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-indigo-100 rounded-full w-full" />
                    <div className="h-2 bg-indigo-50 rounded-full w-3/4" />
                  </div>
                </div>

                {/* Stats card */}
                <div className="absolute top-0 right-0 w-48 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-xl p-5 text-white">
                  <div className="text-3xl font-bold">50K+</div>
                  <div className="text-indigo-100 text-sm mt-1">
                    {t("hero.monthlyVisitors")}
                  </div>
                </div>

                {/* Floating card 1 */}
                <div className="absolute bottom-16 left-0 w-52 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <IconHeart size={20} className="text-teal-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {t("hero.petLoversTitle")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t("hero.activeCommunity")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating card 2 */}
                <div className="absolute bottom-0 right-8 w-56 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <IconStar size={20} className="text-amber-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {t("hero.premiumPartners")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t("hero.specialFeatures")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Background decoration */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section id="details" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t("types.title")}
            </h2>
            <p className="mt-4 text-lg text-gray-600">{t("types.subtitle")}</p>
          </div>

          {/* Type cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {partnerTypes.map((p) => {
              const Icon = p.icon;
              const isActive = p.key === active;
              return (
                <button
                  key={p.key}
                  onClick={() => setActive(p.key)}
                  className={cn(
                    "text-left p-5 rounded-2xl border transition-all",
                    isActive
                      ? "bg-indigo-50 border-indigo-200 ring-2 ring-indigo-500/20"
                      : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm",
                  )}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                      isActive ? "bg-indigo-600" : "bg-gray-100",
                    )}
                  >
                    <Icon
                      size={24}
                      className={isActive ? "text-white" : "text-gray-600"}
                    />
                  </div>
                  <div
                    className={cn(
                      "font-semibold",
                      isActive ? "text-indigo-900" : "text-gray-900",
                    )}
                  >
                    {t(`types.${p.key}.title`)}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-2 gap-6 items-stretch">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50/50 rounded-3xl border border-indigo-100 p-8 lg:p-10 flex flex-col">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium mb-4 self-start">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                {t("details.selectedFormat")}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {activeTitle}
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg flex-1">
                {activeDesc}
              </p>

              <a
                href="#contact"
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors self-start"
              >
                {t("details.apply")}
                <IconArrowRight size={18} />
              </a>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 p-8 lg:p-10 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center">
                  <IconCheck size={24} className="text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">
                  {t("details.benefits")}
                </h4>
              </div>

              <ul className="space-y-4 flex-1">
                {benefits.map((k) => (
                  <li
                    key={k}
                    className="flex items-start gap-3 p-4 bg-teal-50 rounded-xl"
                  >
                    <IconCheck
                      size={20}
                      className="text-teal-600 mt-0.5 shrink-0"
                    />
                    <span className="text-gray-700">
                      {t(`types.${active}.benefits.${k}`)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-gray-100 text-center text-sm text-gray-500">
                {t("details.responseNote")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-28 bg-gray-50">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            {t("faq.title")}
          </h2>

          <div className="space-y-4">
            {[1, 2, 3, 4].map((n) => {
              const isOpen = expandedFaq === n;
              return (
                <div
                  key={n}
                  className={cn(
                    "rounded-2xl border overflow-hidden transition-colors",
                    isOpen
                      ? "border-indigo-200 bg-white"
                      : "border-gray-200 bg-white",
                  )}
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : n)}
                    className="w-full flex items-center justify-between gap-4 p-6 text-left"
                  >
                    <span className="font-semibold text-gray-900">
                      {t(`faq.q${n}`)}
                    </span>
                    <IconChevronDown
                      size={20}
                      className={cn(
                        "text-gray-400 transition-transform shrink-0",
                        isOpen && "rotate-180 text-indigo-500",
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-200",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-gray-600 leading-relaxed">
                        {t(`faq.a${n}`)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="py-20 md:py-28 bg-gradient-to-br from-gray-50 to-indigo-50/50"
      >
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left - Info */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
                <IconMail size={16} />
                {t("contact.badge")}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t("contact.title")}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {t("contact.description")}
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                    <IconMail size={22} className="text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">
                      {t("contact.email")}
                    </div>
                    <div className="font-semibold text-gray-900">
                      partnership@puppy.az
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
                    <IconCheck size={22} className="text-teal-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">
                      {t("contact.responseTime")}
                    </div>
                    <div className="font-semibold text-gray-900">
                      {t("contact.responseTimeValue")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Form Card */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 p-8 lg:p-10">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <IconPaw size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {t("contact.partnerApplication")}
                </h3>
                <p className="text-gray-500 mt-2">
                  {t("contact.selectedFormat")}:{" "}
                  <span className="font-medium text-indigo-600">
                    {activeTitle}
                  </span>
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-600">
                  <IconCheck size={18} className="text-teal-500 shrink-0" />
                  <span>{t("contact.emailContent.brand")}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <IconCheck size={18} className="text-teal-500 shrink-0" />
                  <span>{t("contact.emailContent.purpose")}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <IconCheck size={18} className="text-teal-500 shrink-0" />
                  <span>{t("contact.emailContent.budget")}</span>
                </div>
              </div>

              <a
                href="mailto:partnership@puppy.az"
                className="flex items-center justify-center gap-3 w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              >
                <IconMail size={20} />
                {t("contact.sendEmail")}
              </a>

              <p className="mt-4 text-center text-sm text-gray-400">
                {t("contact.quickTip")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900">
        <div className="text-center text-sm text-gray-400">
          Puppy.az Partnership
        </div>
      </footer>
    </div>
  );
}
