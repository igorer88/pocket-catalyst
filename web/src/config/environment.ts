const environment = {
  // App configuration - hardcoded values
  APP_NAME: 'Pocket Catalyst',
  APP_LOCALE: import.meta.env.VITE_APP_LOCALE || 'en-US',
  APP_CURRENCY: import.meta.env.VITE_APP_CURRENCY || 'USD',

  // API configuration - base URL already includes /api
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  API_VERSION: import.meta.env.VITE_API_VERSION || 'v1',

  // Development mode check
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production'
} as const

export default environment
