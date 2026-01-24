import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface HealthIndicatorProps {
  score: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function getHealthLevel(score: number): { level: 'critical' | 'at_risk' | 'healthy'; label: string; color: string } {
  if (score >= 70) {
    return { level: 'healthy', label: 'Healthy', color: 'bg-lime-500' }
  } else if (score >= 40) {
    return { level: 'at_risk', label: 'At Risk', color: 'bg-amber-500' }
  } else {
    return { level: 'critical', label: 'Critical', color: 'bg-red-500' }
  }
}

const sizeClasses = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
}

export function HealthIndicator({ score, showLabel = false, size = 'md', className }: HealthIndicatorProps) {
  const { level, label, color } = getHealthLevel(score)

  const indicator = (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span className={cn('rounded-full', color, sizeClasses[size])} />
      {showLabel && (
        <span className={cn(
          'text-xs font-medium',
          level === 'healthy' && 'text-lime-700 dark:text-lime-400',
          level === 'at_risk' && 'text-amber-700 dark:text-amber-400',
          level === 'critical' && 'text-red-700 dark:text-red-400'
        )}>
          {score}%
        </span>
      )}
    </span>
  )

  if (showLabel) {
    return indicator
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {indicator}
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}: {score}%</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
