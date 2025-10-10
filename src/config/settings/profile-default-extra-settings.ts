export const defaultProfileExtraSettings = {
  theme: 'dark',
  notifications: {
    push: true,
    email: false,
    sms: false
  },
  dashboard: {
    defaultView: 'overview',
    widgetsOrder: ['balance', 'transactions', 'goals'],
    itemsPerPage: 10
  },
  preferences: {
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY'
  }
} as const

export type DefaultProfileExtraSettings = typeof defaultProfileExtraSettings
