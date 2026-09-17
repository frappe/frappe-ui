// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, createApp } from 'vue'
import {
  createMemoryHistory,
  createRouter,
  type NavigationHookAfter,
  type Router,
} from 'vue-router'
import Tabs from './Tabs.vue'
import TabList from './TabList.vue'
import TabTrigger from './TabTrigger.vue'

describe('Tabs activation-mode scan', () => {
  it('reads the slot without Vue\'s outside-of-render warning', () => {
    // The scan reads the default slot during setup. Reading it through
    // `slots.default` triggers Vue's wrapper warning for every caller that
    // passes slots from a render function or JSX.
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const Harness = defineComponent({
      render: () =>
        h(Tabs, { modelValue: 'a' }, () => [
          h(TabList, null, () => [h(TabTrigger, { value: 'a', label: 'A' })]),
        ]),
    })
    const el = document.createElement('div')
    createApp(Harness).mount(el)
    const messages = warn.mock.calls.map((c) => String(c[0]))
    warn.mockRestore()
    expect(messages.filter((m) => m.includes('invoked outside'))).toEqual([])
  })
})

describe('Tabs route reset', () => {
  const Harness = defineComponent({
    render: () =>
      h(Tabs, null, () => [
        h(TabList, null, () => [
          h(TabTrigger, { value: 'home', label: 'Home' }),
          h(TabTrigger, { value: 'activity', label: 'Activity' }),
        ]),
      ]),
  })

  it('mounts without a router installed', () => {
    // Selection reset listens to the router. Reading it with `useRouter()`
    // would warn on every Tabs in an app that has no router at all, which is
    // most of them.
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const el = document.createElement('div')
    createApp(Harness).mount(el)
    const messages = warn.mock.calls.map((c) => String(c[0]))
    warn.mockRestore()

    expect(
      messages.filter((m) => m.includes('injection') || m.includes('router')),
    ).toEqual([])
    expect(el.querySelectorAll('[role=tab]')).toHaveLength(2)
  })

  it('removes its router hook when it unmounts', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: { render: () => null } }],
    })

    const app = createApp(Harness)
    app.use(router)
    await router.push('/')
    await router.isReady()

    // Wrapped after install so this counts the component's hook only.
    const removers: Array<() => void> = []
    const addAfterEach = router.afterEach.bind(router)
    router.afterEach = ((hook: NavigationHookAfter) => {
      const remove = vi.fn(addAfterEach(hook))
      removers.push(remove)
      return remove
    }) as Router['afterEach']

    const el = document.createElement('div')
    app.mount(el)
    expect(removers).toHaveLength(1)

    app.unmount()
    expect(removers[0]).toHaveBeenCalledTimes(1)
  })
})
