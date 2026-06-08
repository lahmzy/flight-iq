"use client"

import { useCallback, useMemo } from "react"

import { toast as shadcnToast } from "@/components/ui/use-toast"

import type { ApiError } from "@/types/api"

/**
 * Reusable toast helper that wraps ShadCN's underlying
 * `toast` primitive with ergonomic, type-safe shortcuts.
 *
 * Usage:
 * ```ts
 * const { showSuccess, showError, showInfo } = useToast()
 * showSuccess("Saved!")
 * ```
 */
export interface ToastHelpers {
  /** Display a success-styled toast with a single message. */
  showSuccess: (message: string, description?: string) => void
  /** Display an error-styled toast with a single message. */
  showError: (message: string, description?: string) => void
  /** Display an info-styled toast with a single message. */
  showInfo: (message: string, description?: string) => void
  /**
   * Show an error toast derived from a normalized `ApiError`
   * (the shape produced by the axios response interceptor).
   */
  showApiError: (error: ApiError | Error | string, fallback?: string) => void
  /** Dismiss every active toast. */
  dismissAll: () => void
}

/**
 * Hook surface for triggering toasts from anywhere inside a
 * Client Component. Returns stable references thanks to
 * `useCallback` and `useMemo`.
 */
export function useToast(): ToastHelpers {
  const showSuccess = useCallback((message: string, description?: string) => {
    shadcnToast({
      variant: "success",
      title: message,
      description,
    })
  }, [])

  const showError = useCallback((message: string, description?: string) => {
    shadcnToast({
      variant: "destructive",
      title: message,
      description,
    })
  }, [])

  const showInfo = useCallback((message: string, description?: string) => {
    shadcnToast({
      variant: "info",
      title: message,
      description,
    })
  }, [])

  const showApiError = useCallback<ToastHelpers["showApiError"]>(
    (error, fallback) => {
      if (typeof error === "string") {
        showError(error)
        return
      }

      if (error instanceof Error) {
        showError(fallback ?? "Something went wrong", error.message)
        return
      }

      const description = error.fieldErrors
        ? Object.entries(error.fieldErrors)
            .map(([field, messages]) => {
              const list = Array.isArray(messages)
                ? messages.filter((m): m is string => typeof m === "string")
                : []
              return `${field}: ${list.join(", ")}`
            })
            .join("\n")
        : undefined

      showError(fallback ?? error.message, description)
    },
    [showError],
  )

  const dismissAll = useCallback(() => {
    shadcnToast.dismiss()
  }, [])

  return useMemo(
    () => ({ showSuccess, showError, showInfo, showApiError, dismissAll }),
    [showSuccess, showError, showInfo, showApiError, dismissAll],
  )
}
