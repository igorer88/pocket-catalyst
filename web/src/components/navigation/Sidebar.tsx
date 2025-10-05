import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { AnimatePresence, motion } from 'framer-motion'

import { environment } from '@/config'
import { useIsTablet } from '@/hooks/useMediaQuery'
import { getNavigationLinks } from '@/router/NavigationLinks'
import { useGlobalStore } from '@/stores'
import { classNames } from '@/utils'

import SidebarItemIcon from './SidebarItemIcon'

export const AcmeLogo = () => {
  return (
    <svg
      fill="none"
      height="36"
      viewBox="0 0 32 32"
      width="36"
      className="text-primary"
    >
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  )
}

const Sidebar = () => {
  const location = useLocation()
  const { t } = useTranslation()

  const isSidebarCollapsed = useGlobalStore(state => state.isSidebarCollapsed)
  const toggleSidebar = useGlobalStore(state => state.toggleSidebar)
  const isTablet = useIsTablet()

  const [openSubmenus, setOpenSubmenus] = useState<string[]>(() => {
    const activeParentOnLoad = getNavigationLinks(t).find(
      item =>
        item.children &&
        item.children.some(child => location.pathname.startsWith(child.href))
    )
    return activeParentOnLoad ? [activeParentOnLoad.name] : []
  })

  useEffect(() => {
    const activeParent = getNavigationLinks(t).find(
      item =>
        item.children &&
        item.children.some(child => location.pathname.startsWith(child.href))
    )
    setOpenSubmenus(activeParent ? [activeParent.name] : [])
  }, [location.pathname, t])

  const toggleSubmenu = (name: string): void => {
    setOpenSubmenus(prevOpenSubmenus => {
      return prevOpenSubmenus.includes(name)
        ? prevOpenSubmenus.filter(n => n !== name)
        : [name]
    })
  }

  return (
    <div className="flex flex-col h-full relative">
      {isSidebarCollapsed && !isTablet && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20
          }}
        >
          <Button
            isIconOnly
            variant="light"
            onPress={toggleSidebar}
            aria-label="Expand sidebar"
            className="absolute -right-3 top-[33px] z-10 bg-content1 border border-divider shadow-sm text-foreground"
            size="sm"
          >
            <ChevronDoubleRightIcon className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
      <div
        className={classNames(
          'flex items-center py-4 mb-4',
          isSidebarCollapsed ? 'px-2 justify-center' : 'px-6 justify-between'
        )}
      >
        <div
          className={classNames(
            'flex items-center',
            isSidebarCollapsed ? '' : 'gap-2'
          )}
        >
          <AcmeLogo />
          <AnimatePresence>
            {!isSidebarCollapsed && (
              <motion.h1
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { delay: 0.1, duration: 0.2 }
                }}
                exit={{ opacity: 0, x: -10, transition: { duration: 0.1 } }}
                className="text-xl font-bold text-foreground whitespace-nowrap"
              >
                {environment.APP_NAME}
              </motion.h1>
            )}
          </AnimatePresence>
        </div>
        {!isSidebarCollapsed && !isTablet && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20
            }}
          >
            <Button
              isIconOnly
              variant="light"
              onPress={toggleSidebar}
              aria-label="Collapse sidebar"
              className="text-foreground"
              size="sm"
            >
              <ChevronDoubleLeftIcon className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </div>
      <nav className="flex flex-col space-y-2 flex-1 p-4">
        {getNavigationLinks(t).map(item => {
          const hasChildren =
            (item.children && item.children.length > 0) || false
          const isSubmenuOpen = openSubmenus.includes(item.name)
          const isParentActive =
            location.pathname === item.href ||
            (hasChildren &&
              item.children!.some(child =>
                location.pathname.startsWith(child.href)
              ))

          return (
            <div key={item.name}>
              <NavLink
                to={item.href}
                className={classNames(
                  isParentActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-foreground hover:bg-content3',
                  'group flex items-center text-sm rounded-lg transition-colors',
                  isSidebarCollapsed
                    ? 'justify-center w-12 h-12 p-0'
                    : 'px-4 mx-4 py-2 gap-3'
                )}
                end={!hasChildren}
              >
                <SidebarItemIcon
                  iconDefinition={item.icon}
                  isParentActive={isParentActive}
                  isSidebarCollapsed={isSidebarCollapsed}
                />
                <AnimatePresence>
                  {!isSidebarCollapsed && (
                    <motion.div
                      className="flex-1 flex items-center justify-between"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{
                        opacity: 1,
                        width: 'auto',
                        transition: { delay: 0.1, duration: 0.2 }
                      }}
                      exit={{
                        opacity: 0,
                        width: 0,
                        transition: { duration: 0.1 }
                      }}
                    >
                      <span className="whitespace-nowrap">{item.name}</span>
                      {hasChildren && (
                        <button
                          type="button"
                          onClick={e => {
                            e.preventDefault()
                            toggleSubmenu(item.name)
                          }}
                          className="ml-auto text-current hover:text-primary p-1 rounded-full transition-colors cursor-pointer"
                          aria-label={
                            isSubmenuOpen
                              ? t('components.sidebar.collapseSubmenu')
                              : t('components.sidebar.expandSubmenu')
                          }
                        >
                          {isSubmenuOpen ? (
                            <ChevronUpIcon className="h-4 w-4" />
                          ) : (
                            <ChevronDownIcon className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </NavLink>

              <AnimatePresence>
                {hasChildren && isSubmenuOpen && !isSidebarCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col pl-8 space-y-1 mt-1 overflow-hidden"
                  >
                    {item.children!.map(child => (
                      <NavLink
                        key={child.name}
                        to={child.href}
                        className={({ isActive: isChildActive }) =>
                          classNames(
                            isChildActive
                              ? 'text-primary font-semibold'
                              : 'text-foreground hover:text-primary',
                            'flex items-center py-2 text-sm rounded-lg px-3 transition-colors'
                          )
                        }
                        end
                      >
                        <span>{child.name}</span>
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar
