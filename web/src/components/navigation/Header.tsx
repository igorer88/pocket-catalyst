import { useNavigate } from 'react-router-dom'
import {
  ArrowLeftStartOnRectangleIcon,
  Cog6ToothIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline'
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem
} from '@heroui/react'

import { environment } from '@/config'
import { useTheme } from '@/hooks/useTheme'
import { useAuthStore } from '@/stores'

import { AcmeLogo } from './Sidebar'

const Header = () => {
  const [theme, toggleTheme] = useTheme()
  const logout = useAuthStore(state => state.logout)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
  }

  const handleSettings = () => {
    void navigate('/dashboard/settings')
  }

  return (
    <>
      <Navbar className="sticky top-0 z-50 backdrop-blur-md bg-transparent border-b border-divider w-full">
        <NavbarBrand className="md:hidden">
          <AcmeLogo />
          <p className="font-bold text-inherit ml-2">{environment.APP_NAME}</p>
        </NavbarBrand>
        <NavbarContent className="ml-auto" justify="end">
          <NavbarItem>
            <Button
              isIconOnly
              variant="light"
              onPress={toggleTheme}
              aria-label={
                theme === 'light'
                  ? 'Switch to dark theme'
                  : 'Switch to light theme'
              }
              className="text-foreground"
            >
              {theme === 'light' ? (
                <MoonIcon className="w-5 h-5" />
              ) : (
                <SunIcon className="w-5 h-5" />
              )}
            </Button>
          </NavbarItem>
          {isAuthenticated && (
            <NavbarItem>
              <Button
                isIconOnly
                variant="light"
                onPress={handleSettings}
                aria-label="Settings"
                className="text-foreground"
              >
                <Cog6ToothIcon className="w-5 h-5" />
              </Button>
            </NavbarItem>
          )}
          {isAuthenticated && (
            <NavbarItem>
              <Button
                isIconOnly
                variant="light"
                onPress={handleLogout}
                aria-label="Logout"
                className="text-foreground"
              >
                <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
              </Button>
            </NavbarItem>
          )}
        </NavbarContent>
      </Navbar>
    </>
  )
}
export default Header
