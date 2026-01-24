import { Skeleton } from "./skeleton"
import { Card, CardContent, CardHeader } from "./card"

interface TableRowSkeletonProps {
  columns?: number
  rows?: number
}

export function TableRowSkeleton({ columns = 5, rows = 5 }: TableRowSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-4 py-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={`h-4 ${colIndex === 0 ? 'w-32' : 'flex-1'}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

interface CardSkeletonProps {
  hasHeader?: boolean
  hasFooter?: boolean
  lines?: number
}

export function CardSkeleton({ hasHeader = true, hasFooter = false, lines = 3 }: CardSkeletonProps) {
  return (
    <Card>
      {hasHeader && (
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
      )}
      <CardContent className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
          />
        ))}
      </CardContent>
      {hasFooter && (
        <div className="px-6 pb-4">
          <Skeleton className="h-9 w-24" />
        </div>
      )}
    </Card>
  )
}

interface SummaryCardSkeletonProps {
  count?: number
}

export function SummaryCardSkeleton({ count = 4 }: SummaryCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <SummaryCardSkeleton count={4} />

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <TableRowSkeleton columns={5} rows={5} />
        </CardContent>
      </Card>
    </div>
  )
}

export function ListPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header with title and actions */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      {/* Summary cards */}
      <SummaryCardSkeleton count={4} />

      {/* Table */}
      <Card>
        <CardContent className="pt-4">
          <TableRowSkeleton columns={6} rows={8} />
        </CardContent>
      </Card>
    </div>
  )
}

export function DetailPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb and title */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-64" />
      </div>

      {/* Summary row */}
      <SummaryCardSkeleton count={3} />

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CardSkeleton hasHeader lines={5} />
          <CardSkeleton hasHeader lines={4} />
        </div>
        <div className="space-y-6">
          <CardSkeleton hasHeader lines={3} />
          <CardSkeleton hasHeader lines={4} />
        </div>
      </div>
    </div>
  )
}
