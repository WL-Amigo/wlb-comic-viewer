export const normalizePath = (path: string) => {
  let result = path;
  if (result.startsWith('/')) {
    result = result.slice(1);
  }
  if (result.endsWith('/')) {
    result = result.slice(0, -1);
  }
  result = result.replace(/\/\/+/, '/');
  return result;
};
