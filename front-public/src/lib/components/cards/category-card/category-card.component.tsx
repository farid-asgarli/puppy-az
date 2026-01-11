import { cn } from '@/lib/external/utils';
import Link, { LinkProps } from 'next/link';

interface CategoryCardProps {
  // status: React.ReactNode;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  icon: string;
  iconColor?: string;
  bgColor?: string;
  count?: number;
  id: number;
}

export default function CategoryCard({
  itemProps,
  className,
  ...props
}: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps & {
    children?: React.ReactNode | undefined;
  } & React.RefAttributes<HTMLAnchorElement> & { itemProps: CategoryCardProps }) {
  return (
    <Link {...props} className={cn('focus-ring block no-underline', className)}>
      <div className="p-6 rounded-xl bg-white border border-gray-200 text-gray-800 transition-all duration-200  hover:border-gray-300">
        {/* Status Badge */}
        {/* <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide bg-gray-100 text-gray-600 mb-4">
          {itemProps.status}
        </div> */}

        {/* Icon or Image Container */}
        <div className="flex justify-center mb-6">
          <div
            className={cn(
              'w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-200',
              itemProps.bgColor || 'bg-primary-50'
            )}
            dangerouslySetInnerHTML={{ __html: itemProps.icon }}
          />
        </div>

        {/* Title */}
        <div className="mb-2 text-center">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors duration-200">{itemProps.title}</h3>
        </div>

        {/* Subtitle and Count */}
        <div className="text-center space-y-1">
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-1">{itemProps.subtitle}</p>

          {itemProps.count !== undefined && (
            <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
              <span>{itemProps.count.toLocaleString()} elan</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
