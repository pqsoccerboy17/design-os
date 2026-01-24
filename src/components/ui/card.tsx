import * as React from "react"

import { cn } from "@/lib/utils"

function Card({
  className,
  interactive = false,
  ...props
}: React.ComponentProps<"div"> & {
  interactive?: boolean
}) {
  return (
    <div
      data-slot="card"
      tabIndex={interactive ? 0 : undefined}
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        interactive && "cursor-pointer transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

type CardContentPadding = 'none' | 'standard' | 'compact'

const paddingClasses: Record<CardContentPadding, string> = {
  none: 'px-6',
  standard: 'px-6 py-4',
  compact: 'px-6 py-2',
}

function CardContent({
  className,
  padding = 'none',
  ...props
}: React.ComponentProps<"div"> & {
  padding?: CardContentPadding
}) {
  return (
    <div
      data-slot="card-content"
      className={cn(paddingClasses[padding], className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
