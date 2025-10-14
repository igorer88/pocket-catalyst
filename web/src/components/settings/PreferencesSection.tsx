import { useTranslation } from 'react-i18next'

function PreferencesSection(): React.JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="p-4">{t('pages.settings.appAppearanceDescription')}</div>
  )
}

export default PreferencesSection
