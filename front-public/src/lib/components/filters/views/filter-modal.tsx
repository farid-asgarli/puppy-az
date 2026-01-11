import { FilterViewProps } from '@/lib/components/filters/types/filter-shared-props';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/lib/external/components/ui/dialog';
import { IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export const FilterDialogModal: React.FC<FilterViewProps> = ({ isOpen, onClose, filterContent }) => {
  const t = useTranslations('filters');
  const tAccessibility = useTranslations('accessibility');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="border-b border-gray-200 p-6 relative">
          <DialogTitle className="text-xl font-semibold text-center">{t('applyFilters')}</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-6 top-6 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={tAccessibility('close')}
          >
            <IconX size={22} />
          </button>
          <DialogDescription className="sr-only">{tAccessibility('filterOptionsDescription')}</DialogDescription>
        </DialogHeader>
        {filterContent}
      </DialogContent>
    </Dialog>
  );
};
