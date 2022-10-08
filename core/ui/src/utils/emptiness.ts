export const isNotNullOrUndefined = <T>(v: T | null | undefined): v is T => v !== null && v !== undefined;

export const isNotNullOrEmptyString = (v: string | null | undefined): v is string =>
  isNotNullOrUndefined(v) && v.length > 0;
