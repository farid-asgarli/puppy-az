import { FilterViewProps } from '@/lib/components/filters/types/filter-shared-props';
import { Heading } from '@/lib/primitives/typography';
import { useTranslations } from 'next-intl';
import { Drawer } from 'vaul';

export const FilterDrawer: React.FC<FilterViewProps> = ({ isOpen, onClose, filterContent }) => {
  const t = useTranslations('filters');
  const tAccessibility = useTranslations('accessibility');

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content
          className="bg-white flex flex-col rounded-t-[10px] h-[85vh] mt-24 fixed bottom-0 left-0 right-0 z-50"
          aria-describedby="filter-description"
        >
          {/* Drawer.Title must come before other content for accessibility */}
          <Drawer.Title asChild>
            <div className="sr-only">
              <Heading variant="subsection" as="h2">
                {t('applyFilters')}
              </Heading>
            </div>
          </Drawer.Title>
          <Drawer.Description id="filter-description" className="sr-only">
            {tAccessibility('filterOptionsDescription')}
          </Drawer.Description>

          <div className="flex flex-col h-full overflow-hidden">
            {/* Drawer handle and visible header */}
            <div className="pt-2 pb-4 px-6 border-b border-gray-200">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-4" />
              <div className="text-center text-xl font-semibold" aria-hidden="true">
                {t('applyFilters')}
              </div>
            </div>
            {filterContent}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
