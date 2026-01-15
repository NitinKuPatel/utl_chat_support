"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
    <input
        type="checkbox"
        ref={ref}
        className={cn(
            "h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-orange-600 focus:ring-orange-500 focus:ring-2 focus:ring-offset-2 cursor-pointer",
            className
        )}
        {...props}
    />
))
Checkbox.displayName = "Checkbox"

export { Checkbox }
