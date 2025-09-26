const env = {
  APP_NAME: import.meta.env.VITE_APP_NAME,
  APP_LOCALE: import.meta.env.VITE_APP_LOCALE || 'en-US',
  APP_CURRENCY: import.meta.env.VITE_APP_CURRENCY || 'USD',
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
}

export default env
