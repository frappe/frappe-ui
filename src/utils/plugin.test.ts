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

  it('installs no resources helpers by default', () => {
    const app = mountWith(undefined, Blank)

    const proxy = (app._instance as any).proxy
    expect(proxy.$getResource).toBeUndefined()
  })

  // The mixin below throws inside a lifecycle hook, which Vue rethrows in dev
  // but only logs in production. Guarding the read as well means the failure
  // reaches app code in every build.
  it('throws when $resources is read and the option is off', () => {
    const app = mountWith(undefined, Blank)
    const proxy = (app._instance as any).proxy

    expect(() => proxy.$resources).toThrow(
      /this\.\$resources is not set.*resources: true/s,
    )
  })

  it('leaves $resources alone when the option is on', () => {
    const app = mountWith({ resources: true }, OptionsApiConsumer)
    const proxy = (app._instance as any).proxy

    expect(() => proxy.$resources).not.toThrow()
  })

  // `resources` off used to be silent: the component option did nothing, no
  // request was made, and `this.$resources` was undefined until something
  // downstream crashed on it. Refuse to create the component instead — in
  // production as well as dev, which rules out a dev-only console.warn.
  it('throws for a component declaring resources when the option is off', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => mountWith(undefined, OptionsApiConsumer)).toThrow(
      /app\.use\(FrappeUI, \{ resources: true \}\)/,
    )

    error.mockRestore()
  })

  it('names the offending component in the error', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const Named = defineComponent({
      name: 'TodoList',
      resources: { todos: () => ({ url: 'x', auto: false }) },
      render: () => h('div'),
    } as any)

    expect(() => mountWith(undefined, Named)).toThrow(/TodoList/)

    error.mockRestore()
  })

  it('leaves components without a resources option alone', () => {
    expect(() => mountWith(undefined, Blank)).not.toThrow()
  })

  // Reading a global the plugin stopped installing used to yield `undefined`
  // and crash somewhere else — builder's realtimeHandler does `$socket.on(…)`.
  it.each(['$socket', '$call'])(
    'throws a message naming the fix when %s is read',
    (key) => {
      const app = mountWith({ resources: true })

      expect(() => (app.config.globalProperties as any)[key]).toThrow(
        new RegExp(`this\\.\\${key} is not set`),
      )
    },
  )

  it('mentions socket.io and the assignment when $socket is read', () => {
    const app = mountWith()

    expect(() => app.config.globalProperties.$socket).toThrow(
      /globalProperties\.\$socket = io\(/,
    )
  })

  it('reports the guarded global through the component instance too', () => {
    const app = mountWith(undefined, Blank)
    const proxy = (app._instance as any).proxy

    expect(() => proxy.$socket).toThrow(/this\.\$socket is not set/)
  })

  it('lets an app assign its own $socket over the guard', () => {
    const app = mountWith()
    const socket = { on() {} }

    app.config.globalProperties.$socket = socket

    expect(app.config.globalProperties.$socket).toBe(socket)
  })

  it('does not clobber a $socket assigned before install', () => {
    const socket = { on() {} }
    const app = createApp(Blank)
    app.config.globalProperties.$socket = socket
    app.use(FrappeUI)

    expect(app.config.globalProperties.$socket).toBe(socket)
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
