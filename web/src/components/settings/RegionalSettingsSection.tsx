import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Select, SelectItem } from '@heroui/react'

import { User } from '@/@types'
import { changeLanguage } from '@/i18n'

interface RegionalSettingsSectionProps {
  user: User | null
}

function RegionalSettingsSection({
  user: _user
}: RegionalSettingsSectionProps): React.JSX.Element {
  const { t } = useTranslation()
  const selectedLang = localStorage.getItem('language') || 'en'

  const [formData, setFormData] = useState({
    language: selectedLang,
    displayCurrency: 'USD',
    locale: 'en-US',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY'
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = (field: string, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLanguageChange = (language: string): void => {
    setFormData(prev => ({ ...prev, language }))
  }

  const handleSave = async (): Promise<void> => {
    setIsSaving(true)
    try {
      console.log('Saving regional settings:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (formData.language !== selectedLang) {
        changeLanguage(formData.language)
      }
    } catch (error) {
      console.error('Error saving regional settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = (): void => {
    setFormData({
      language: selectedLang,
      displayCurrency: 'USD',
      locale: 'en-US',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY'
    })
  }

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label={t('pages.settings.language')}
          placeholder={t('pages.settings.selectLanguage')}
          selectedKeys={[formData.language]}
          onSelectionChange={keys => {
            const selected = Array.from(keys)[0] as string
            handleLanguageChange(selected)
          }}
        >
          <SelectItem key="en">English</SelectItem>
          <SelectItem key="es">Español</SelectItem>
        </Select>
        <Select
          label={t('pages.settings.currency')}
          placeholder={t('pages.settings.selectCurrency')}
          selectedKeys={[formData.displayCurrency]}
          onSelectionChange={keys => {
            const selected = Array.from(keys)[0] as string
            handleInputChange('displayCurrency', selected)
          }}
        >
          <SelectItem key="USD">USD</SelectItem>
          <SelectItem key="EUR">EUR</SelectItem>
        </Select>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Select
          label={t('pages.settings.locale')}
          placeholder={t('pages.settings.selectLocale')}
          selectedKeys={[formData.locale]}
          onSelectionChange={keys => {
            const selected = Array.from(keys)[0] as string
            handleInputChange('locale', selected)
          }}
        >
          <SelectItem key="en-US">English (US)</SelectItem>
          <SelectItem key="es-ES">Español (ES)</SelectItem>
          <SelectItem key="fr-FR">Français</SelectItem>
          <SelectItem key="de-DE">Deutsch</SelectItem>
        </Select>
        <Select
          label={t('pages.settings.timezone')}
          placeholder={t('pages.settings.selectTimezone')}
          selectedKeys={[formData.timezone]}
          onSelectionChange={keys => {
            const selected = Array.from(keys)[0] as string
            handleInputChange('timezone', selected)
          }}
        >
          <SelectItem key="UTC">UTC</SelectItem>
          <SelectItem key="America/New_York">Eastern Time</SelectItem>
          <SelectItem key="America/Chicago">Central Time</SelectItem>
          <SelectItem key="America/Denver">Mountain Time</SelectItem>
          <SelectItem key="America/Los_Angeles">Pacific Time</SelectItem>
          <SelectItem key="Europe/London">London</SelectItem>
          <SelectItem key="Europe/Paris">Paris</SelectItem>
          <SelectItem key="Asia/Tokyo">Tokyo</SelectItem>
        </Select>
        <Select
          label={t('pages.settings.dateFormat')}
          placeholder={t('pages.settings.selectDateFormat')}
          selectedKeys={[formData.dateFormat]}
          onSelectionChange={keys => {
            const selected = Array.from(keys)[0] as string
            handleInputChange('dateFormat', selected)
          }}
        >
          <SelectItem key="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
          <SelectItem key="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
          <SelectItem key="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
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
      <pre className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-md overflow-auto text-xs">
        {JSON.stringify(formData, null, 2)}
      </pre>
    </div>
  )
}

export default RegionalSettingsSection
