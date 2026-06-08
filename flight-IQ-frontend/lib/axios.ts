import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

import type {
  ApiClientConfig,
  ApiError,
  AuthStrategy,
  CookieAttributes,
} from "@/types/api";

const DEFAULT_TIMEOUT = 30_000;
const DEFAULT_TOKEN_STORAGE_KEY = "access_token";
const DEFAULT_AUTH_STRATEGY: AuthStrategy = "cookie";

/**
 * ## Auth model
 *
 * This client is built around **token-based** authentication.
 * The bearer token is stored on the client (cookie or
 * `localStorage`) and explicitly attached to every outgoing
 * request as `Authorization: Bearer <token>`.
 *
 * The cookie used by the `cookie` strategy is a **regular,
 * JS-readable cookie** — never `httpOnly`. The browser will
 * not auto-attach it to cross-origin XHRs; the request
 * interceptor below is the only thing that reads it. The
 * backend should validate the token from the `Authorization`
 * header, not from a session cookie.
 *
 * If you ever switch to a real httpOnly session cookie, this
 * file is the only place that needs to change — flip the
 * interceptor to pass `withCredentials: true` and stop
 * reading the token manually.
 */

/**
 * Resolve the merged config used to instantiate the axios
 * client. Pulled into a helper so future consumers (tests,
 * scripts) can build isolated instances with the same
 * behavior.
 */
function resolveConfig(
  overrides: ApiClientConfig = {},
): Required<ApiClientConfig> {
  const baseURL =
    overrides.baseURL ?? process.env.NEXT_PUBLIC_API_URL ?? "";

  return {
    baseURL,
    timeout: overrides.timeout ?? DEFAULT_TIMEOUT,
    authStrategy: overrides.authStrategy ?? DEFAULT_AUTH_STRATEGY,
    tokenStorageKey: overrides.tokenStorageKey ?? DEFAULT_TOKEN_STORAGE_KEY,
    cookieAttributes: {
      ...DEFAULT_COOKIE_ATTRIBUTES,
      ...overrides.cookieAttributes,
    },
  };
}

/**
 * Sensible defaults for cookie-based auth. `SameSite=Lax`
 * covers same-site SPA + API setups (e.g. `localhost:3000`
 * ↔ `localhost:3001`) without breaking legitimate
 * navigations. The `secure` flag is auto-detected from the
 * page protocol so it stays off in dev (HTTP) and on in
 * production (HTTPS).
 */
const DEFAULT_COOKIE_ATTRIBUTES: Required<Omit<CookieAttributes, "expires" | "domain">> & {
  expires?: number;
  domain?: string;
} = {
  path: "/",
  sameSite: "Lax",
  secure: typeof window !== "undefined"
    ? window.location.protocol === "https:"
    : true,
}

/**
 * Read the bearer token from the configured storage backend.
 * SSR-safe — always returns `null` on the server.
 */
function readToken(
  strategy: AuthStrategy,
  storageKey: string,
): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    if (strategy === "cookie") {
      return Cookies.get(storageKey) ?? null;
    }

    return window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

/**
 * Best-effort extraction of a human-readable error message from
 * an unknown payload (could be a string, an object with a `message`
 * field, a validation error array, or anything else entirely).
 */
function extractErrorMessage(payload: unknown): string {
  if (typeof payload === "string" && payload.length > 0) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const candidate = payload as {
      message?: unknown;
      error?: unknown;
      details?: unknown;
    };

    if (typeof candidate.message === "string" && candidate.message.length > 0) {
      return candidate.message;
    }

    if (Array.isArray(candidate.message) && candidate.message.length > 0) {
      const first = candidate.message[0];
      if (typeof first === "string") {
        return first;
      }
    }

    if (typeof candidate.error === "string" && candidate.error.length > 0) {
      return candidate.error;
    }

    if (Array.isArray(candidate.details) && candidate.details.length > 0) {
      const first = candidate.details[0];
      if (typeof first === "string") {
        return first;
      }
    }
  }

  return "An unexpected error occurred. Please try again.";
}

/**
 * Normalize any axios failure into the shared `ApiError` shape.
 * Network errors are coerced to status `0` so consumers can
 * distinguish "offline" from "server responded with 4xx/5xx".
 */
function normalizeAxiosError(error: AxiosError): ApiError {
  const status = error.response?.status ?? 0;
  const data = error.response?.data as
    | {
        message?: string | string[];
        code?: string;
        fieldErrors?: Record<string, string[]>;
      }
    | undefined;

  return {
    message: extractErrorMessage(data ?? error.message),
    statusCode: status,
    code: data?.code,
    fieldErrors: data?.fieldErrors,
  };
}

/**
 * Build a configured axios instance with request/response
 * interceptors wired up. Use the exported `apiClient` for the
 * default app-wide instance, or call this factory from tests.
 */
export function createApiClient(config: ApiClientConfig = {}): AxiosInstance {
  const resolved = resolveConfig(config);

  const instance = axios.create({
    baseURL: resolved.baseURL,
    timeout: resolved.timeout,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  instance.interceptors.request.use(
    (request: InternalAxiosRequestConfig) => {
      const token = readToken(
        resolved.authStrategy,
        resolved.tokenStorageKey,
      );
      if (token) {
        // `headers` is always an `AxiosHeaders` instance in
        // modern axios, but the typing allows a plain object
        // so we handle both shapes defensively.
        if (request.headers instanceof AxiosHeaders) {
          request.headers.set("Authorization", `Bearer ${token}`);
        } else {
          request.headers = AxiosHeaders.from({
            ...(request.headers as Record<string, string> | undefined),
            Authorization: `Bearer ${token}`,
          });
        }
      }

      return request;
    },
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (axios.isAxiosError(error)) {
        return Promise.reject(normalizeAxiosError(error));
      }

      const fallback: ApiError = {
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        statusCode: 0,
      };

      return Promise.reject(fallback);
    },
  );

  return instance;
}

/**
 * Application-wide axios instance. Every TanStack Query hook
 * in the app should funnel requests through this client so
 * interceptors run consistently.
 */
export const apiClient: AxiosInstance = createApiClient();

/**
 * Attach a token to the default client at runtime — useful
 * after a successful login or sign-up. The request interceptor
 * also reads storage on every request, so this is just an
 * optimization, not a requirement.
 *
 * When `authStrategy` is `cookie` (the default), the token is
 * persisted via `js-cookie`. Pass `cookieAttributes` to control
 * `expires`, `secure`, `sameSite`, etc.
 */
export function setAuthToken(
  token: string | null,
  options: {
    storageKey?: string;
    strategy?: AuthStrategy;
    cookieAttributes?: CookieAttributes;
  } = {},
): void {
  if (typeof window === "undefined") {
    return;
  }

  const {
    storageKey = DEFAULT_TOKEN_STORAGE_KEY,
    strategy = DEFAULT_AUTH_STRATEGY,
    cookieAttributes,
  } = options;

  if (strategy === "cookie") {
    if (token) {
      Cookies.set(storageKey, token, {
        ...DEFAULT_COOKIE_ATTRIBUTES,
        ...cookieAttributes,
      });
    } else {
      Cookies.remove(storageKey, {
        path: DEFAULT_COOKIE_ATTRIBUTES.path,
        ...cookieAttributes,
      });
    }
    return;
  }

  if (token) {
    window.localStorage.setItem(storageKey, token);
  } else {
    window.localStorage.removeItem(storageKey);
  }
}

/**
 * Read the current token without issuing a request. Useful
 * for client-side guards, hydration checks, and analytics.
 */
export function getAuthToken(
  options: { storageKey?: string; strategy?: AuthStrategy } = {},
): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return readToken(
    options.strategy ?? DEFAULT_AUTH_STRATEGY,
    options.storageKey ?? DEFAULT_TOKEN_STORAGE_KEY,
  );
}

export type { AxiosRequestConfig };
