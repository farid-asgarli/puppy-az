/**
 * Typography Usage Examples
 *
 * This file demonstrates all typography primitive usage patterns
 * found in About, Premium, Settings, and Ad-Placement views.
 */

import { Heading, Text, Label } from "@/lib/primitives/typography";

// ============================================================================
// Example 1: Page Header (Common in all views)
// ============================================================================

export function PageHeaderExample() {
  return (
    <div className="border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-2">
          <Heading variant="page-title">Haqqımızda</Heading>
          <Text variant="body-lg">
            Heyvan sevənləri üçün yaradılmış platforma
          </Text>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Example 2: Hero Section (From About & Premium views)
// ============================================================================

export function HeroSectionExample() {
  return (
    <div className="space-y-8">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <Heading variant="display">
          Azərbaycanda heyvan alış-verişini təhlükəsiz və asan edən platforma
        </Heading>

        <Text variant="body-xl" leading="relaxed">
          puppy.az 2023-cü ildə Azərbaycanda heyvan sevənləri üçün etibarlı və
          istifadəçi dostu bir platforma yaratmaq missiyası ilə quruldu.
        </Text>

        <Text variant="body-xl" leading="relaxed">
          Biz heyvanların layiqli yuva tapması və onlara qayğı göstərəcək
          məsuliyyətli sahiblərlə görüşməsində köməkçi olmaq istəyirik.
        </Text>
      </div>
    </div>
  );
}

// ============================================================================
// Example 3: Section Headers (Settings & About views)
// ============================================================================

export function SectionHeaderExample() {
  return (
    <div className="space-y-10">
      {/* Large section */}
      <div className="space-y-3">
        <Heading variant="section">Tətbiq tənzimləmələri</Heading>
        <Text variant="body-lg">Görünüş və dil seçimləri</Text>
      </div>

      {/* Subsection */}
      <div className="space-y-4">
        <div className="space-y-1">
          <Heading variant="subsection" as="h3">
            Görünüş
          </Heading>
          <Text variant="body">Tətbiqin görünüşünü seçin</Text>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Example 4: Card Content (Premium & About views)
// ============================================================================

export function CardContentExample() {
  return (
    <div className="p-6 rounded-xl border-2 border-gray-200 space-y-4">
      <Heading variant="card">Premium elanın üstünlükləri</Heading>
      <Text variant="body">
        Premium elanlar orta hesabla 5-7 dəfə daha tez satılır və 10 dəfə daha
        çox baxış alır.
      </Text>
    </div>
  );
}

// ============================================================================
// Example 5: Form Fields (Common pattern)
// ============================================================================

export function FormFieldExample() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label variant="field" htmlFor="firstName">
          Ad
        </Label>
        <input
          id="firstName"
          type="text"
          className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <Label variant="field" htmlFor="email">
          Email ünvanı
        </Label>
        <input
          id="email"
          type="email"
          className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none"
        />
      </div>
    </div>
  );
}

// ============================================================================
// Example 6: Info Display (Profile & Settings views)
// ============================================================================

export function InfoDisplayExample() {
  return (
    <div className="p-6 rounded-xl border-2 border-gray-200 space-y-4">
      <div className="flex items-center justify-between">
        <Label variant="meta" as="span">
          Qeydiyyat tarixi
        </Label>
        <Label variant="value" as="span">
          12 Yanvar 2024
        </Label>
      </div>

      <div className="flex items-center justify-between">
        <Label variant="meta" as="span">
          Son giriş
        </Label>
        <Label variant="value" as="span">
          5 dəqiqə əvvəl
        </Label>
      </div>
    </div>
  );
}

// ============================================================================
// Example 7: Stats/Metrics Display (Premium & About views)
// ============================================================================

export function StatsDisplayExample() {
  return (
    <div className="p-6 rounded-xl border-2 border-gray-200 text-center space-y-3">
      <div className="text-2xl lg:text-3xl font-semibold text-gray-900">
        10,000+
      </div>
      <Label variant="meta" as="div">
        Aktiv elanlar
      </Label>
    </div>
  );
}

// ============================================================================
// Example 8: Intro/Welcome Screen (Ad-Placement view)
// ============================================================================

export function IntroScreenExample() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 py-12">
      <div className="max-w-6xl w-full">
        <div className="space-y-8">
          <div className="space-y-3">
            <Heading variant="hero">Tell us about your pet</Heading>
          </div>

          <Text variant="body-xl" leading="relaxed">
            In this step, we'll ask you which type of ad you want to create and
            what category your pet belongs to. Then we'll guide you through the
            details to create a compelling listing.
          </Text>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Example 9: Small Print / Metadata (Common pattern)
// ============================================================================

export function SmallPrintExample() {
  return (
    <div className="space-y-4">
      <Text variant="small" color="tertiary" as="div" className="text-center">
        Saxlanmış elanlar 5 gün saxlanılır
      </Text>

      <Text variant="tiny" color="muted" as="div" className="text-center">
        PNG, JPG formatında, maksimum 5MB
      </Text>
    </div>
  );
}

// ============================================================================
// Example 10: Mixed Typography (Realistic usage)
// ============================================================================

export function CompletePageExample() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="space-y-2">
            <Heading variant="page-title">Tənzimləmələr</Heading>
            <Text variant="body-lg">Tətbiq və məxfilik tənzimləmələri</Text>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-20">
          {/* Section 1 */}
          <div className="space-y-10">
            <div className="space-y-3">
              <Heading variant="section">Tətbiq tənzimləmələri</Heading>
              <Text variant="body-lg">Görünüş və dil seçimləri</Text>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="space-y-1">
                  <Heading variant="subsection" as="h3">
                    Görünüş
                  </Heading>
                  <Text variant="body">Tətbiqin görünüşünü seçin</Text>
                </div>

                {/* Theme cards would go here */}
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-10">
            <div className="space-y-3">
              <Heading variant="section">Hesab məlumatları</Heading>
              <Text variant="body-lg">Qeydiyyat və istifadə statistikası</Text>
            </div>

            <div className="p-6 rounded-xl border-2 border-gray-200 space-y-4">
              <div className="flex items-center justify-between">
                <Label variant="meta" as="span">
                  Qeydiyyat tarixi
                </Label>
                <Label variant="value" as="span">
                  12 Yanvar 2024
                </Label>
              </div>

              <div className="flex items-center justify-between">
                <Label variant="meta" as="span">
                  Son giriş
                </Label>
                <Label variant="value" as="span">
                  5 dəqiqə əvvəl
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Example 11: Inline Text Variations
// ============================================================================

export function InlineVariationsExample() {
  return (
    <div className="space-y-4">
      {/* Bold emphasis */}
      <Text variant="body">
        This is regular text with{" "}
        <Text as="span" weight="semibold">
          bold emphasis
        </Text>{" "}
        in the middle.
      </Text>

      {/* Color variation */}
      <Text variant="body">
        Premium elanlar{" "}
        <Text as="span" color="primary" weight="semibold">
          10x daha çox
        </Text>{" "}
        görünürlük əldə edir.
      </Text>

      {/* Mixed sizes inline */}
      <div className="flex items-baseline gap-2">
        <Label variant="value" as="span">
          ₼ 299.99
        </Label>
        <Text variant="small" color="tertiary" as="span">
          / ay
        </Text>
      </div>
    </div>
  );
}
