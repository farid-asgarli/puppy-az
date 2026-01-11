/**
 * Generate page numbers array with ellipsis for pagination
 * @param currentPage Current active page (1-indexed)
 * @param totalPages Total number of pages
 * @param maxVisible Maximum visible page numbers
 * @returns Array of page numbers and ellipsis strings
 */
export function getPageNumbers(currentPage: number, totalPages: number, maxVisible: number = 5): (number | string)[] {
  const pages: (number | string)[] = [];

  // If total pages fit within maxVisible, show all
  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Calculate which pages to show
  if (currentPage <= 3) {
    // Near the start
    for (let i = 1; i <= 4; i++) pages.push(i);
    pages.push('...');
    pages.push(totalPages);
  } else if (currentPage >= totalPages - 2) {
    // Near the end
    pages.push(1);
    pages.push('...');
    for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
  } else {
    // In the middle
    pages.push(1);
    pages.push('...');
    pages.push(currentPage - 1);
    pages.push(currentPage);
    pages.push(currentPage + 1);
    pages.push('...');
    pages.push(totalPages);
  }

  return pages;
}
