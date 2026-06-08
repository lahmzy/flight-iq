/**
 * Standardized API types shared across the application.
 * These types are the single source of truth for all HTTP
 * request/response shapes that flow through the axios client
 * and the TanStack Query hooks.
 */

/**
 * Normalized error shape produced by the axios response
 * interceptor. Every rejected request across the app surfaces
 * this exact shape so consumers can render messages without
 * having to inspect axios internals.
 */
export interface ApiError {
  /** Human-readable error message, safe to display in the UI. */
  message: string;
  /** HTTP status code returned by the server (or 0 for network errors). */
  statusCode: number;
  /** Optional machine-readable error code from the backend. */
  code?: string;
  /** Optional field-level validation errors keyed by field name. */
  fieldErrors?: Record<string, string[]>;
}

/**
 * Envelope returned by backend endpoints that wrap their
 * payload inside a `data` property. The optional `message`
 * is commonly used for success notifications.
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/**
 * Generic pagination metadata. Compatible with most common
 * pagination strategies (page/limit, offset/limit, cursor).
 */
export interface PaginationMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  nextCursor?: string | null;
}

/**
 * Paginated response shape. Use this when an endpoint returns
 * a list alongside pagination metadata.
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * HTTP methods supported by the mutation hook. Restricted
 * to verbs that have semantic request bodies or side effects
 * (GET is intentionally excluded and handled by useGetRequest).
 */
export type HttpMethod = "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Where the auth token is persisted on the client.
 *
 * The token is **always** transmitted as
 * `Authorization: Bearer <token>` regardless of which
 * strategy you pick — the strategy only chooses the
 * client-side storage backend.
 *
 * - `cookie` (default): stored as a regular (non-`HttpOnly`)
 *   cookie via `js-cookie`. The browser does NOT auto-attach
 *   it to requests; the axios interceptor reads it explicitly
 *   and stamps it onto the `Authorization` header.
 * - `localStorage`: stored via `window.localStorage`. Use
 *   this when cookies are unavailable (e.g. some static
 *   hosting providers without a custom domain) or when you
 *   want to avoid cookies entirely for compliance reasons.
 *
 * The cookie used here is **not** the httpOnly session-cookie
 * pattern — the server does not read it directly. It is
 * purely a client-side storage slot.
 */
export type AuthStrategy = "cookie" | "localStorage";

/**
 * Cookie attributes forwarded to `js-cookie` whenever the
 * auth strategy is `cookie`. Sensible defaults are applied
 * for missing fields — see `lib/axios.ts` for the exact
 * values.
 *
 * Note: the `httpOnly` flag is intentionally **not** exposed.
 * This layer never sets httpOnly cookies; the token must
 * remain readable by JavaScript so the axios interceptor can
 * stamp it onto the `Authorization` header.
 */
export interface CookieAttributes {
  /** Days until the cookie expires. Omit for a session cookie. */
  expires?: number | Date;
  /** Path scope. Defaults to `/`. */
  path?: string;
  /** Domain scope. Leave unset to scope to the current host. */
  domain?: string;
  /**
   * `Secure` flag. Should be `true` in production (HTTPS
   * only). The default auto-detects the page protocol.
   */
  secure?: boolean;
  /** `SameSite` policy. Defaults to `Lax`. */
  sameSite?: "Strict" | "Lax" | "None";
}

/**
 * Configuration accepted by the centralized axios instance.
 * Kept narrow on purpose: advanced axios options are still
 * available per-request via `AxiosRequestConfig`.
 */
export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  authStrategy?: AuthStrategy;
  /** Storage/cookie key used to read/write the bearer token. */
  tokenStorageKey?: string;
  /** Cookie attributes used when `authStrategy === "cookie"`. */
  cookieAttributes?: CookieAttributes;
}

/**
 * Helper to extract the `data` payload from an `ApiResponse<T>`
 * when the hook consumer only cares about the inner type.
 */
export type UnwrapResponse<T> = T extends ApiResponse<infer U> ? U : T;
