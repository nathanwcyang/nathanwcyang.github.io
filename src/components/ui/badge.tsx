import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Values copied from daisyUI 4 .badge + .badge-secondary (see PR #42). The theme's secondary was
// black, so this uses foreground/background rather than shadcn's grey secondary.
const badgeVariants = cva(
  "inline-flex h-5 w-fit items-center justify-center rounded-md border border-foreground bg-foreground px-[0.563rem] text-[0.875rem] leading-5 text-background transition-[color,background-color,border-color,opacity,box-shadow,transform] duration-200 ease-out"
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants(), className)} {...props} />
  )
}

export { Badge, badgeVariants }
