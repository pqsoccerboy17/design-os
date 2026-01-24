import { cn } from '@/lib/utils'
import { AlertTriangle, ArrowDown, ArrowUp, Flame } from 'lucide-react'

type Priority = 'low' | 'medium' | 'high' | 'critical'

interface PriorityBadgeProps {
  priority: Priority
  showIcon?: boolean
  className?: string
}

const priorityConfig: Record<Priority, { label: string; className: string; Icon: React.ComponentType<{ className?: string }> }> = {
  low: {
    label: 'Low',
    className: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400',
    Icon: ArrowDown,
  },
  medium: {
    label: 'Medium',
    className: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
    Icon: ArrowUp,
  },
  high: {
    label: 'High',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Icon: AlertTriangle,
  },
  critical: {
    label: 'Critical',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    Icon: Flame,
  },
}

export function PriorityBadge({ priority, showIcon = true, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority]
  const { Icon } = config

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </span>
  )
}
