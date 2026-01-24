import { AppShell } from './components'
import { useLocalStorage } from './hooks/useLocalStorage'
import { ArrowLeftRight } from 'lucide-react'

const defaultNavigationItems = [
  { label: 'Clients', href: '/clients', isActive: true },
  { label: 'Projects', href: '/projects' },
  { label: 'Tasks', href: '/tasks' },
  { label: 'Dashboards', href: '/dashboards' },
  { label: 'Invoicing', href: '/invoicing' },
  { label: 'Settings', href: '/settings' },
]

const defaultUser = {
  name: 'Demo User',
}

function ShellPreview() {
  const [sidebarPosition, setSidebarPosition] = useLocalStorage<'left' | 'right'>(
    'yourco-sidebar-position',
    'left'
  )

  const togglePosition = () => {
    setSidebarPosition((prev) => (prev === 'left' ? 'right' : 'left'))
  }

  return (
    <AppShell
      navigationItems={defaultNavigationItems}
      user={defaultUser}
      sidebarPosition={sidebarPosition}
      enablePeek={true}
      onNavigate={(href) => console.log('Navigate to:', href)}
      onLogout={() => console.log('Logout')}
    >
      <div className="max-w-4xl">
        <h1 className="text-2xl font-heading font-semibold text-stone-900 dark:text-stone-100 mb-2">
          Welcome to YourCo
        </h1>
        <p className="text-stone-600 dark:text-stone-400 mb-6">
          This is a preview of the application shell. Select a section from the
          sidebar to navigate.
        </p>

        {/* Shell Controls */}
        <div className="mb-6 p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50">
          <h2 className="text-sm font-medium text-stone-900 dark:text-stone-100 mb-3">
            Shell Controls
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={togglePosition}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg
                       bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600
                       text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-600
                       arc-transition"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Sidebar: {sidebarPosition === 'left' ? 'Left' : 'Right'}
            </button>
            <span className="inline-flex items-center px-3 py-2 text-sm text-stone-500 dark:text-stone-400">
              <kbd className="px-1.5 py-0.5 text-xs font-mono bg-stone-200 dark:bg-stone-600 rounded mr-1">
                ⌘B
              </kbd>
              to toggle sidebar
            </span>
          </div>
          <p className="mt-3 text-xs text-stone-500 dark:text-stone-400">
            Hover over a collapsed sidebar to "peek" and see labels. Preferences
            persist in localStorage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {['Clients', 'Projects', 'Tasks'].map((section) => (
            <div
              key={section}
              className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50"
            >
              <h3 className="font-medium text-stone-900 dark:text-stone-100 mb-1">
                {section}
              </h3>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Placeholder content for {section.toLowerCase()} section.
              </p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

export default ShellPreview
