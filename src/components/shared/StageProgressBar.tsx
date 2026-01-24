import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

type DealStage = 'lead' | 'qualified' | 'discovery' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
type PhaseStatus = 'pending' | 'active' | 'completed'

interface Stage {
  id: string
  label: string
  status: 'completed' | 'current' | 'upcoming'
}

interface StageProgressBarProps {
  stages: Stage[]
  variant?: 'deal' | 'phase'
  className?: string
}

const dealStages: { id: DealStage; label: string }[] = [
  { id: 'lead', label: 'Lead' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'discovery', label: 'Discovery' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'negotiation', label: 'Negotiation' },
]

export function getDealStages(currentStage: DealStage): Stage[] {
  if (currentStage === 'closed_won' || currentStage === 'closed_lost') {
    return dealStages.map(s => ({
      id: s.id,
      label: s.label,
      status: 'completed' as const,
    }))
  }

  const currentIndex = dealStages.findIndex(s => s.id === currentStage)

  return dealStages.map((stage, index) => ({
    id: stage.id,
    label: stage.label,
    status: index < currentIndex ? 'completed' : index === currentIndex ? 'current' : 'upcoming',
  }))
}

export function getPhaseStages(phases: { id: string; name: string; status: PhaseStatus }[]): Stage[] {
  return phases.map(phase => ({
    id: phase.id,
    label: phase.name,
    status: phase.status === 'completed' ? 'completed' : phase.status === 'active' ? 'current' : 'upcoming',
  }))
}

export function StageProgressBar({ stages, variant = 'deal', className }: StageProgressBarProps) {
  return (
    <div className={cn('flex items-center', className)}>
      {stages.map((stage, index) => (
        <div key={stage.id} className="flex items-center">
          {/* Stage indicator */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors',
                stage.status === 'completed' && 'bg-lime-500 text-white',
                stage.status === 'current' && 'bg-sky-500 text-white',
                stage.status === 'upcoming' && 'bg-stone-200 text-stone-500 dark:bg-stone-700 dark:text-stone-400'
              )}
            >
              {stage.status === 'completed' ? (
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              ) : (
                index + 1
              )}
            </div>
            {variant === 'deal' && (
              <span
                className={cn(
                  'mt-1 text-[10px] font-medium',
                  stage.status === 'completed' && 'text-lime-700 dark:text-lime-400',
                  stage.status === 'current' && 'text-sky-700 dark:text-sky-400',
                  stage.status === 'upcoming' && 'text-stone-500 dark:text-stone-400'
                )}
              >
                {stage.label}
              </span>
            )}
          </div>

          {/* Connector line */}
          {index < stages.length - 1 && (
            <div
              className={cn(
                'h-0.5 w-8 transition-colors',
                stage.status === 'completed' ? 'bg-lime-500' : 'bg-stone-200 dark:bg-stone-700'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
