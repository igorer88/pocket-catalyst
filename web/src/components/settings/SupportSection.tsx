import { useTranslation } from 'react-i18next'

function SupportSection(): React.JSX.Element {
  const { t } = useTranslation()

  return <div className="p-4">{t('pages.settings.aboutDescription')}</div>
}

export default SupportSection
