import { cn } from '@/lib/external/utils';
import Row, { RowProps } from '@/lib/primitives/row/row.component';

const Column: React.FC<React.ComponentProps<'div'> & RowProps> = ({ className, ...props }) => {
  return <Row className={cn(className, 'flex-col')} {...props} />;
};

export default Column;
