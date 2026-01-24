import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { AppShell } from '@/shell/components/AppShell'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AuthProvider, type AuthUser } from '@/lib/auth-context'

const navigationItems = [
  { label: 'Clients', href: '/product/clients' },
  { label: 'Projects', href: '/product/projects' },
  { label: 'Tasks', href: '/product/tasks' },
  { label: 'Dashboards', href: '/product/dashboards' },
  { label: 'Invoicing', href: '/product/invoicing' },
  { label: 'Settings', href: '/product/admin' },
]

const mockUser: AuthUser = {
  id: 'user-1',
  name: 'Jordan Smith',
  email: 'jordan@yourco.com',
  role: 'admin',
  avatarUrl: undefined,
}

export function ProductRoutes() {
  const navigate = useNavigate()
  const location = useLocation()

  const itemsWithActiveState = navigationItems.map((item) => ({
    ...item,
    isActive: location.pathname.startsWith(item.href),
  }))

  return (
    <AuthProvider user={mockUser} onLogout={() => navigate('/')}>
      <AppShell
        navigationItems={itemsWithActiveState}
        user={mockUser}
        onNavigate={(href) => navigate(href)}
        onLogout={() => navigate('/')}
      >
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </AppShell>
    </AuthProvider>
  )
}
