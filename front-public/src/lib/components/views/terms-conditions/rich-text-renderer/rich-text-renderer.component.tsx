import { Heading } from '@/lib/primitives/typography';
import type { RichTextRendererProps } from './rich-text-renderer.types';

/**
 * Renders markdown-like content with semantic HTML
 * Parses and displays headings (**, bold), bullet lists (•), and paragraphs
 *
 * @example
 * ```tsx
 * <RichTextRenderer content="**Heading**\n\nParagraph text\n\n• Item 1\n• Item 2" />
 * ```
 */
export const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content, className = 'prose prose-sm max-w-none' }) => {
  const renderParagraphs = () => {
    return content.split('\n\n').map((paragraph, pIndex) => {
      // Bold headings: **text**
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        const headingText = paragraph.replace(/\*\*/g, '');
        return (
          <Heading key={pIndex} variant='label' as='h4' className='mt-6 mb-3'>
            {headingText}
          </Heading>
        );
      }

      // Bullet lists: lines starting with •
      if (paragraph.startsWith('•')) {
        const listItems = paragraph.split('\n').filter((item) => item.trim());
        return (
          <ul key={pIndex} className='list-none space-y-2 my-4' role='list'>
            {listItems.map((item, iIndex) => (
              <li key={iIndex} className='flex items-start gap-2'>
                <span className='text-gray-400 mt-1 flex-shrink-0' aria-hidden='true'>
                  •
                </span>
                <span className='text-gray-700'>{item.replace('• ', '')}</span>
              </li>
            ))}
          </ul>
        );
      }

      // Regular paragraphs
      return (
        <p key={pIndex} className='text-gray-700 leading-relaxed mb-4'>
          {paragraph}
        </p>
      );
    });
  };

  return <div className={className}>{renderParagraphs()}</div>;
};

export default RichTextRenderer;
