interface FrappeUIConfig {
  // Timezone configurations
  systemTimezone?: string | null
  localTimezone?: string | null

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
