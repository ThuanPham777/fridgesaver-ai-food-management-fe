export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
  appName: (import.meta.env.VITE_APP_NAME as string) ?? 'MyApp',
  appEnv: (import.meta.env.VITE_APP_ENV as string) ?? 'development',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;
