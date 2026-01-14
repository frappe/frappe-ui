import { call } from 'frappe-ui'
import type { App } from 'vue'

declare global {
  interface Window {
    frappe: any
  }
}

export default {
  install(app: App, options: { app_name: string }) {
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

const enableTelemetry = (app: App, app_name: string) => {
  silentCall<boolean>('frappe.utils.telemetry.pulse.client.is_enabled')
    .then((is_enabled: boolean) => {
      setupTelemetry(app, is_enabled, app_name)
    })
    .catch(() => {
      console.warn('Failed to fetch telemetry settings. Disabling telemetry.')
      setupTelemetry(app, false, app_name)
    })
}

const setupTelemetry = async (
  app: App,
  is_enabled: boolean,
  app_name: string,
) => {
  window.frappe.boot.enable_telemetry = is_enabled
  window.frappe.boot.telemetry_provider = is_enabled ? ['pulse'] : []
  app.config.globalProperties.$telemetry = {
    is_enabled: () => false,
    capture: () => {},
  }

  if (!is_enabled) {
    return
  }

  const pulse_provider = await loadPulseProvider()
  if (!pulse_provider) {
    console.warn('Failed to load telemetry provider. Disabling telemetry.')
    setupTelemetry(app, false, app_name)
    return
  }

  pulse_provider.init()
  app.config.globalProperties.$telemetry = {
    is_enabled: pulse_provider.is_enabled,
    capture: (event_name: string, data: Record<string, any> = {}) => {
      pulse_provider.capture(event_name, app_name, data)
    },
  }
  window.frappe.telemetry = app.config.globalProperties.$telemetry
}

const loadPulseProvider = async () => {
  const modules = import.meta.glob([
    // for when frappe-ui is under node_modules
    '../../../../../frappe/frappe/public/js/telemetry/pulse.js',
    // for when frapee-ui is under workspaces setup
    '../../../frappe/frappe/public/js/telemetry/pulse.js',
  ])

  for (const path in modules) {
    try {
      const module: any = await modules[path]()
      return module.pulse_provider
    } catch (e) {
      // Continue to next path
    }
  }
}

const initializeFrappeBoot = () => {
  window.frappe ??= {}
  window.frappe.boot = {
    ...window.frappe.boot,
  }
}
