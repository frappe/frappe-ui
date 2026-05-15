export type Doc = { doctype: string; name: string; [key: string]: any }

export interface RequestConfig {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  /**
   * For GET: serialized as query params.
   * For POST/PUT/PATCH/DELETE: sent as JSON body.
   */
  body?: Record<string, any>
  /**
   * Deduplicate concurrent requests with the same method+url.
   * Defaults to true for GET, false for mutating methods.
   */
  dedupe?: boolean
  signal?: AbortSignal
}
