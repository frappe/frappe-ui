import { call } from 'frappe-ui'
import { reactive, readonly, ref, type App } from 'vue'

declare global {
  interface Window {
    frappe: any
  }
}

let pulseProvider: {
  init: () => void
  capture: (
    event_name: string,
    app_name: string,
    data: Record<string, any>,
  ) => void
}

const appName = ref<string>()
const isEnabled = ref(false)

const disableTelemetry = () => {
  isEnabled.value = false
  setFrappeBoot(false)
}

const captureEvent = (event_name: string, data: Record<string, any> = {}) => {
  if (!isEnabled.value || !pulseProvider || !appName.value) return
  pulseProvider.capture(event_name, appName.value, data)
}

export function useTelemetry() {
  return reactive({
    isEnabled: readonly(isEnabled),
    disable: disableTelemetry,
    capture: captureEvent,
  })
}

export default {
  async install(app: App, options: { app_name: string }) {
    appName.value = options.app_name

    if (!appName.value) {
      console.warn(
        `Telemetry plugin installed without app_name. \n` +
          `To enable telemetry, please provide the app_name while installing the plugin: \n` +
          `app.use(telemetryPlugin, { app_name: 'your_app_name' })`,
      )
      return
    }

    isEnabled.value = await silentCall<boolean>(
      'frappe.utils.telemetry.pulse.client.is_enabled',
    )
    if (!isEnabled.value) return

    pulseProvider = await loadPulseProvider()
    if (!pulseProvider) return

    setFrappeBoot(isEnabled.value)
    pulseProvider.init()
  },
}

const silentCall = <T>(method: string): Promise<T> => {
  // To prevent console errors/logs from being shown
  // when method doesn't exist in older versions of Frappe
  const originalError = console.error
  const originalLog = console.log
  console.error = () => {}
  console.log = () => {}

  return call(method).finally(() => {
    console.log = originalLog
    console.error = originalError
  })
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

  console.warn(
    'Telemetry pulse provider could not be loaded. Telemetry will be disabled.',
  )
}

const setFrappeBoot = (is_enabled: boolean) => {
  window.frappe ??= {}
  window.frappe.boot = {
    ...window.frappe.boot,
    enable_telemetry: is_enabled,
    telemetry_provider: is_enabled ? ['pulse'] : [],
  }
}
