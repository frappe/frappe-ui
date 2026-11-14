/**
 * @vitest-environment jsdom
 */

import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import ItemListRow from './ItemListRow.vue'

function root(props: Record<string, unknown>) {
  const host = document.createElement('div')
  const app = createApp(ItemListRow, props)
  app.mount(host)
  const el = host.firstElementChild
  const aria = el?.getAttribute('aria-disabled')
  app.unmount()
  return aria
}

describe('ItemListRow disabled', () => {
  it('announces a disabled row as unavailable', () => {
    expect(root({ disabled: true })).toBe('true')
  })

  it('leaves an enabled row without aria-disabled', () => {
    expect(root({})).toBeNull()
  })
})
