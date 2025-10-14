import { useTranslation } from 'react-i18next'
import { Button, Spinner } from '@heroui/react'

import { User } from '@/@types'
import { useSecurityStore } from '@/stores/securityStore'

interface SecuritySectionProps {
  user: User | null
}

function SecuritySection({
  user: _user
}: SecuritySectionProps): React.JSX.Element {
  const {
    settings: securitySettings,
    isLoading: securityLoading,
    error: securityError
  } = useSecurityStore()
  const { t } = useTranslation()

  return (
    <div className="space-y-4 p-4">
      {securityLoading ? (
        <div className="flex justify-center">
          <Spinner size="sm" />
          <span className="ml-2 text-sm">
            {t('pages.settings.loadingSecurity')}
          </span>
        </div>
      ) : securityError ? (
        <div className="text-red-600 text-sm">
          {t('pages.settings.securityError')} {securityError}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">
                {t('pages.settings.changePassword')}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('pages.settings.changePasswordDescription')}
              </p>
            </div>
            <Button size="sm" variant="bordered">
              {t('pages.settings.changePassword')}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">
                {t('pages.settings.activeSessions')}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {securitySettings?.activeSessions || 0}{' '}
                {t('pages.settings.sessionsActive')}
              </p>
            </div>
            <Button size="sm" variant="bordered">
              {t('pages.settings.manageSessions')}
            </Button>
          </div>
          <pre className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-md overflow-auto text-xs">
            {JSON.stringify(securitySettings, null, 2)}
          </pre>
        </>
      )}
    </div>
  )
}

export default SecuritySection
