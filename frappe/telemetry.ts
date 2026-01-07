import { call } from 'frappe-ui'
import type { App } from 'vue'
// @ts-expect-error
import { pulse_provider } from '../../../frappe/frappe/public/js/telemetry/pulse.js'

type TelemetryPluginOptions = {
  app_name: string
}

declare global {
  interface Window {
    frappe: any
  }
}

type TelemetryConfig = {
  is_enabled: boolean
  capture: (event_name: string, data?: any) => void
}

export default {
  install(app: App, options = {} as TelemetryPluginOptions): void {
    initializeFrappeBoot()
    enableTelemetry(app, options.app_name)
  },
}

const silentCall = <T>(method: string): Promise<T> => {
  // To prevent console errors/logs from being shown
  const originalError = console.error
  const originalLog = console.log
  console.error = () => {}
  console.log = () => {}

  return call(method).finally(() => {
    console.log = originalLog
    console.error = originalError
  })
}

const enableTelemetry = (app: App, app_name: string): void => {
  silentCall<boolean>('frappe.utils.telemetry.pulse.client.is_enabled')
    .then((is_enabled: boolean) => {
      setupTelemetry(app, is_enabled, app_name)
    })
    .catch(() => {
      console.warn('Failed to fetch telemetry settings. Disabling telemetry.')
      setupTelemetry(app, false, app_name)
    })
}

const setupTelemetry = (
  app: App,
  is_enabled: boolean,
  app_name: string,
): void => {
  window.frappe.boot.enable_telemetry = is_enabled
  window.frappe.boot.telemetry_provider = is_enabled ? ['pulse'] : []

  if (is_enabled) {
    setupPulseProvider(app_name)
    app.config.globalProperties.$telemetry = {
      is_enabled: pulse_provider.is_enabled,
      capture: pulse_provider.capture,
    } as TelemetryConfig
  }
}

const setupPulseProvider = (app_name: string): void => {
  const originalCapture = pulse_provider.capture
  pulse_provider.capture = (event_name: string, data: any = {}) =>
    originalCapture(event_name, app_name, data)
  pulse_provider.init()
}

const initializeFrappeBoot = (): void => {
  window.frappe ??= {}
  window.frappe.boot = {
    ...window.frappe.boot,
  }
}
