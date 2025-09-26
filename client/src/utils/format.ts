import { env } from '@/config'

/**
 * The `formatCurrency` function in TypeScript formats a number as a currency value.
 * It uses environment variables for locale (VITE_APP_LOCALE) and currency (VITE_APP_CURRENCY),
 * with "en-US" and "USD" as respective fallbacks.
 * @param {number} value - The `value` parameter in the `formatCurrency` function represents the
 * numerical value that you want to format as a currency.
 * @param {string} [currencyCode] - Optional. The 3-letter ISO currency code (e.g., "EUR", "JPY")
 * for the value being formatted. If not provided, it defaults to VITE_APP_CURRENCY.
 * @returns The `formatCurrency` function returns a string representation of the `value`
 * parameter formatted as a currency according to the specified or default locale and currency.
 */
export const formatCurrency = (
  value: number,
  currencyCode?: string
): string => {
  const locale = env.APP_LOCALE
  const displayCurrency = currencyCode || env.APP_CURRENCY

  return value.toLocaleString(locale, {
    style: 'currency',
    currency: displayCurrency,
  })
}
