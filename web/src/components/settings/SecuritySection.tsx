import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Input, Spinner } from '@heroui/react'

import { User } from '@/@types'
import { useSecurityStore } from '@/stores/securityStore'

interface UpdateSecuritySettingsData {
  pin?: string
  pinHint?: string
  recoveryEmail?: string
  phone?: string
}

interface SecuritySectionProps {
  user: User | null
}

function SecuritySection({ user }: SecuritySectionProps): React.JSX.Element {
  const {
    settings: securitySettings,
    isLoading: securityLoading,
    error: securityError,
    changePassword,
    updateSecuritySettings
  } = useSecurityStore()
  const { t } = useTranslation()

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  // Security settings form state
  const [securityForm, setSecurityForm] = useState({
    pin: '',
    pinHint: securitySettings?.pinHint || '',
    recoveryEmail: securitySettings?.recoveryEmail || '',
    phone: securitySettings?.phone || ''
  })
  const [isUpdatingSecurity, setIsUpdatingSecurity] = useState(false)

  const handlePasswordInputChange = (field: string, value: string): void => {
    setPasswordForm(prev => ({ ...prev, [field]: value }))
  }

  const handleChangePassword = async (): Promise<void> => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      console.error('New passwords do not match')
      return
    }

    if (!user?.id) return

    setIsChangingPassword(true)
    try {
      await changePassword(user.id, passwordForm)

      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setShowPasswordForm(false)
    } catch (error) {
      console.error('Error changing password:', error)
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleCancelPasswordChange = (): void => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setShowPasswordForm(false)
  }

  const handleSecurityInputChange = (field: string, value: string): void => {
    setSecurityForm(prev => ({ ...prev, [field]: value }))
  }

  const handleUpdateSecuritySettings = async (): Promise<void> => {
    if (!user?.id) return

    setIsUpdatingSecurity(true)
    try {
      // Filter out empty fields to only send changed fields
      const filteredData = Object.fromEntries(
        Object.entries(securityForm).filter(
          ([, value]) => value !== '' && value !== undefined && value !== null
        )
      ) as UpdateSecuritySettingsData

      if (Object.keys(filteredData).length > 0) {
        await updateSecuritySettings(user.id, filteredData)
      }
    } catch (error) {
      console.error('Error updating security settings:', error)
    } finally {
      setIsUpdatingSecurity(false)
    }
  }

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
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">
                {t('pages.settings.changePassword')}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t('pages.settings.changePasswordDescription')}
              </p>

              {!showPasswordForm ? (
                <Button
                  size="sm"
                  variant="bordered"
                  onPress={() => setShowPasswordForm(true)}
                >
                  {t('pages.settings.changePassword')}
                </Button>
              ) : (
                <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <Input
                    label={t('pages.settings.currentPassword')}
                    type="password"
                    value={passwordForm.currentPassword}
                    onValueChange={value =>
                      handlePasswordInputChange('currentPassword', value)
                    }
                  />
                  <Input
                    label={t('pages.settings.newPassword')}
                    type="password"
                    value={passwordForm.newPassword}
                    onValueChange={value =>
                      handlePasswordInputChange('newPassword', value)
                    }
                  />
                  <Input
                    label={t('pages.settings.confirmPassword')}
                    type="password"
                    value={passwordForm.confirmPassword}
                    onValueChange={value =>
                      handlePasswordInputChange('confirmPassword', value)
                    }
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="bordered"
                      onPress={handleCancelPasswordChange}
                      isDisabled={isChangingPassword}
                    >
                      {t('pages.settings.cancel')}
                    </Button>
                    <Button
                      size="sm"
                      onPress={handleChangePassword}
                      isLoading={isChangingPassword}
                    >
                      {t('pages.settings.save')}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-medium mb-2">
                {t('pages.settings.securitySettings')}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t('pages.settings.securitySettingsDescription')}
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label={t('pages.settings.pin')}
                  type="password"
                  placeholder={t('pages.settings.setPin')}
                  value={securityForm.pin}
                  onValueChange={value =>
                    handleSecurityInputChange('pin', value)
                  }
                />
                <Input
                  label={t('pages.settings.pinHint')}
                  placeholder="e.g., My favorite number"
                  value={securityForm.pinHint}
                  onValueChange={value =>
                    handleSecurityInputChange('pinHint', value)
                  }
                />
                <Input
                  label={t('pages.settings.recoveryEmail')}
                  type="email"
                  placeholder="recovery@example.com"
                  value={securityForm.recoveryEmail}
                  onValueChange={value =>
                    handleSecurityInputChange('recoveryEmail', value)
                  }
                />
                <Input
                  label={t('pages.settings.phone')}
                  type="tel"
                  placeholder="+1234567890"
                  value={securityForm.phone}
                  onValueChange={value =>
                    handleSecurityInputChange('phone', value)
                  }
                />
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  size="sm"
                  onPress={handleUpdateSecuritySettings}
                  isLoading={isUpdatingSecurity}
                >
                  {t('pages.settings.save')}
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium">
                {t('pages.settings.activeSessions')}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {securitySettings?.activeSessions || 0}{' '}
                {t('pages.settings.sessionsActive')}
              </p>
            </div>
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
