import {
  Users,
  FolderKanban,
  CheckSquare,
  LayoutDashboard,
  Receipt,
  Settings,
  type LucideIcon,
} from 'lucide-react'

interface NavigationItem {
  label: string
  href: string
  isActive?: boolean
}

interface MainNavProps {
  items: NavigationItem[]
  collapsed: boolean
  showLabels: boolean
  onNavigate?: (href: string) => void
}

const iconMap: Record<string, LucideIcon> = {
  Clients: Users,
  Projects: FolderKanban,
  Tasks: CheckSquare,
  Dashboards: LayoutDashboard,
  Invoicing: Receipt,
  Settings: Settings,
}

export function MainNav({ items, collapsed, showLabels, onNavigate }: MainNavProps) {
  return (
    <nav className="space-y-1.5 px-3">
      {items.map((item) => {
        const Icon = iconMap[item.label] || FolderKanban
        const isActive = item.isActive

        return (
          <button
            key={item.href}
            onClick={() => onNavigate?.(item.href)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-sm font-medium arc-transition
              ${collapsed && !showLabels ? 'justify-center' : ''}
              ${
                isActive
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200 shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100'
              }
            `}
            title={!showLabels ? item.label : undefined}
          >
            <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
            {showLabels && (
              <span className="animate-label-fade truncate">{item.label}</span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
