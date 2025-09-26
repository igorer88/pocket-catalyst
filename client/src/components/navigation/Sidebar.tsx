import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

import { env } from '@/config'
import { navigationLinks } from '@/router/NavigationLinks'
import { useGlobalStore } from '@/stores'
import { classNames } from '@/utils'

import SidebarItemIcon from './SidebarItemIcon'

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
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

  const isSidebarCollapsed = useGlobalStore(state => state.isSidebarCollapsed)

  const [openSubmenus, setOpenSubmenus] = useState<string[]>(() => {
    const activeParentOnLoad = navigationLinks.find(
      item =>
        item.children &&
        item.children.some(child => location.pathname.startsWith(child.href))
    )
    return activeParentOnLoad ? [activeParentOnLoad.name] : []
  })

  useEffect(() => {
    const activeParent = navigationLinks.find(
      item =>
        item.children &&
        item.children.some(child => location.pathname.startsWith(child.href))
    )
    setOpenSubmenus(activeParent ? [activeParent.name] : [])
  }, [location.pathname])

  const toggleSubmenu = (name: string) => {
    setOpenSubmenus(prevOpenSubmenus => {
      return prevOpenSubmenus.includes(name)
        ? prevOpenSubmenus.filter(n => n !== name)
        : [name]
    })
  }

  return (
    <div className="flex flex-col h-full">
      <div
        className={classNames(
          'flex items-center py-4 mb-4 border-divider',
          isSidebarCollapsed ? 'px-2 justify-center' : 'px-3'
        )}
      >
        <AcmeLogo />
        {!isSidebarCollapsed && (
          <p className="ml-3 font-semibold text-foreground">{env.APP_NAME}</p>
        )}
      </div>
      <nav className="flex flex-col space-y-1">
        {navigationLinks.map(item => {
          const hasChildren = item.children && item.children.length > 0 || false
          const isSubmenuOpen = openSubmenus.includes(item.name)
          const isParentActive = location.pathname === item.href ||
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
                    ? 'bg-primary/70 text-primary-foreground'
                    : 'text-foreground-500 hover:bg-default-100 hover:text-foreground-700',
                  'group flex items-center py-2 text-sm font-medium rounded-md',
                  isSidebarCollapsed ? 'justify-center px-0 mx-0' : 'px-3 mx-5',
                  hasChildren && !isSidebarCollapsed ? 'justify-between' : ''
                )}
                end={!hasChildren}
              >
                <SidebarItemIcon
                  iconDefinition={item.icon}
                  isParentActive={isParentActive}
                  isSidebarCollapsed={isSidebarCollapsed}
                />
                {!isSidebarCollapsed && <span>{item.name}</span>}
                {hasChildren && !isSidebarCollapsed && (
                  <button
                    type="button"
                    onClick={e => {
                      e.preventDefault()
                      toggleSubmenu(item.name)
                    }}
                    className="ml-auto text-current hover:text-primary p-1 rounded-full"
                    aria-label={
                      isSubmenuOpen ? 'Collapse submenu' : 'Expand submenu'
                    }
                  >
                    {isSubmenuOpen ? (
                      <ChevronUpIcon className="h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" />
                    )}
                  </button>
                )}
              </NavLink>

              {hasChildren && isSubmenuOpen && !isSidebarCollapsed && (
                <div className="flex flex-col pl-12 pr-3 space-y-1 mt-1">
                  {item.children!.map(child => (
                    <NavLink
                      key={child.name}
                      to={child.href}
                      className={({ isActive: isChildActive }) =>
                        classNames(
                          isChildActive
                            ? 'text-primary font-medium'
                            : 'text-foreground-500 hover:text-primary',
                          'flex items-center py-1 text-sm rounded-md px-2'
                        )
                      }
                      end
                    >
                      <span>{child.name}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar
