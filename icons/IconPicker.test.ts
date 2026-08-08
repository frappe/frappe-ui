/**
 * @vitest-environment jsdom
 */

import { describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'
import IconPicker from './IconPicker.vue'
import { loadLucideIconSet } from './lucideIconSet'

function mount(props: Record<string, unknown> = {}) {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp(IconPicker, props)
  app.mount(host)
  return {
    host,
    input: () => host.querySelector('input') as HTMLInputElement,
    unmount: () => {
      app.unmount()
      host.remove()
    },
  }
}

describe('lucide icon set', () => {
  it('lists every icon by its bare kebab-case name, sorted and deduped', async () => {
    const { names, markup } = await loadLucideIconSet()

    expect(names.length).toBeGreaterThan(1000)
    expect(new Set(names).size).toBe(names.length)
    expect([...names].sort()).toEqual(names)
    expect(names).toContain('star')
    expect(names.some((name) => name.startsWith('lucide-'))).toBe(false)
    expect(Object.keys(markup)).toHaveLength(names.length)
  })

  it('redraws lucide markup at the design system stroke width', async () => {
    const { markup } = await loadLucideIconSet()

    expect(markup.star).toContain('<svg')
    expect(markup.star).toContain('stroke-width="1.5"')
    expect(markup.star).not.toContain('stroke-width="2"')
  })

  it('hands back the same set on a second call', async () => {
    expect(await loadLucideIconSet()).toBe(await loadLucideIconSet())
  })
})

describe('IconPicker', () => {
  it('renders with default props', () => {
    const picker = mount()

    expect(picker.input()).toBeTruthy()
    expect(picker.input().placeholder).toBe('Select an icon...')
    expect(picker.input().value).toBe('')

    picker.unmount()
  })

  it('shows a lucide value as a readable label and draws its icon', async () => {
    const picker = mount({ modelValue: 'lucide-star' })

    expect(picker.input().value).toBe('Star')

    const { markup } = await loadLucideIconSet()
    await vi.waitFor(() =>
      expect(picker.host.innerHTML).toContain(
        markup.star.match(/<path d="([^"]+)"/)?.[1],
      ),
    )

    picker.unmount()
  })

  it('draws a value it cannot offer, such as an emoji, next to an empty search box', () => {
    const picker = mount({ modelValue: '🚀' })

    expect(picker.host.textContent).toContain('🚀')
    expect(picker.input().value).toBe('')

    picker.unmount()
  })

  it('clears the value when the search box is emptied', () => {
    const emitted: unknown[] = []
    const picker = mount({
      modelValue: 'lucide-star',
      'onUpdate:modelValue': (value: unknown) => emitted.push(value),
    })

    picker.input().value = ''
    picker.input().dispatchEvent(new Event('input'))

    expect(emitted).toEqual([null])

    picker.unmount()
  })

  it('does not touch the DOM outside its own root', () => {
    const picker = mount()

    // The old spritePlugin prepended ~1900 <symbol> nodes to <body>.
    expect(document.getElementById('lucide-sprite')).toBeNull()

    picker.unmount()
  })
})
