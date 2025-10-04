import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardBody, CardHeader, Chip, Spinner } from '@heroui/react'

import { useProfileStore } from '@/stores/profileStore'

function SettingsPage() {
  const { profile, isLoading, error, fetchProfile } = useProfileStore()
  const { t } = useTranslation()

  useEffect(() => {
    void fetchProfile()
  }, [fetchProfile])

  return (
    <Card>
      <CardHeader>
        <h1 className="text-xl font-semibold">{t('pages.settings.title')}</h1>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <div className="flex justify-center">
            <Spinner />
            <span className="ml-2">{t('pages.settings.loadingProfile')}</span>
          </div>
        ) : error ? (
          <div className="text-red-600">
            {t('pages.settings.error')} {error}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('pages.settings.username')}
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {profile?.username || t('common.notAvailable')}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('pages.settings.displayCurrency')}
              </label>
              <div className="mt-1">
                <Chip color="primary" variant="flat">
                  {profile?.displayCurrency || t('common.notAvailable')}
                </Chip>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default SettingsPage
