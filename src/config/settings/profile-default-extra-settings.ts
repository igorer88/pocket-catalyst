export const defaultProfileExtraSettings = {
  regionalPreferences: {
    locale: 'en-US',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY'
  },
  appPreferences: {
    theme: 'light',
    schema: 'default',
    notifications: {
      push: true,
      email: false,
      sms: false
    }
  },
  dashboardSettings: {
    defaultView: 'overview',
    itemsPerPage: 10,
    widgetsOrder: ['balance', 'transactions', 'goals']
  }
} as const

export type DefaultProfileExtraSettings = typeof defaultProfileExtraSettings
