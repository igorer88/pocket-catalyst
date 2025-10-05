import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router-dom'

import { getNavigationLinks } from '@/router/NavigationLinks'
import { classNames } from '@/utils'

import SidebarItemIcon from './SidebarItemIcon'

const MobileBottomNav = (): React.JSX.Element => {
  const { t } = useTranslation()
  const location = useLocation()

  // Get specific items for mobile bottom nav: Overview, Accounts, Transactions, Reports
  const navigationItems = getNavigationLinks(t)

  const bottomNavItems = [
    navigationItems.find(item => item.href === '/dashboard'), // Overview
    navigationItems.find(item => item.href === '/dashboard/accounts'), // Accounts
    navigationItems.find(item => item.href === '/dashboard/transactions'), // Transactions
    navigationItems.find(item => item.href === '/dashboard/budgets') // Budgets
  ].filter((item): item is NonNullable<typeof item> => Boolean(item)) // Type-safe filter

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-content1 border-t border-divider md:hidden">
      <div className="flex items-center justify-around px-2 py-3">
        {bottomNavItems.map(item => {
          // Special handling for exact matches to avoid home always being active
          const isActive =
            item.href === '/dashboard'
              ? location.pathname === '/dashboard' // Exact match for home
              : location.pathname === item.href ||
                location.pathname.startsWith(item.href + '/')

          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={classNames(
                'flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-colors min-w-0 flex-1',
                isActive
                  ? 'text-primary'
                  : 'text-foreground-500 hover:text-foreground'
              )}
            >
              <SidebarItemIcon
                iconDefinition={item.icon}
                isParentActive={isActive}
                isSidebarCollapsed={false}
              />
              <span className="text-xs font-medium truncate">{item.name}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileBottomNav
