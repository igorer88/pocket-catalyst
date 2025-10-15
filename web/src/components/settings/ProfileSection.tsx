import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Input, Spinner } from '@heroui/react'

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

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: ''
  })
  const [isSaving, setIsSaving] = useState(false)

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || ''
      })
    }
  }, [profile])

  const handleInputChange = (field: string, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async (): Promise<void> => {
    setIsSaving(true)
    try {
      // TODO: Implement API call to update profile
      console.log('Saving profile:', formData)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = (): void => {
    // Reset form to original values
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || ''
      })
    }
  }

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
          value={formData.firstName}
          onValueChange={value => handleInputChange('firstName', value)}
        />
        <Input
          label={t('pages.settings.lastName')}
          value={formData.lastName}
          onValueChange={value => handleInputChange('lastName', value)}
        />
      </div>
      <Input
        label={t('pages.settings.email')}
        value={profile?.email || ''}
        disabled
      />
      <div className="flex justify-end space-x-2">
        <Button
          variant="bordered"
          type="button"
          onPress={handleCancel}
          isDisabled={isSaving}
        >
          {t('pages.settings.cancel')}
        </Button>
        <Button type="button" onPress={handleSave} isLoading={isSaving}>
          {t('pages.settings.save')}
        </Button>
      </div>
      <pre className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-md overflow-auto text-xs">
        {JSON.stringify({ formData, profile }, null, 2)}
      </pre>
    </div>
  )
}

export default ProfileSection
