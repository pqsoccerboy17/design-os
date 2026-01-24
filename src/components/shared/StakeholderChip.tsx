import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

type MeddpiccRole = 'champion' | 'economic_buyer' | 'technical_evaluator' | 'coach' | 'blocker' | 'user'

interface StakeholderChipProps {
  name: string
  title?: string | null
  roleTags?: MeddpiccRole[]
  avatarUrl?: string | null
  size?: 'sm' | 'md'
  showRoles?: boolean
  className?: string
}

const roleLabels: Record<MeddpiccRole, { short: string; full: string; className: string }> = {
  champion: { short: 'CH', full: 'Champion', className: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400' },
  economic_buyer: { short: 'EB', full: 'Economic Buyer', className: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
  technical_evaluator: { short: 'TE', full: 'Technical Evaluator', className: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' },
  coach: { short: 'CO', full: 'Coach', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  blocker: { short: 'BL', full: 'Blocker', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  user: { short: 'US', full: 'User', className: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400' },
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function StakeholderChip({
  name,
  title,
  roleTags = [],
  size = 'md',
  showRoles = true,
  className,
}: StakeholderChipProps) {
  const avatarSize = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8'
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <Avatar className={avatarSize}>
        <AvatarFallback className="bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 text-xs">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className={cn('font-medium text-stone-900 dark:text-stone-100', textSize)}>
          {name}
        </span>
        {title && (
          <span className="text-xs text-stone-500 dark:text-stone-400">{title}</span>
        )}
      </div>
      {showRoles && roleTags.length > 0 && (
        <div className="flex gap-1">
          {roleTags.map(role => {
            const config = roleLabels[role]
            return (
              <span
                key={role}
                className={cn(
                  'inline-flex items-center rounded px-1 py-0.5 text-[10px] font-medium uppercase',
                  config.className
                )}
                title={config.full}
              >
                {config.short}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
