/**
 * @vitest-environment jsdom
 */

import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import MenuItemContent from './MenuItemContent.vue'
import { menuClasses } from './utils'

describe('MenuItemContent', () => {
  it('adds title tooltip to truncated label and description', () => {
    const host = document.createElement('div')
    const app = createApp(MenuItemContent, {
      item: {
        label: 'Send for Secondary Approval',
        description: 'Requires approval from head of finance',
      },
      close: () => {},
    })
    app.mount(host)

    const labelEl = host.querySelector('.truncate:not(.text-p-sm)')
    expect(labelEl).not.toBeNull()
    expect(labelEl?.getAttribute('title')).toBe('Send for Secondary Approval')

    const descEl = host.querySelector('.truncate.text-p-sm')
    expect(descEl).not.toBeNull()
    expect(descEl?.getAttribute('title')).toBe(
      'Requires approval from head of finance',
    )

    app.unmount()
  })

  it('defines max-width containment without clamping matchTriggerWidth', () => {
    expect(menuClasses.contentMaxWidth).toBe(
      'max-w-[min(26rem,calc(100vw-2rem))]',
    )
    expect(menuClasses.content).not.toContain('max-w-')
  })
})
