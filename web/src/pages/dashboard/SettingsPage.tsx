import { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Card, CardBody, CardHeader, Chip, Spinner } from '@heroui/react'

import { useProfileStore } from '@/stores/profileStore'

function SettingsPage() {
  const { profile, isLoading, error, fetchProfile } = useProfileStore()
  const intl = useIntl()

  useEffect(() => {
    void fetchProfile()
  }, [fetchProfile])

  return (
    <Card>
      <CardHeader>
        <h1 className="text-xl font-semibold">
          <FormattedMessage id="pages.settings.title" />
        </h1>
      </CardHeader>
      <CardBody>
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <Spinner
              label={intl.formatMessage({
                id: 'pages.settings.loadingProfile'
              })}
            />
          </div>
        )}
        {error && (
          <div className="text-danger p-4 bg-danger-50 rounded-md">
            <p className="font-semibold">
              <FormattedMessage id="pages.settings.error" />
            </p>
            <p>{error}</p>
          </div>
        )}
        {profile && !isLoading && !error && (
          <div className="space-y-4">
            <p>
              <strong>
                <FormattedMessage id="pages.settings.username" />
              </strong>{' '}
              {profile.username}
            </p>
            <p>
              <strong>
                <FormattedMessage id="pages.settings.displayCurrency" />
              </strong>{' '}
              <Chip color="primary" variant="flat">
                {profile.display_currency}
              </Chip>
            </p>
          </div>
        )}{' '}
      </CardBody>
    </Card>
  )
}

export default SettingsPage
