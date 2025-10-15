import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Select, SelectItem } from '@heroui/react'

import { User } from '@/@types'
import { useProfileStore } from '@/stores/profileStore'

interface AppAppearanceSectionProps {
  user: User | null
}

function AppAppearanceSection({
  user
}: AppAppearanceSectionProps): React.JSX.Element {
  const { t } = useTranslation()
  const { profile, updateProfile } = useProfileStore()

  const [formData, setFormData] = useState({
    theme: 'auto',
    schema: 'default'
  })
  const [isSaving, setIsSaving] = useState(false)

  // Load current values from profile
  useEffect(() => {
    if (profile?.extraSettings && typeof profile.extraSettings === 'object') {
      const appPreferences = (profile.extraSettings as Record<string, unknown>)
        ?.appPreferences as Record<string, unknown> | undefined
      if (appPreferences) {
        const { theme, schema } = appPreferences as {
          theme?: string
          schema?: string
        }
        setFormData({
          theme: theme || 'auto',
          schema: schema || 'default'
        })
      }
    }
  }, [profile])

  const handleInputChange = (field: string, value: string): void => {
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
            ...formData
          }
        }
      })
    } catch (error) {
      console.error('Error saving app appearance settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = (): void => {
    if (profile?.extraSettings && typeof profile.extraSettings === 'object') {
      const appPreferences = (profile.extraSettings as Record<string, unknown>)
        ?.appPreferences as Record<string, unknown> | undefined
      if (appPreferences) {
        const { theme, schema } = appPreferences as {
          theme?: string
          schema?: string
        }
        setFormData({
          theme: theme || 'auto',
          schema: schema || 'default'
        })
      }
    }
  }

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label={t('pages.settings.theme')}
          placeholder={t('pages.settings.selectTheme')}
          selectedKeys={[formData.theme]}
          onSelectionChange={keys => {
            const selected = Array.from(keys)[0] as string
            handleInputChange('theme', selected)
          }}
        >
          <SelectItem key="auto">{t('pages.settings.auto')}</SelectItem>
          <SelectItem key="light">{t('pages.settings.light')}</SelectItem>
          <SelectItem key="dark">{t('pages.settings.dark')}</SelectItem>
        </Select>
        <Select
          label={t('pages.settings.schema')}
          placeholder={t('pages.settings.selectSchema')}
          selectedKeys={[formData.schema]}
          onSelectionChange={keys => {
            const selected = Array.from(keys)[0] as string
            handleInputChange('schema', selected)
          }}
        >
          <SelectItem key="default">{t('pages.settings.default')}</SelectItem>
        </Select>
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

export default AppAppearanceSection
