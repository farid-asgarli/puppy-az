# Typography Primitives

Centralized typography components for the puppy.az design system, based on best practices from About, Premium, Settings, and Ad-Placement views.

## Components

### `<Heading />`

For all heading elements (H1-H6) with consistent styling.

#### Variants

| Variant      | Size      | Use Case                  | Default Element |
| ------------ | --------- | ------------------------- | --------------- |
| `hero`       | `5xl/6xl` | Extra large hero sections | `h1`            |
| `page-title` | `3xl/4xl` | Main page titles          | `h1`            |
| `display`    | `4xl/5xl` | Large display headings    | `h2`            |
| `section`    | `3xl/4xl` | Major section headings    | `h2`            |
| `subsection` | `xl/2xl`  | Subsection headings       | `h3`            |
| `card`       | `xl`      | Card/component headings   | `h3`            |
| `label`      | `lg`      | Small headings            | `h4`            |

#### Props

```typescript
interface HeadingProps {
  variant?: HeadingVariant;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  color?: 'primary' | 'secondary' | 'tertiary';
  children: ReactNode;
  className?: string;
}
```

#### Examples

```tsx
// Page header
<Heading variant="page-title">Haqqımızda</Heading>
// Output: <h1 class="text-3xl lg:text-4xl font-semibold font-heading text-gray-900">

// Hero section
<Heading variant="hero">Tell us about your pet</Heading>
// Output: <h1 class="text-5xl lg:text-6xl font-semibold font-heading leading-tight text-gray-900">

// Section heading
<Heading variant="section">Tətbiq tənzimləmələri</Heading>
// Output: <h2 class="text-3xl lg:text-4xl font-semibold font-heading text-gray-900">

// Subsection
<Heading variant="subsection" as="h3">Görünüş</Heading>
// Output: <h3 class="text-xl lg:text-2xl font-semibold text-gray-900">

// Card heading
<Heading variant="card">Premium elanın üstünlükləri</Heading>
// Output: <h3 class="text-xl font-semibold text-gray-900">

// With custom color
<Heading variant="subsection" color="secondary">Secondary Heading</Heading>
```

---

### `<Text />`

For body copy, descriptions, and general text content.

#### Variants

| Variant   | Size   | Use Case                                |
| --------- | ------ | --------------------------------------- |
| `body-xl` | `xl`   | Large body text, important descriptions |
| `body-lg` | `lg`   | Large body text, subtitles              |
| `body`    | `base` | Default body text                       |
| `small`   | `sm`   | Secondary information                   |
| `tiny`    | `xs`   | Captions, fine print                    |

#### Props

```typescript
interface TextProps {
  variant?: TextVariant;
  as?: 'p' | 'span' | 'div' | 'label';
  color?: 'primary' | 'secondary' | 'tertiary' | 'muted';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  leading?: 'tight' | 'normal' | 'relaxed';
  children: ReactNode;
  className?: string;
}
```

#### Examples

```tsx
// Subtitle/description (most common)
<Text variant="body-lg" color="secondary">
  Tətbiq və məxfilik tənzimləmələri
</Text>
// Output: <p class="text-lg text-gray-600">

// Hero description
<Text variant="body-xl" leading="relaxed">
  İdeal heyvanı tapmaq üçün filtirlərdən istifadə edin
</Text>
// Output: <p class="text-xl text-gray-600 leading-relaxed">

// Standard body
<Text variant="body">
  Biz heyvanları sevirik və onlara münasibətdə məsuliyyətli olmağı təşviq edirik.
</Text>
// Output: <p class="text-base text-gray-600">

// Small secondary text
<Text variant="small" color="tertiary">
  Qeyd olunan elanlar 12 saat ərzində saxlanılır
</Text>
// Output: <p class="text-sm text-gray-500">

// Inline span with weight
<Text as="span" variant="small" weight="semibold">
  Premium
</Text>
```

---

### `<Label />`

Specialized component for form labels, metadata, display values, and badges.

#### Variants

| Variant | Style                         | Use Case                    |
| ------- | ----------------------------- | --------------------------- |
| `field` | `text-sm text-gray-600`       | Form field labels           |
| `value` | `font-semibold text-gray-900` | Display values              |
| `meta`  | `text-sm text-gray-600`       | Metadata (dates, locations) |
| `badge` | `text-xs font-semibold`       | Badge/tag text              |

#### Props

```typescript
interface LabelProps {
  variant?: LabelVariant;
  as?: 'label' | 'span' | 'div' | 'p';
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}
```

#### Examples

```tsx
// Form field label
<Label variant="field" htmlFor="email">
  Email ünvanı
</Label>
// Output: <label for="email" class="text-sm text-gray-600">

// Display value
<Label variant="value">₼ 299.99</Label>
// Output: <label class="font-semibold text-gray-900">

// Metadata
<Label variant="meta" as="span">
  Qeydiyyat tarixi
</Label>
// Output: <span class="text-sm text-gray-600">

// Badge text
<Label variant="badge" as="span">Premium</Label>
// Output: <span class="text-xs font-semibold">
```

---

## Design Principles

Based on `DESIGN-SYSTEM-PROMPT.md` and best practices from:

- About view
- Premium view
- Settings view
- Ad-Placement views

### Typography Scale

- **Headings**: Use `font-heading` (Poppins) with `font-semibold`
- **Body Text**: Use DM Sans (default font) with `font-normal`
- **Responsive**: All heading variants include responsive breakpoints

### Color System

| Color       | Class           | Use Case                 |
| ----------- | --------------- | ------------------------ |
| `primary`   | `text-gray-900` | Headings, important text |
| `secondary` | `text-gray-600` | Body text, descriptions  |
| `tertiary`  | `text-gray-500` | De-emphasized text       |
| `muted`     | `text-gray-400` | Placeholder, disabled    |

### Common Patterns

#### Page Header Pattern

```tsx
<div className='space-y-2'>
  <Heading variant='page-title'>Haqqımızda</Heading>
  <Text variant='body-lg'>Heyvan sevənləri üçün yaradılmış platforma</Text>
</div>
```

#### Section Header Pattern

```tsx
<div className='space-y-3'>
  <Heading variant='section'>Tətbiq tənzimləmələri</Heading>
  <Text variant='body-lg'>Görünüş və dil seçimləri</Text>
</div>
```

#### Subsection Pattern

```tsx
<div className='space-y-1'>
  <Heading variant='subsection' as='h3'>
    Görünüş
  </Heading>
  <Text variant='body'>Tətbiqin görünüşünü seçin</Text>
</div>
```

#### Form Field Pattern

```tsx
<div className='space-y-1'>
  <Label variant='field' htmlFor='name'>
    Ad
  </Label>
  <input id='name' type='text' />
</div>
```

#### Info Display Pattern

```tsx
<div className='flex items-center justify-between'>
  <Label variant='meta' as='span'>
    Qeydiyyat tarixi
  </Label>
  <Label variant='value' as='span'>
    12 Yanvar 2024
  </Label>
</div>
```

---

## Migration Guide

### Before

```tsx
<h1 className="text-3xl lg:text-4xl font-semibold font-heading text-gray-900">
  Haqqımızda
</h1>
<p className="text-lg text-gray-600">
  Heyvan sevənləri üçün yaradılmış platforma
</p>
```

### After

```tsx
<Heading variant="page-title">Haqqımızda</Heading>
<Text variant="body-lg">Heyvan sevənləri üçün yaradılmış platforma</Text>
```

### Benefits

- ✅ Consistent typography across the app
- ✅ Easier to maintain and update
- ✅ Type-safe with TypeScript
- ✅ Semantic HTML automatically
- ✅ Fewer className strings to manage
- ✅ Design system enforced

---

## Advanced Usage

### Custom Classes

```tsx
<Heading variant='section' className='mb-8 text-purple-900'>
  Custom styled heading
</Heading>
```

### Semantic Override

```tsx
{
  /* Visual style of h2, but semantic h3 */
}
<Heading variant='subsection' as='h2'>
  Section Title
</Heading>;
```

### Inline Text Variations

```tsx
<Text variant='body'>
  This is regular text with{' '}
  <Text as='span' weight='semibold'>
    bold emphasis
  </Text>
</Text>
```

---

## Checklist for Migration

When migrating existing components:

1. ✅ Replace heading className strings with `<Heading variant="..." />`
2. ✅ Replace body text with `<Text variant="..." />`
3. ✅ Replace form labels with `<Label variant="field" />`
4. ✅ Replace metadata/values with `<Label variant="meta|value" />`
5. ✅ Verify semantic HTML structure
6. ✅ Test responsive behavior
7. ✅ Remove duplicate className patterns
