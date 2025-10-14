import { useTranslation } from 'react-i18next'
import { Button, Input, Select, SelectItem, Spinner } from '@heroui/react'

import { User } from '@/@types'
import { useProfileStore } from '@/stores/profileStore'

interface ProfileSectionProps {
  user: User | null
}

function ProfileSection({
  user: _user
}: ProfileSectionProps): React.JSX.Element {
  const { profile, isLoading, error } = useProfileStore()
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Spinner size="sm" />
        <span className="ml-2 text-sm">
          {t('pages.settings.loadingProfile')}
        </span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-600 text-sm p-4">
        {t('pages.settings.error')} {error}
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label={t('pages.settings.firstName')}
          defaultValue={profile?.firstName || ''}
        />
        <Input
          label={t('pages.settings.lastName')}
          defaultValue={profile?.lastName || ''}
        />
      </div>
      <Input
        label={t('pages.settings.email')}
        defaultValue={profile?.email || ''}
        disabled
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label={t('pages.settings.language')}
          placeholder={t('pages.settings.selectLanguage')}
          selectedKeys={[profile?.language || 'en']}
        >
          <SelectItem key="en">English</SelectItem>
          <SelectItem key="es">Español</SelectItem>
        </Select>
        <Select
          label={t('pages.settings.currency')}
          placeholder={t('pages.settings.selectCurrency')}
          selectedKeys={[profile?.displayCurrency || 'USD']}
        >
          <SelectItem key="USD">USD</SelectItem>
          <SelectItem key="EUR">EUR</SelectItem>
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="bordered" type="button">
          {t('pages.settings.cancel')}
        </Button>
        <Button type="button">{t('pages.settings.save')}</Button>
      </div>
      <pre className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-md overflow-auto text-xs">
        {JSON.stringify(profile, null, 2)}
      </pre>
    </div>
  )
}

export default ProfileSection
