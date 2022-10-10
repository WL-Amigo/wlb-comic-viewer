export const isNotNullOrUndefined = <T>(v: T | null | undefined): v is T => v !== null && v !== undefined;

export const isNotNullOrEmptyString = (v: string | null | undefined): v is string =>
  isNotNullOrUndefined(v) && v.length > 0;

export const areAllValuesEmpty = (arr: unknown[]): boolean => {
  for (const item of arr) {
    if (typeof item === 'object') {
      if (item === null) {
        continue;
      }
      if (Array.isArray(item) && item.length > 0) {
        return false;
      }
      if (Object.keys(item).length > 0) {
        return false;
      }
      continue;
    }
    if (typeof item === 'undefined') {
      continue;
    }
    if (typeof item === 'string' && item === '') {
      continue;
    }
    return false;
  }
  return true;
};
