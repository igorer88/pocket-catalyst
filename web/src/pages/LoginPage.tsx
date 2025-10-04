import { FormEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { Button, Card, CardBody, CardHeader, Chip, Input } from '@heroui/react'

import { environment } from '@/config'
import { useAuthStore } from '@/stores/authStore'

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { t } = useTranslation()

  const togglePasswordVisibility = (): void => setShowPassword(!showPassword)

  const { error, isLoading, isAuthenticated, login } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      void navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void login(username, password)
  }

  const handleDemoLogin = (): void => {
    setUsername('demo')
    setPassword('demo')
    void login('demo', 'demo')
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex justify-center">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          {t('pages.login.title')}
        </h1>
      </CardHeader>
      <CardBody>
        {environment.isDevelopment && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <Chip size="sm" color="primary" variant="flat">
                  {t('pages.login.devMode')}
                </Chip>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  {t('pages.login.demoCredentials')}
                </p>
              </div>
              <Button
                size="sm"
                color="primary"
                variant="light"
                onPress={handleDemoLogin}
                isDisabled={isLoading}
              >
                {t('pages.login.quickDemo')}
              </Button>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label={t('pages.login.usernameOrEmail')}
            type="text"
            value={username}
            onValueChange={setUsername}
            placeholder={t('pages.login.usernamePlaceholder')}
            isRequired
          />
          <Input
            label={t('pages.login.password')}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onValueChange={setPassword}
            placeholder={t('pages.login.passwordPlaceholder')}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={t(
                  showPassword
                    ? 'pages.login.hidePassword'
                    : 'pages.login.showPassword'
                )}
              >
                {showPassword ? (
                  <EyeSlashIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            isRequired
          />
          {error && (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          )}
          <Button
            color="primary"
            type="submit"
            className="w-full"
            isLoading={isLoading}
            isDisabled={!username.trim() || !password.trim()}
          >
            {isLoading ? t('pages.login.loggingIn') : t('pages.login.title')}
          </Button>
        </form>
      </CardBody>
    </Card>
  )
}

export default LoginPage
