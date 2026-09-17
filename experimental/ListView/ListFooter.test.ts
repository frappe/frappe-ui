/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { createApp, h, nextTick, reactive } from 'vue'
// ListFooter.vue is a plain <script setup> without lang="ts", so it has no types.
// @ts-expect-error TS7016
import ListFooter from './ListFooter.vue'

function mountFooter(options: Record<string, unknown>) {
  const state = reactive({ options })
  const host = document.createElement('div')
  const app = createApp({
    render: () => h(ListFooter, { modelValue: 20, options: state.options }),
  })
  app.mount(host)
  return { host, state, app }
}

function pageLengthLabels(host: HTMLElement) {
  return Array.from(host.querySelectorAll('[data-slot="tab-button"]')).map(
    (el) => el.textContent?.trim(),
  )
}

describe('ListFooter', () => {
  it('renders the default page length options', () => {
    const { host, app } = mountFooter({ rowCount: 20, totalCount: 100 })
    expect(pageLengthLabels(host)).toEqual(['20', '50', '100'])
    app.unmount()
  })

  it('updates when pageLengthOptions changes', async () => {
    const { host, state, app } = mountFooter({ rowCount: 20, totalCount: 100 })
    state.options = {
      rowCount: 20,
      totalCount: 100,
      pageLengthOptions: [10, 30],
    }
    await nextTick()
    expect(pageLengthLabels(host)).toEqual(['10', '30'])
    app.unmount()
  })
})
