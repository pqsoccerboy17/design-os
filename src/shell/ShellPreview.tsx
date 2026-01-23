import { AppShell } from './components'

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
  return (
    <AppShell
      navigationItems={defaultNavigationItems}
      user={defaultUser}
      onNavigate={(href) => console.log('Navigate to:', href)}
      onLogout={() => console.log('Logout')}
    >
      <div className="max-w-4xl">
        <h1 className="text-2xl font-heading font-semibold text-stone-900 dark:text-stone-100 mb-2">
          Welcome to YourCo
        </h1>
        <p className="text-stone-600 dark:text-stone-400 mb-6">
          This is a preview of the application shell. Select a section from the sidebar to navigate.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {['Clients', 'Projects', 'Tasks'].map((section) => (
            <div
              key={section}
              className="p-4 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50"
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
