// Filter enums
export enum LogicalOperator {
  AND_ALSO = 0,
  OR_ELSE = 1,
}

export enum FilterEquation {
  EQUALS = 0,
  NOT_EQUALS = 1,
  CONTAINS = 2,
  STARTS_WITH = 3,
  ENDS_WITH = 4,
  BIGGER = 5,
  BIGGER_EQUALS = 6,
  SMALLER = 7,
  SMALLER_EQUALS = 8,
  EMPTY = 9,
  NOT_EMPTY = 10,
}

// Search types
export interface FilterEntry {
  key: string;
  value: any;
  equation: FilterEquation;
}

export interface SearchFilter {
  entries: FilterEntry[];
  logicalOperator: LogicalOperator;
}

export interface PaginationParams {
  number: number;
  size: number;
}

export interface QuerySpecification {
  filter?: SearchFilter;
  pagination?: PaginationParams;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
