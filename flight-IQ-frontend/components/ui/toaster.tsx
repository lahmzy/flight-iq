"use client"

import {
  Bell,
  CircleAlert,
  CircleCheck,
  Info,
  type LucideIcon,
} from "lucide-react"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastProps,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

const VARIANT_ICON: Record<NonNullable<ToastProps["variant"]>, LucideIcon> = {
  default: Bell,
  success: CircleCheck,
  info: Info,
  destructive: CircleAlert,
}

function ToastIcon({
  variant,
}: {
  variant: NonNullable<ToastProps["variant"]>
}) {
  const Icon = VARIANT_ICON[variant] ?? Bell
  return (
    <Icon
      className="mt-0.5 h-5 w-5 shrink-0"
      aria-hidden="true"
      strokeWidth={2}
    />
  )
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        variant,
        ...props
      }) {
        const resolvedVariant: NonNullable<ToastProps["variant"]> =
          variant ?? "default"

        return (
          <Toast key={id} variant={resolvedVariant} {...props}>
            <div className="flex w-full items-start gap-3">
              <ToastIcon variant={resolvedVariant} />
              <div className={cn("grid flex-1 gap-1")}>
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
