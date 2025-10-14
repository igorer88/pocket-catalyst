import { useTranslation } from 'react-i18next'

function NotificationSection(): React.JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="p-4">{t('pages.settings.notificationsDescription')}</div>
  )
}

export default NotificationSection
