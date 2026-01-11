'use client';

import {
  IconPaw,
  IconHeart,
  IconShieldCheck,
  IconUsers,
  IconTrendingUp,
  IconSparkles,
  IconClockCheck,
  IconMessageCircle,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandTwitter,
  IconMail,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/external/utils';
import { Heading, Text } from '@/lib/primitives/typography';
import TransitionLink from '@/lib/components/transition-link';
import { SectionHeader, FeatureCard } from '@/lib/components/views/common';
import { StatCard } from '@/lib/components/views/about/stat-card/stat-card.component';
import { TeamMemberCard } from '@/lib/components/views/about/team-member-card/team-member-card.component';

const AboutView = () => {
  const t = useTranslations('about');

  const stats = [
    { value: '10,000+', label: t('stats.activeAds'), icon: IconPaw },
    { value: '50,000+', label: t('stats.users'), icon: IconUsers },
    { value: '95%', label: t('stats.satisfaction'), icon: IconHeart },
    { value: '24/7', label: t('stats.support'), icon: IconClockCheck },
  ];

  const values = [
    {
      icon: IconShieldCheck,
      title: t('values.security.title'),
      description: t('values.security.description'),
    },
    {
      icon: IconHeart,
      title: t('values.animalLove.title'),
      description: t('values.animalLove.description'),
    },
    {
      icon: IconUsers,
      title: t('values.community.title'),
      description: t('values.community.description'),
    },
    {
      icon: IconSparkles,
      title: t('values.innovation.title'),
      description: t('values.innovation.description'),
    },
  ];

  const team = [
    {
      name: t('team.founder.name'),
      role: t('team.founder.role'),
      avatar: null,
      description: t('team.founder.description'),
    },
    {
      name: t('team.productManager.name'),
      role: t('team.productManager.role'),
      avatar: null,
      description: t('team.productManager.description'),
    },
    {
      name: t('team.technicalDirector.name'),
      role: t('team.technicalDirector.role'),
      avatar: null,
      description: t('team.technicalDirector.description'),
    },
  ];

  const milestones = [
    {
      year: '2023',
      title: t('milestones.launch.title'),
      description: t('milestones.launch.description'),
    },
    {
      year: '2024',
      title: t('milestones.tenKAds.title'),
      description: t('milestones.tenKAds.description'),
    },
    {
      year: '2025',
      title: t('milestones.premium.title'),
      description: t('milestones.premium.description'),
    },
    {
      year: t('milestones.future.year'),
      title: t('milestones.future.title'),
      description: t('milestones.future.description'),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="space-y-2">
            <Heading variant="page-title" as="h1">
              {t('header.title')}
            </Heading>
            <Text variant="body-lg" color="secondary">
              {t('header.subtitle')}
            </Text>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-20">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="max-w-3xl">
              <h2 className="text-4xl lg:text-5xl font-semibold font-heading text-gray-900 leading-tight mb-6">{t('hero.title')}</h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-4">{t('hero.description1')}</p>
              <p className="text-xl text-gray-600 leading-relaxed">{t('hero.description2')}</p>
            </div>

            {/* Feature Image Placeholder */}
            <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-accent-100 via-primary-100 to-info-100 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-accent-400 to-primary-500 rounded-full flex items-center justify-center">
                    <IconPaw size={64} className="text-white" />
                  </div>
                  <p className="text-gray-600 font-medium">{t('hero.imageCaption')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="space-y-10">
            <SectionHeader title={t('sections.stats.title')} subtitle={t('sections.stats.subtitle')} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <StatCard key={index} icon={stat.icon} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>

          {/* Values Section */}
          <div className="space-y-10">
            <SectionHeader title={t('sections.values.title')} subtitle={t('sections.values.subtitle')} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <FeatureCard key={index} icon={value.icon} title={value.title} description={value.description} />
              ))}
            </div>
          </div>

          {/* Timeline Section */}
          <div className="space-y-10">
            <SectionHeader title={t('sections.timeline.title')} subtitle={t('sections.timeline.subtitle')} />

            <div className="relative">
              {/* Timeline Line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2" />

              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={cn('relative grid md:grid-cols-2 gap-8 items-center', index % 2 === 0 ? 'md:text-right' : 'md:flex-row-reverse')}
                  >
                    {/* Content */}
                    <div className={cn('space-y-3', index % 2 === 0 ? 'md:col-start-1' : 'md:col-start-2')}>
                      <div className="inline-block px-4 py-2 bg-gray-100 rounded-lg">
                        <Text variant="small" weight="semibold" className="text-gray-700" as="span">
                          {milestone.year}
                        </Text>
                      </div>
                      <Heading variant="card" as="h3">
                        {milestone.title}
                      </Heading>
                      <Text variant="body" color="secondary">
                        {milestone.description}
                      </Text>
                    </div>

                    {/* Center Dot */}
                    <div className="hidden md:block absolute left-1/2 top-8 w-4 h-4 bg-gray-900 rounded-full -translate-x-1/2 ring-4 ring-white" />

                    {/* Empty space for alternating layout */}
                    <div className={cn('hidden md:block', index % 2 === 0 ? 'md:col-start-2' : 'md:col-start-1')} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="space-y-10">
            <SectionHeader title={t('sections.team.title')} subtitle={t('sections.team.subtitle')} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {team.map((member, index) => (
                <TeamMemberCard key={index} name={member.name} role={member.role} description={member.description} avatar={member.avatar} />
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-10">
            <SectionHeader title={t('sections.contact.title')} subtitle={t('sections.contact.subtitle')} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Info */}
              <div className="p-8 rounded-xl border-2 border-gray-200 space-y-6">
                <Heading variant="card" as="h3">
                  {t('contact.info.title')}
                </Heading>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <IconMail size={20} className="text-gray-700" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 mb-1">{t('contact.info.email')}</div>
                      <a href="mailto:info@puppy.az" className="text-gray-600 hover:text-gray-900 transition-colors">
                        info@puppy.az
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <IconMessageCircle size={20} className="text-gray-700" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 mb-1">{t('contact.info.support')}</div>
                      <TransitionLink href="/help" className="text-gray-600 hover:text-gray-900 transition-colors">
                        {t('contact.info.supportLink')}
                      </TransitionLink>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-gray-200">
                  <Text variant="body" weight="medium" className="mb-3" as="div">
                    {t('contact.info.socialMedia')}
                  </Text>
                  <div className="flex items-center gap-3">
                    <a
                      href="#"
                      className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      aria-label="Instagram"
                    >
                      <IconBrandInstagram size={20} className="text-gray-700" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      aria-label="Facebook"
                    >
                      <IconBrandFacebook size={20} className="text-gray-700" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      aria-label="Twitter"
                    >
                      <IconBrandTwitter size={20} className="text-gray-700" />
                    </a>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="p-8 rounded-xl bg-gradient-to-br from-accent-50 via-primary-50 to-info-50 border-2 border-primary-200 space-y-6">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                  <IconTrendingUp size={24} className="text-primary-600" />
                </div>
                <div>
                  <Heading variant="subsection" as="h3" className="mb-3">
                    {t('contact.cta.title')}
                  </Heading>
                  <Text variant="body" color="secondary" className="mb-6">
                    {t('contact.cta.description')}
                  </Text>
                  <TransitionLink
                    href="/ads/ad-placement"
                    className={cn(
                      'inline-flex items-center justify-center gap-2',
                      'px-8 py-4 rounded-xl',
                      'bg-gray-900 text-white',
                      'hover:bg-gray-800 transition-colors duration-200'
                    )}
                  >
                    <IconSparkles size={20} />
                    <Text variant="body" weight="semibold" as="span">
                      {t('contact.cta.button')}
                    </Text>
                  </TransitionLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
