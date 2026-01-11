interface DividerProps {
  isExpanded: boolean;
}

/**
 * Divider component between search fields
 */
export const Divider = ({ isExpanded }: DividerProps) =>
  isExpanded ? <div className="w-px h-8 bg-gray-200" /> : <span className="block w-px h-6 bg-gray-300 max-w-px" />;
