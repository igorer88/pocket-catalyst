import { useTranslation } from 'react-i18next'

import { User } from '@/@types'

interface IntegrationsSectionProps {
  user: User | null
}

function IntegrationsSection({
  user: _user
}: IntegrationsSectionProps): React.JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="p-4">{t('pages.settings.bankAccountsDescription')}</div>
  )
}

export default IntegrationsSection
