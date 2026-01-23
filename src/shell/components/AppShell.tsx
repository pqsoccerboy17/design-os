import { useState } from 'react'
import { MainNav } from './MainNav'
import { UserMenu } from './UserMenu'

interface NavigationItem {
  label: string
  href: string
  isActive?: boolean
}

interface User {
  name: string
  avatarUrl?: string
}

interface AppShellProps {
  children: React.ReactNode
  navigationItems: NavigationItem[]
  user?: User
  onNavigate?: (href: string) => void
  onLogout?: () => void
}

export function AppShell({
  children,
  navigationItems,
  user,
  onNavigate,
  onLogout,
}: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-950">
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden md:flex flex-col
          bg-stone-50 dark:bg-stone-900
          border-r border-stone-200 dark:border-stone-800
          transition-all duration-200 ease-in-out
          ${sidebarCollapsed ? 'w-16' : 'w-60'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center h-14 px-4 border-b border-stone-200 dark:border-stone-800">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex items-center gap-3 text-stone-900 dark:text-stone-100"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm font-heading">Y</span>
            </div>
            {!sidebarCollapsed && (
              <span className="font-heading font-semibold text-lg">YourCo</span>
            )}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4 overflow-y-auto">
          <MainNav
            items={navigationItems}
            collapsed={sidebarCollapsed}
            onNavigate={onNavigate}
          />
        </div>

        {/* User Menu */}
        <div className="border-t border-stone-200 dark:border-stone-800 p-2">
          <UserMenu
            user={user}
            collapsed={sidebarCollapsed}
            onLogout={onLogout}
          />
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">Y</span>
          </div>
          <span className="font-heading font-semibold text-lg text-stone-900 dark:text-stone-100">
            YourCo
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-stone-600 dark:text-stone-400"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="absolute top-14 left-0 right-0 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <MainNav
              items={navigationItems}
              collapsed={false}
              onNavigate={(href) => {
                onNavigate?.(href)
                setMobileMenuOpen(false)
              }}
            />
            <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800">
              <UserMenu user={user} collapsed={false} onLogout={onLogout} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:pt-0 pt-14">
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
