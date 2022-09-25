export const isNotNullOrUndefined = <T>(v: T | null | undefined): v is T => v !== null && v !== undefined;
