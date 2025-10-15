import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Switch } from '@heroui/react'

import { User } from '@/@types'
import { useProfileStore } from '@/stores/profileStore'

interface NotificationSectionProps {
  user: User | null
}

function NotificationSection({
  user
}: NotificationSectionProps): React.JSX.Element {
  const { t } = useTranslation()
  const { profile, updateProfile } = useProfileStore()

  const [formData, setFormData] = useState({
    push: true,
    email: false,
    sms: false
  })
  const [isSaving, setIsSaving] = useState(false)

  // Load current values from profile
  useEffect(() => {
    if (profile?.extraSettings && typeof profile.extraSettings === 'object') {
      const appPreferences = (profile.extraSettings as Record<string, unknown>)
        ?.appPreferences
      if (appPreferences && typeof appPreferences === 'object') {
        const notifications = (appPreferences as Record<string, unknown>)
          ?.notifications
        if (notifications && typeof notifications === 'object') {
          const { push, email, sms } = notifications as {
            push?: boolean
            email?: boolean
            sms?: boolean
          }
          setFormData({
            push: push ?? true,
            email: email ?? false,
            sms: sms ?? false
          })
        }
      }
    }
  }, [profile])

  const handleInputChange = (field: string, value: boolean): void => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async (): Promise<void> => {
    if (!user?.id) return

    setIsSaving(true)
    try {
      const currentExtraSettings = profile?.extraSettings || {}
      const currentAppPreferences =
        (currentExtraSettings as Record<string, unknown>)?.appPreferences || {}

      await updateProfile(user.id, {
        extraSettings: {
          ...currentExtraSettings,
          appPreferences: {
            ...currentAppPreferences,
            notifications: {
              ...((currentAppPreferences as Record<string, unknown>)
                ?.notifications || {}),
              ...formData
            }
          }
        }
      })
    } catch (error) {
      console.error('Error saving notification settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = (): void => {
    if (profile?.extraSettings && typeof profile.extraSettings === 'object') {
      const appPreferences = (profile.extraSettings as Record<string, unknown>)
        ?.appPreferences
      if (appPreferences && typeof appPreferences === 'object') {
        const notifications = (appPreferences as Record<string, unknown>)
          ?.notifications
        if (notifications && typeof notifications === 'object') {
          const { push, email, sms } = notifications as {
            push?: boolean
            email?: boolean
            sms?: boolean
          }
          setFormData({
            push: push ?? true,
            email: email ?? false,
            sms: sms ?? false
          })
        }
      }
    }
  }

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-4">
        <Switch
          className="mx-4"
          isSelected={formData.push}
          onValueChange={value => handleInputChange('push', value)}
        >
          {t('pages.settings.pushNotifications')}
        </Switch>
        <Switch
          className="mx-4"
          isSelected={formData.email}
          onValueChange={value => handleInputChange('email', value)}
        >
          {t('pages.settings.emailNotifications')}
        </Switch>
        <Switch
          className="mx-4"
          isSelected={formData.sms}
          onValueChange={value => handleInputChange('sms', value)}
        >
          {t('pages.settings.smsNotifications')}
        </Switch>
      </div>
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
    </div>
  )
}

export default NotificationSection
