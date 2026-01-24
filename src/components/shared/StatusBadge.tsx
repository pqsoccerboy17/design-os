import { cn } from '@/lib/utils'

type StatusType =
  | 'active' | 'prospect' | 'churned'  // Client status
  | 'planning' | 'on_hold' | 'completed' | 'cancelled'  // Project status
  | 'backlog' | 'in_progress' | 'review' | 'done'  // Task status
  | 'lead' | 'qualified' | 'discovery' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'  // Deal stage
  | 'draft' | 'pending' | 'sent' | 'paid' | 'overdue'  // Invoice status

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  // Client status
  active: { label: 'Active', className: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400' },
  prospect: { label: 'Prospect', className: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' },
  churned: { label: 'Churned', className: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400' },

  // Project status
  planning: { label: 'Planning', className: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
  on_hold: { label: 'On Hold', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  completed: { label: 'Completed', className: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400' },
  cancelled: { label: 'Cancelled', className: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400' },

  // Task status
  backlog: { label: 'Backlog', className: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400' },
  in_progress: { label: 'In Progress', className: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' },
  review: { label: 'Review', className: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
  done: { label: 'Done', className: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400' },

  // Deal stage
  lead: { label: 'Lead', className: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400' },
  qualified: { label: 'Qualified', className: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' },
  discovery: { label: 'Discovery', className: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
  proposal: { label: 'Proposal', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  negotiation: { label: 'Negotiation', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  closed_won: { label: 'Won', className: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400' },
  closed_lost: { label: 'Lost', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },

  // Invoice status
  draft: { label: 'Draft', className: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400' },
  pending: { label: 'Pending', className: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400' },
  sent: { label: 'Sent', className: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' },
  paid: { label: 'Paid', className: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400' },
  overdue: { label: 'Overdue', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: 'bg-stone-100 text-stone-600' }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
