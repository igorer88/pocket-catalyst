import { useNavigate } from 'react-router-dom'
import {
  ArrowLeftStartOnRectangleIcon,
  BellIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem
} from '@heroui/react'

import { AcmeLogo } from '@/components/logos/AcmeLogo'
import { environment } from '@/config'
import { useAuthStore } from '@/stores'

const Header = (): React.JSX.Element => {
  const logout = useAuthStore(state => state.logout)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const navigate = useNavigate()

  const handleLogout = (): void => {
    logout()
  }

  const handleSettings = (): void => {
    void navigate('/dashboard/settings')
  }

  const handleNotifications = (): void => {
    // TODO: Implement notifications functionality
    console.log('Notifications clicked')
  }

  return (
    <>
      <Navbar className="sticky top-0 z-50 backdrop-blur-md bg-transparent border-b border-divider w-full">
        <NavbarBrand className="md:hidden">
          <AcmeLogo />
          <p className="font-bold text-inherit ml-2">{environment.APP_NAME}</p>
        </NavbarBrand>
        <NavbarContent justify="end">
          {isAuthenticated && (
            <NavbarItem className="hidden">
              <Button
                isIconOnly
                variant="light"
                onPress={handleNotifications}
                aria-label="Notifications"
                className="text-foreground"
              >
                <BellIcon className="w-5 h-5" />
              </Button>
            </NavbarItem>
          )}
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
