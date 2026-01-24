import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { AppShell } from '@/shell/components/AppShell'

const navigationItems = [
  { label: 'Clients', href: '/product/clients' },
  { label: 'Projects', href: '/product/projects' },
  { label: 'Tasks', href: '/product/tasks' },
  { label: 'Dashboards', href: '/product/dashboards' },
  { label: 'Invoicing', href: '/product/invoicing' },
  { label: 'Settings', href: '/product/admin' },
]

const mockUser = {
  name: 'Jordan Smith',
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
    <AppShell
      navigationItems={itemsWithActiveState}
      user={mockUser}
      onNavigate={(href) => navigate(href)}
      onLogout={() => navigate('/')}
    >
      <Outlet />
    </AppShell>
  )
}
