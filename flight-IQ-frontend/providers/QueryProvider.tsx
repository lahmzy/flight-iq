"use client"

import * as React from "react"
import {
  QueryClient,
  QueryClientProvider,
  isServer,
} from "@tanstack/react-query"

/**
 * Production-ready defaults. Tuned for an internal admin/dashboard
 * where users expect near-instant updates but are unlikely to
 * switch tabs while waiting for data. Adjust freely in your
 * own feature modules by passing `options` to individual hooks.
 */
function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        /**
         * Data is considered fresh for one minute. Prevents the
         * "refetch on every focus" thrash that v3 was known for
         * while still being responsive enough for most apps.
         */
        staleTime: 60 * 1000,
        /**
         * Cached for five minutes in case no observers are mounted.
         * Paired with `staleTime` so background refetches keep
         * the cache warm without blocking the UI.
         */
        gcTime: 5 * 60 * 1000,
        /**
         * Re-fetch when the user returns to the tab. Useful for
         * collaborative apps; flip to `false` for read-only views.
         */
        refetchOnWindowFocus: true,
        /**
         * Reconnect refetches are cheap with TanStack Query v5
         * and prevent stale state after coming back online.
         */
        refetchOnReconnect: true,
        /**
         * One retry masks transient network blips. Hard errors
         * surface immediately on the second attempt.
         */
        retry: 1,
      },
      mutations: {
        /**
         * Mutations are intentionally non-idempotent at the
         * transport layer; we leave retry decisions to the
         * calling code so domain logic stays explicit.
         */
        retry: 0,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

/**
 * On the server, every request gets a fresh client to avoid
 * cross-request state leaks. In the browser we reuse a single
 * client across renders so the cache survives route changes.
 */
function getQueryClient(): QueryClient {
  if (isServer) {
    return makeQueryClient()
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }

  return browserQueryClient
}

export interface QueryProviderProps {
  children: React.ReactNode
}

/**
 * Wraps the app in a TanStack Query client. Mount this once,
 * near the root of the tree (alongside any other client-side
 * providers). Server components can render through it without
 * issues — only the hooks that consume the cache have to be
 * inside a client component.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
