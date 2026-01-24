import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Phone,
  Mail,
  Calendar,
  FileText,
  CheckCircle2,
  MessageSquare,
  Clock,
  ArrowRight,
} from 'lucide-react'

type ActivityType =
  | 'call'
  | 'email'
  | 'meeting'
  | 'note'
  | 'task_completed'
  | 'comment'
  | 'time_logged'
  | 'status_change'

interface Activity {
  id: string
  type: ActivityType
  subject: string
  description?: string | null
  occurredAt: string
  user?: {
    name: string
    avatarUrl?: string | null
  }
  client?: {
    name: string
  }
  project?: {
    name: string
  }
}

interface ActivityTimelineProps {
  activities: Activity[]
  showUser?: boolean
  showContext?: boolean
  maxItems?: number
  className?: string
}

const activityIcons: Record<ActivityType, React.ComponentType<{ className?: string }>> = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  note: FileText,
  task_completed: CheckCircle2,
  comment: MessageSquare,
  time_logged: Clock,
  status_change: ArrowRight,
}

const activityColors: Record<ActivityType, string> = {
  call: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
  email: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  meeting: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  note: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400',
  task_completed: 'bg-lime-100 text-lime-600 dark:bg-lime-900/30 dark:text-lime-400',
  comment: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
  time_logged: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  status_change: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function ActivityTimeline({
  activities,
  showUser = true,
  showContext = false,
  maxItems,
  className,
}: ActivityTimelineProps) {
  const displayActivities = maxItems ? activities.slice(0, maxItems) : activities

  return (
    <div className={cn('space-y-4', className)}>
      {displayActivities.map((activity, index) => {
        const Icon = activityIcons[activity.type]
        const isLast = index === displayActivities.length - 1

        return (
          <div key={activity.id} className="relative flex gap-3">
            {/* Timeline connector */}
            {!isLast && (
              <div className="absolute left-4 top-8 bottom-0 w-px bg-stone-200 dark:bg-stone-700" />
            )}

            {/* Icon or Avatar */}
            <div className="relative z-10 flex-shrink-0">
              {showUser && activity.user ? (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 text-xs">
                    {getInitials(activity.user.name)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className={cn('flex h-8 w-8 items-center justify-center rounded-full', activityColors[activity.type])}>
                  <Icon className="h-4 w-4" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                    {activity.subject}
                  </p>
                  {activity.description && (
                    <p className="mt-0.5 text-sm text-stone-600 dark:text-stone-400 line-clamp-2">
                      {activity.description}
                    </p>
                  )}
                  {showContext && (activity.client || activity.project) && (
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-500">
                      {activity.client?.name}
                      {activity.client && activity.project && ' • '}
                      {activity.project?.name}
                    </p>
                  )}
                </div>
                <span className="flex-shrink-0 text-xs text-stone-500 dark:text-stone-400">
                  {formatRelativeTime(activity.occurredAt)}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
