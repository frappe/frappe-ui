// Loads the one canonical pulse client from pulse's own CDN (not the host backend),
// so it's independent of the backend's framework version. Degrades to null if the
// asset can't be loaded, leaving telemetry off.

import { call } from 'frappe-ui'

export interface PulseContext {
  user?: string
  team?: string
}

// "cookieless" (default): host derives the anon id at ingest. "client": mints a
// persistent localStorage anon id.
export type PulseAnonymousMode = 'cookieless' | 'client'

export interface PulseClientOptions {
  host?: string
  apiKey?: string
  site?: string
  enabled?: boolean
  getContext?: () => PulseContext
  anonymousMode?: PulseAnonymousMode
  flushInterval?: number
  maxQueueSize?: number
  now?: () => string
  clientUrl?: string
}

export interface PulseClient {
  init(): Promise<boolean>
  setEnabled(enabled: boolean): void
  capture(event_name: string, app: string, props?: Record<string, any>): void
  // Distinct id on events (known identity, else anon id); used to alias() pre-signup
  // activity. Optional: an older CDN build may not expose it.
  getDistinctId?(): string
  flush(): Promise<void> | undefined
  stop(): void
}

// Shape returned by the framework's whitelisted boot_config method.
export interface BootConfig {
  enabled?: boolean
  host?: string
  key?: string
  site?: string
  user?: string
  team?: string
  client_url?: string
  site_age?: number
}

export const BOOT_CONFIG_METHOD = 'frappe.utils.telemetry.pulse.client.boot_config'

// Direct-mode config from the app's own backend (frappe-ui SPAs lack desk's
// window.frappe.boot). Degrades to {} on any error, including old backends (404).
export async function fetchBootConfig(): Promise<BootConfig> {
  try {
    return (await call(BOOT_CONFIG_METHOD)) || {}
  } catch (error) {
    return {}
  }
}

export const DEFAULT_PULSE_CLIENT_URL =
  'https://pulse.m.frappe.cloud/assets/pulse/js/pulse_client.js'

export async function loadPulseClient(
  options: PulseClientOptions = {},
): Promise<PulseClient | null> {
  const { clientUrl, ...clientOptions } = options
  try {
    const mod = await import(/* @vite-ignore */ clientUrl || DEFAULT_PULSE_CLIENT_URL)
    return new mod.PulseClient(clientOptions) as PulseClient
  } catch (error) {
    return null
  }
}
