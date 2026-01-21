import { reactive, readonly, ref, type App } from 'vue'

import { pulse_provider, PulseProvider } from './pulse.ts'
import { silentCall } from './utils.ts'

let pulseProvider: PulseProvider | null = null

const appName = ref<string>()
const isEnabled = ref(false)

export function useTelemetry() {
  return reactive({
    isEnabled: readonly(isEnabled),
    disable: () => {
      isEnabled.value = false
      pulseProvider?.setEnabled(false)
      pulseProvider?.stop()
    },
    capture: (event_name: string, data: Record<string, any> = {}) => {
      if (!isEnabled.value || !appName.value) return
      pulseProvider?.capture(event_name, appName.value, data)
    },
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

    pulseProvider = pulse_provider
    pulseProvider.setEnabled(true)
    pulseProvider.init()
  },
}
