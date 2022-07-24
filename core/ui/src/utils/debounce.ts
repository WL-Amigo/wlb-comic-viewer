export const createDebouncedFn = <FunctionType extends (...args: never[]) => void>(
  fn: FunctionType,
  waitMs: number,
): ((...args: Parameters<FunctionType>) => void) => {
  let timeoutId: number;
  return (...args: Parameters<FunctionType>) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), waitMs);
  };
};
