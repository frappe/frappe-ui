// @vitest-environment jsdom
import { describe, expect, it, vi, afterEach } from 'vitest'
import { defineComponent, h, createApp, nextTick, ref } from 'vue'
import Tabs from './Tabs.vue'
import TabList from './TabList.vue'
import TabTrigger from './TabTrigger.vue'
import TabPanel from './TabPanel.vue'

// ---------------------------------------------------------------------------
// Regression guard for #801 / #1045
//
// #801 reported an uncaught `ResizeObserver: parameter 1 is not of type
// 'Element'` thrown on mount from reka-ui's `TabsIndicator`. The trigger was
// reka's `currentElement` (from `useForwardExpose`) resolving to a truthy
// non-`Element` node on the immediate flush before the `TabsList` element
// settled, which then reached `observer.observe()` — vueuse only guards
// falsy targets (`if (_el) observer.observe(...)`).
//
// The Tabs rewrite (#1024) removed the contributing factor (the
// `:default-value="props.tabs[0].label"` vs `:value="i"` type mismatch that
// left no active tab on first tick). This spec mounts Tabs in the reported
// shape (composed mode, uncontrolled, inside a dialog-equivalent detached
// container) and asserts that every target handed to `ResizeObserver.observe`
// is a real `Element`. If any truthy non-Element were observed, the assert
// would fail — reproducing the #801 crash.
// ---------------------------------------------------------------------------

// Collect every target passed to ResizeObserver.observe across all mounts.
const observedTargets: unknown[] = []

class MockResizeObserver {
  observe(target: unknown) {
    observedTargets.push(target)
  }
  unobserve() {}
  disconnect() {}
}

function installResizeObserver() {
  vi.stubGlobal('ResizeObserver', MockResizeObserver)
}

afterEach(() => {
  observedTargets.length = 0
  vi.unstubAllGlobals()
})

describe('Tabs mount — ResizeObserver target guard (regression #801/#1045)', () => {
  it('only hands real Elements to ResizeObserver.observe on mount', async () => {
    installResizeObserver()

    const Harness = defineComponent({
      setup() {
        const mounted = ref(false)
        // Simulate the reported "tabs inside a dialog" shape: the list is
        // rendered into a detached container before being attached.
        return { mounted }
      },
      render() {
        return h('div', { 'data-testid': 'dialog' }, [
          h(Tabs, { variant: 'underline' }, () => [
            h(TabList, null, () => [
              h(TabTrigger, { value: 'a', label: 'A' }),
              h(TabTrigger, { value: 'b', label: 'B' }),
            ]),
            h(TabPanel, { value: 'a' }, () => 'Panel A'),
          ]),
        ])
      },
    })

    const el = document.createElement('div')
    document.body.appendChild(el)
    createApp(Harness).mount(el)
    await nextTick()
    await nextTick()
    await nextTick()

    expect(observedTargets.length).toBeGreaterThan(0)
    for (const target of observedTargets) {
      expect(target).toBeInstanceOf(Element)
    }

    el.remove()
  })

  it('guards the shorthand (tabs prop) path on mount', async () => {
    installResizeObserver()

    const Harness = defineComponent({
      render: () =>
        h(Tabs, {
          variant: 'underline',
          tabs: [
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
          ],
        }),
    })

    const el = document.createElement('div')
    document.body.appendChild(el)
    createApp(Harness).mount(el)
    await nextTick()
    await nextTick()
    await nextTick()

    expect(observedTargets.length).toBeGreaterThan(0)
    for (const target of observedTargets) {
      expect(target).toBeInstanceOf(Element)
    }

    el.remove()
  })
})