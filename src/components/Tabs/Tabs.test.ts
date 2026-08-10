// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, createApp } from 'vue'
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
