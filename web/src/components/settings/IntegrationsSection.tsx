import { useTranslation } from 'react-i18next'

function IntegrationsSection(): React.JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="p-4">{t('pages.settings.bankAccountsDescription')}</div>
  )
}

export default IntegrationsSection
