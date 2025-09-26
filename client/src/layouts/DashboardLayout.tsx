import { Outlet } from 'react-router-dom'

import Breadcrumbs from '@/components/navigation/Breadcrumbs'
import Header from '@/components/navigation/Header'
import Sidebar from '@/components/navigation/Sidebar'
import { useGlobalStore } from '@/stores/globalStore'
import { classNames } from '@/utils'

const DashboardLayout = () => {
  const isSidebarCollapsed = useGlobalStore(state => state.isSidebarCollapsed)
  const isMobileSidebarOpen = useGlobalStore(
    state => state.isMobileSidebarOpen
  )
  const toggleMobileSidebar = useGlobalStore(
    state => state.toggleMobileSidebar
  )

  return (
    <div className="flex h-screen">
      <aside
        className={classNames(
          'hidden md:flex md:flex-col border-r border-divider transition-all duration-300 ease-in-out',
          isSidebarCollapsed ? 'w-16' : 'w-72'
        )}
      >
        <Sidebar />
      </aside>

      {isMobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 backdrop-blur"
            aria-hidden="true"
            onClick={() => toggleMobileSidebar(false)}
          />
          <aside className="relative flex w-72 max-w-[calc(100%-3rem)] flex-col border-r border-divider bg-background p-4">
            <Sidebar />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center">
          <Header />
        </div>
        <Breadcrumbs />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
