const resolveStringEnv = (value: unknown): string | undefined => {
  return value === null || value === undefined ? undefined : String(value);
}

export const Environments = {
  ApiHost: resolveStringEnv(import.meta.env.VITE_APP_API_HOST) ?? window.location.origin
} as const;