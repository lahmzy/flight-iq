"use client"

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query"

import { apiClient } from "@/lib/axios"
import { useToast } from "@/hooks/use-toast"
import type { ApiError, ApiResponse, HttpMethod } from "@/types/api"

/**
 * Props accepted by `useApiMutation`. The shape mirrors the
 * bare HTTP verb you want to issue, plus a small set of
 * cross-cutting concerns (toast messages, cache invalidation,
 * lifecycle hooks).
 */
export interface UseApiMutationProps<TResponse, TPayload> {
  /** Endpoint path, supports route params via template literals. */
  url: string
  /** HTTP verb. */
  method: HttpMethod

  /**
   * Title used for the success toast. Set to `null` to
   * suppress the success toast entirely.
   */
  successMessage?: string | null
  /**
   * Title used for the error toast. Set to `null` to
   * suppress the error toast entirely.
   */
  errorMessage?: string | null
  /**
   * When `true` (default), a backend-provided `message` field
   * on the response is shown as the toast description.
   */
  useServerMessage?: boolean

  /**
   * List of TanStack Query keys to invalidate after a
   * successful mutation. Each entry is a full query key
   * (i.e. the same array you pass to `useQuery`).
   *
   * @example
   * ```ts
   * invalidateQueries: [["users"], ["user", id]]
   * ```
   */
  invalidateQueries?: readonly (readonly unknown[])[]

  /**
   * Invoked after the toast fires and queries are invalidated.
   * `variables` is the raw payload passed to `mutate`.
   */
  onSuccess?: (data: TResponse, variables: TPayload) => void
  /**
   * Invoked after the error toast fires. `variables` is the
   * raw payload that was sent.
   */
  onError?: (error: ApiError, variables: TPayload) => void
  /**
   * Invoked once the mutation has either succeeded or failed,
   * regardless of outcome. Useful for closing modals, hiding
   * spinners, or analytics.
   */
  onSettled?: () => void

  /**
   * Escape hatch for any other TanStack Query mutation
   * options (retry, scope, networkMode, mutationKey, etc.).
   * The lifecycle hooks (`onSuccess`, `onError`, `onSettled`)
   * and the `mutationFn` are reserved by this wrapper and
   * will throw a build-time error if supplied.
   */
  options?: Omit<
    UseMutationOptions<TResponse, ApiError, TPayload, unknown>,
    "mutationFn" | "onSuccess" | "onError" | "onSettled"
  >
}

/**
 * Coerce a `TResponse` value into a human-readable fallback
 * message. Handles `ApiResponse<T>` envelopes as well as
 * raw strings and arbitrary objects.
 */
function extractServerMessage<TResponse>(response: TResponse): string | null {
  if (typeof response === "string" && response.length > 0) {
    return response
  }

  if (response && typeof response === "object") {
    const envelope = response as Partial<ApiResponse<unknown>> & {
      message?: unknown
    }

    if (typeof envelope.message === "string" && envelope.message.length > 0) {
      return envelope.message
    }
  }

  return null
}

/**
 * Issue a typed POST/PUT/PATCH/DELETE request through the
 * centralized axios client.
 *
 * The hook is a thin enterprise-grade wrapper around
 * `useMutation`. It does not try to replace TanStack Query —
 * every standard property (`mutate`, `mutateAsync`,
 * `isPending`, `isSuccess`, `isError`, `error`, `data`,
 * `reset`, `status`, `failureCount`, `failureReason`,
 * `variables`, …) is exposed on the returned object.
 *
 * @example
 * ```ts
 * const createUser = useApiMutation<UserResponse, CreateUserPayload>({
 *   url: "/users",
 *   method: "POST",
 *   successMessage: "User created",
 *   invalidateQueries: [["users"]],
 *   onSuccess: (data) => console.log(data),
 * })
 *
 * createUser.mutate({ name: "John", email: "john@example.com" })
 * ```
 */
export function useApiMutation<
  TResponse = unknown,
  TPayload = unknown,
>({
  url,
  method,
  successMessage = "Success",
  errorMessage = "Something went wrong",
  useServerMessage = true,
  invalidateQueries,
  onSuccess,
  onError,
  onSettled,
  options,
}: UseApiMutationProps<TResponse, TPayload>): UseMutationResult<
  TResponse,
  ApiError,
  TPayload,
  unknown
> {
  const queryClient = useQueryClient()
  const { showSuccess, showApiError } = useToast()

  return useMutation<TResponse, ApiError, TPayload, unknown>({
    mutationFn: async (payload) => {
      const response = await apiClient.request<TResponse>({
        url,
        method,
        data: payload,
      })
      return response.data
    },
    ...options,
    onSuccess: (data, variables) => {
      // 1. Show the success toast (unless suppressed).
      if (successMessage !== null) {
        const serverMessage = useServerMessage
          ? extractServerMessage(data)
          : null
        showSuccess(successMessage, serverMessage ?? undefined)
      }

      // 2. Invalidate any dependent queries.
      if (invalidateQueries && invalidateQueries.length > 0) {
        for (const queryKey of invalidateQueries) {
          queryClient.invalidateQueries({
            queryKey: queryKey as unknown[],
          })
        }
      }

      // 3. Fire the user-supplied callback with the raw payload.
      onSuccess?.(data, variables)
    },
    onError: (error, variables) => {
      // 1. Show the error toast (unless suppressed).
      if (errorMessage !== null) {
        showApiError(error, errorMessage)
      }

      // 2. Fire the user-supplied callback with the raw payload.
      onError?.(error, variables)
    },
    onSettled: () => {
      onSettled?.()
    },
  })
}
