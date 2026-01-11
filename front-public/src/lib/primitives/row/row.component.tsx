import { cn } from '@/lib/external/utils';
import type { JSX, JSXElementConstructor } from 'react';
import React from 'react';

export type RowProps = {
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  wrap?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  fullSize?: boolean;
  as?: keyof JSX.IntrinsicElements | JSXElementConstructor<any>;
};

const Row: React.FC<React.ComponentProps<'div'> & RowProps> = ({
  className,
  gap,
  justify,
  align,
  wrap,
  fullHeight,
  fullSize,
  fullWidth,
  as = 'div',
  ...props
}) => {
  const gapMap = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const justifyMap = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const alignMap = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch',
  };

  const wrapClass = wrap ? 'flex-wrap' : 'flex-nowrap';

  const baseClasses = 'flex flex-row';
  const utilityClasses = cn(
    gap && gapMap[gap],
    justify && justifyMap[justify],
    align && alignMap[align],
    fullWidth && 'w-full',
    fullHeight && 'h-full',
    fullSize && 'size-full',
    wrapClass
  );

  return React.createElement(as, {
    className: cn(baseClasses, utilityClasses, className),
    ...props,
  });
};

export default Row;
