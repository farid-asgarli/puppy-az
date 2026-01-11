export interface RichTextRendererProps {
  /**
   * Markdown-like content to render
   * Supports:
   * - **Bold headings** (wrapped in **)
   * - • Bullet lists (lines starting with •)
   * - Regular paragraphs (separated by \n\n)
   */
  content: string;
  /**
   * Optional className for the container
   */
  className?: string;
}
