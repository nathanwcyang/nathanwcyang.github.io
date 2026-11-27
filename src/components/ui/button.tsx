import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Values copied from daisyUI 4 .btn (see PR #42): 48px tall, 2px radius, 200ms colour transition.
const buttonVariants = cva(
  "inline-flex h-12 min-h-12 shrink-0 cursor-pointer select-none flex-wrap items-center justify-center gap-2 rounded-md border px-4 text-center text-sm font-semibold leading-none no-underline transition-[color,background-color,border-color,opacity,box-shadow,transform] duration-200 ease-out",
  {
    variants: {
      variant: {
        default:
          "border-primary bg-primary text-primary-foreground shadow-sm hover:border-[color-mix(in_oklab,rgb(var(--primary)),black_10%)] hover:bg-[color-mix(in_oklab,rgb(var(--primary)),black_10%)]",
        outline:
          "border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background",
        ghost:
          "border-transparent bg-transparent text-current hover:bg-foreground/20 focus-visible:outline-current",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
