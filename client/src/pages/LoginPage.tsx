import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { Button, Card, CardBody, CardHeader, Input } from '@heroui/react'

import { useAuthStore } from '@/stores/authStore'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

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

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex justify-center">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Login
        </h1>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Username or Email"
            type="text"
            value={username}
            onValueChange={setUsername}
            placeholder="Enter your username or email"
            isRequired
            fullWidth
            classNames={{
              input: 'dark:text-white',
            }}
          />
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onValueChange={setPassword}
            placeholder="Enter your password"
            isRequired
            fullWidth
            classNames={{
              input: 'dark:text-white',
            }}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5 text-gray-500" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-gray-500" />
                )}
              </button>
            }
          />
          {error && <p className="text-danger text-sm">{error}</p>}
          <Button type="submit" color="primary" isLoading={isLoading} fullWidth>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </CardBody>
    </Card>
  )
}

export default LoginPage
