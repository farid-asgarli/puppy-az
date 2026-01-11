/**
 * Utility functions for working with TypeScript enums
 */

/**
 * Gets numeric values from a TypeScript numeric enum.
 * Filters out reverse mapping string keys that TypeScript generates.
 *
 * @example
 * ```typescript
 * enum Status { Active = 1, Inactive = 2 }
 * getEnumValues(Status) // [1, 2]
 * ```
 */
export function getEnumValues<T extends Record<string, number | string>>(enumObj: T): number[] {
  return Object.values(enumObj).filter((v) => typeof v === 'number') as number[];
}

/**
 * Gets string keys from a TypeScript numeric enum.
 *
 * @example
 * ```typescript
 * enum Status { Active = 1, Inactive = 2 }
 * getEnumKeys(Status) // ['Active', 'Inactive']
 * ```
 */
export function getEnumKeys<T extends Record<string, number | string>>(enumObj: T): string[] {
  return Object.keys(enumObj).filter((k) => typeof enumObj[k as keyof T] === 'number');
}

/**
 * Checks if a value is a valid enum value.
 *
 * @example
 * ```typescript
 * enum Status { Active = 1, Inactive = 2 }
 * isValidEnumValue(Status, 1) // true
 * isValidEnumValue(Status, 99) // false
 * ```
 */
export function isValidEnumValue<T extends Record<string, number | string>>(enumObj: T, value: number | string): boolean {
  return getEnumValues(enumObj).includes(value as number);
}
