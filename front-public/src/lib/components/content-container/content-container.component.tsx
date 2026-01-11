import { cn } from '@/lib/external/utils';
import React from 'react';

export default function ContentContainer({
  className,
  as = 'div',
  ...props
}: React.ComponentPropsWithoutRef<'div'> & { as?: keyof React.JSX.IntrinsicElements | React.JSXElementConstructor<any> }) {
  return React.createElement(as, {
    className: cn('sm:px-8 md:px-12 px-4 max-w-[1820px] mx-auto py-2', className),
    ...props,
  });
}
