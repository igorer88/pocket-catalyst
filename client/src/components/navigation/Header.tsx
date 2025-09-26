import { useNavigate } from 'react-router-dom'
import {
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
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

import { env } from '@/config'
import { useTheme } from '@/hooks/useTheme'
import { useAuthStore, useGlobalStore } from '@/stores'

import { AcmeLogo } from './Sidebar'

const Header = () => {
  const [theme, toggleTheme] = useTheme()
  const toggleSidebar = useGlobalStore(state => state.toggleSidebar)
  const toggleMobileSidebar = useGlobalStore(state => state.toggleMobileSidebar)
  const isSidebarCollapsed = useGlobalStore(state => state.isSidebarCollapsed)
  const logout = useAuthStore(state => state.logout)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
  }

  const handleSettings = () => {
    void navigate('/dashboard/settings')
    if (!isSidebarCollapsed) {
      toggleSidebar()
    }
  }

  return (
    <>
      <div className="hidden md:flex items-center px-2 border-b border-divider h-[65px]">
        <Button
          isIconOnly
          variant="light"
          onPress={toggleSidebar}
          aria-label="Toggle sidebar"
          className="text-foreground"
        >
          {isSidebarCollapsed ? (
            <ChevronDoubleRightIcon className="w-5 h-5" />
          ) : (
            <ChevronDoubleLeftIcon className="w-5 h-5" />
          )}
        </Button>
      </div>
      <Navbar className="sticky top-0 z-50 backdrop-blur-md bg-transparent border-b border-divider flex-1">
        <NavbarContent justify="start" className="pl-0">
          <NavbarItem className="md:hidden">
            <Button
              isIconOnly
              variant="light"
              onPress={() => toggleMobileSidebar()}
              aria-label="Open sidebar"
              className="text-foreground"
            >
              <Bars3Icon className="w-6 h-6" />
            </Button>
          </NavbarItem>
          <NavbarBrand className="md:hidden">
            <AcmeLogo />
            <p className="font-bold text-inherit ml-2">{env.APP_NAME}</p>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent justify="end">
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
