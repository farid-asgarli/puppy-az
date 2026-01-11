/**
 * Quick verification test for typography primitives
 * This file imports and uses all typography components to ensure they work
 */

import { Heading, Text, Label } from '@/lib/primitives/typography';
import type { HeadingVariant, TextVariant, LabelVariant } from '@/lib/primitives/typography';

// Type checking
const headingVariants: HeadingVariant[] = ['hero', 'page-title', 'display', 'section', 'subsection', 'card', 'label'];
const textVariants: TextVariant[] = ['body-xl', 'body-lg', 'body', 'small', 'tiny'];
const labelVariants: LabelVariant[] = ['field', 'value', 'meta', 'badge'];

export function TypographyVerification() {
  return (
    <div className='space-y-12 p-8'>
      {/* Heading Variants */}
      <section>
        <h2 className='text-2xl font-bold mb-4'>Heading Variants</h2>
        <div className='space-y-4'>
          {headingVariants.map((variant) => (
            <Heading key={variant} variant={variant}>
              {variant} - Sample Heading
            </Heading>
          ))}
        </div>
      </section>

      {/* Text Variants */}
      <section>
        <h2 className='text-2xl font-bold mb-4'>Text Variants</h2>
        <div className='space-y-4'>
          {textVariants.map((variant) => (
            <Text key={variant} variant={variant}>
              {variant} - This is sample body text showing the typography variant.
            </Text>
          ))}
        </div>
      </section>

      {/* Label Variants */}
      <section>
        <h2 className='text-2xl font-bold mb-4'>Label Variants</h2>
        <div className='space-y-4'>
          {labelVariants.map((variant) => (
            <Label key={variant} variant={variant} as='div'>
              {variant} - Sample Label
            </Label>
          ))}
        </div>
      </section>

      {/* Color Variants */}
      <section>
        <h2 className='text-2xl font-bold mb-4'>Color Variants</h2>
        <div className='space-y-2'>
          <Heading variant='subsection' color='primary'>
            Primary Color
          </Heading>
          <Heading variant='subsection' color='secondary'>
            Secondary Color
          </Heading>
          <Heading variant='subsection' color='tertiary'>
            Tertiary Color
          </Heading>
        </div>
      </section>

      {/* Weight Variants */}
      <section>
        <h2 className='text-2xl font-bold mb-4'>Weight Variants</h2>
        <div className='space-y-2'>
          <Text weight='normal'>Normal weight text</Text>
          <Text weight='medium'>Medium weight text</Text>
          <Text weight='semibold'>Semibold weight text</Text>
          <Text weight='bold'>Bold weight text</Text>
        </div>
      </section>

      {/* Combined Usage */}
      <section>
        <h2 className='text-2xl font-bold mb-4'>Real-World Example</h2>
        <div className='space-y-2'>
          <Heading variant='page-title'>Haqqımızda</Heading>
          <Text variant='body-lg'>Heyvan sevənləri üçün yaradılmış platforma</Text>
        </div>
      </section>
    </div>
  );
}

export default TypographyVerification;
