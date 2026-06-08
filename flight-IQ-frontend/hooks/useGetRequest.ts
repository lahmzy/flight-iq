"use client"

import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query"
import type { AxiosRequestConfig } from "axios"

import { apiClient } from "@/lib/axios"
import type { ApiError } from "@/types/api"

/**
 * Props accepted by `useGetRequest`. The query function is
 * built from `url` + `config.params`; the rest of the
 * `UseQueryOptions` API is exposed via `options` for
 * advanced cases (select, meta, placeholderData, etc.).
 */
export interface UseGetRequestProps<TResponse> {
  /** Endpoint path, supports route params via template literals. */
  url: string
  /**
   * Unique cache key for the query. Should include any
   * dynamic value the query depends on (id, filters, page…).
   */
  queryKey: readonly unknown[]
  /** When `false`, the query is paused. Defaults to `true`. */
  enabled?: boolean
  /** Extra axios config: query params, headers, signal, etc. */
  config?: AxiosRequestConfig
  /** Escape hatch for any other TanStack Query options. */
  options?: Omit<
    UseQueryOptions<TResponse, ApiError, TResponse, readonly unknown[]>,
    "queryKey" | "queryFn" | "enabled"
  >
}

/**
 * Fully-typed GET hook. The response is the raw payload
 * returned by the endpoint (no automatic unwrapping), so
 * consumers can choose to type their response as
 * `ApiResponse<T>` or `T` directly.
 *
 * @example
 * ```ts
 * const { data, isLoading, error } = useGetRequest<User>({
 *   url: `/users/${id}`,
 *   queryKey: ["user", id],
 * })
 * ```
 *
 * @example
 * ```ts
 * const { data } = useGetRequest<UserResponse>({
 *   url: "/users",
 *   queryKey: ["users", page],
 *   config: { params: { page, limit: 10 } },
 * })
 * ```
 */
export function useGetRequest<TResponse = unknown>({
  url,
  queryKey,
  enabled = true,
  config,
  options,
}: UseGetRequestProps<TResponse>): UseQueryResult<TResponse, ApiError> {
  return useQuery<TResponse, ApiError, TResponse, readonly unknown[]>({
    queryKey,
    queryFn: async ({ signal }) => {
      const response = await apiClient.get<TResponse>(url, {
        ...config,
        signal: signal ?? config?.signal,
      })
      return response.data
    },
    enabled,
    ...options,
  })
}
