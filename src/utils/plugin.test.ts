// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { createApp, defineComponent, h, type Component } from 'vue'
import FrappeUI from './plugin'

// A component in the shape the resources plugin exists to serve: the Options
// API `resources` block gameplan and drive still declare.
const OptionsApiConsumer = defineComponent({
  resources: {
    todos() {
      return { url: 'frappe.client.get_list', auto: false }
    },
  },
  render: () => h('div'),
} as any)

const Blank: Component = defineComponent({ render: () => h('div') })

function mountWith(
  options?: Parameters<typeof FrappeUI.install>[1],
  component: Component = Blank,
) {
  const app = createApp(component)
  app.use(FrappeUI, options)
  const el = document.createElement('div')
  app.mount(el)
  return app
}

describe('FrappeUI plugin', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('installs nothing by default', () => {
    const app = mountWith(undefined, OptionsApiConsumer)

    // The silent break: `$resources` used to be there without asking. `$call`
    // and `$socket` were globals the plugin also used to set.
    const proxy = (app._instance as any).proxy
    expect(proxy.$resources).toBeUndefined()
    expect(proxy.$getResource).toBeUndefined()
    expect(app.config.globalProperties.$call).toBeUndefined()
    expect(app.config.globalProperties.$socket).toBeUndefined()
  })

  it('installs the resources plugin when asked', () => {
    const app = mountWith({ resources: true }, OptionsApiConsumer)

    // The resources plugin registers its helpers through a global mixin, so
    // they land on the component instance rather than on globalProperties.
    const proxy = (app._instance as any).proxy
    expect(typeof proxy.$getResource).toBe('function')
    expect(proxy.$resources.todos).toBeDefined()
  })

  it('warns and points at setConfig when passed the removed config option', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    mountWith({ config: { maxFileSize: 100 } } as any)

    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0]![0]).toContain('"config"')
    expect(warn.mock.calls[0]![0]).toContain('setConfig')
  })

  it('warns for each removed option', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    mountWith({ call: false, socketio: false } as any)

    expect(warn).toHaveBeenCalledTimes(2)
    expect(warn.mock.calls.map((c) => c[0]).join('\n')).toContain('initSocket')
  })

  it('warns for an option it never had', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    mountWith({ nonsense: true } as any)

    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0]![0]).toContain('resources')
  })

  it('stays quiet for the option it does accept', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    mountWith({ resources: true })

    expect(warn).not.toHaveBeenCalled()
  })
})
