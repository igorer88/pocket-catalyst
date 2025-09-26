import { ReactNode } from 'react'

import Header from '@/components/navigation/Header'

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <main className="text-foreground bg-background min-h-screen">
      <Header />
      <div className="py-4 px-6">{children}</div>
    </main>
  )
}

export default MainLayout
