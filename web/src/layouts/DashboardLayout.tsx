import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import Breadcrumbs from '@/components/navigation/Breadcrumbs'
import Header from '@/components/navigation/Header'
import MobileBottomNav from '@/components/navigation/MobileBottomNav'
import Sidebar from '@/components/navigation/Sidebar'
import { useIsTablet } from '@/hooks/useMediaQuery'
import { useGlobalStore } from '@/stores/globalStore'
import { classNames } from '@/utils'

const DashboardLayout = () => {
  const isSidebarCollapsed = useGlobalStore(state => state.isSidebarCollapsed)
  const toggleSidebar = useGlobalStore(state => state.toggleSidebar)

  const isTablet = useIsTablet()

  // Auto-collapse sidebar on tablets for optimal space usage
  useEffect(() => {
    if (isTablet && !isSidebarCollapsed) {
      toggleSidebar() // Force collapse on tablet
    }
  }, [isTablet, isSidebarCollapsed, toggleSidebar])

  return (
    <div className="flex h-screen">
      <aside
        className={classNames(
          'hidden md:flex md:flex-col bg-content1 border-r border-divider transition-all duration-300 ease-in-out',
          isSidebarCollapsed ? 'w-20' : 'lg:w-72 md:w-20'
        )}
      >
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <Breadcrumbs />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}

export default DashboardLayout
