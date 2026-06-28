export interface FrappeUIConfig {
  // Timezone configurations
  systemTimezone?: string | null
  localTimezone?: string | null

  // Max upload size in bytes (apps usually source this from their boot data)
  maxFileSize?: number | null

  // Resource fetcher function
  resourceFetcher?: (options: any) => Promise<any>

  // Default API endpoints for document operations
  defaultDocGetUrl?: string
  defaultDocInsertUrl?: string
  defaultDocUpdateUrl?: string
  defaultDocDeleteUrl?: string
  defaultRunDocMethodUrl?: string

  // Default API endpoints for list operations
  defaultListUrl?: string

  // Error handling
  fallbackErrorHandler?: (error: any) => void

  // Base URL prepended to relative request URLs. Set this for local UI dev
  // against a remote Frappe instance (cross-origin). When set, requests are
  // sent with credentials so cross-origin auth works.
  requestBaseUrl?: string

  // Extra headers merged into every frappeRequest. Either a static object or a
  // function returning headers (useful for injecting an Authorization header,
  // e.g. `token <key>:<secret>`).
  requestHeaders?: Record<string, string> | (() => Record<string, string>)
}

let config: FrappeUIConfig = {}

export function setConfig<K extends keyof FrappeUIConfig>(
  key: K,
  value: FrappeUIConfig[K],
): void {
  config[key] = value
}

export function getConfig<K extends keyof FrappeUIConfig>(
  key: K,
): FrappeUIConfig[K] | null {
  return config[key] ?? null
}
