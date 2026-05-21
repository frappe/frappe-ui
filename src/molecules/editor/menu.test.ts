/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi } from 'vitest'
import { createApp, defineComponent, h } from 'vue'

vi.mock('@tiptap/extension-bubble-menu', () => ({
  BubbleMenu: defineComponent({
    props: ['editor', 'options'],
    setup(_props, { slots }) {
      return () => h('div', { 'data-testid': 'bubble-menu' }, slots.default?.())
    },
  }),
}))

vi.mock('@tiptap/extension-floating-menu', () => ({
  FloatingMenu: defineComponent({
    props: ['editor', 'options'],
    setup(_props, { slots }) {
      return () => h('div', { 'data-testid': 'floating-menu' }, slots.default?.())
    },
  }),
}))

function mount(component: any, props: Record<string, any>) {
  const root = document.createElement('div')
  createApp({ render: () => h(component, props) }).mount(root)
  return root
}

function fakeEditor() {
  const calls: string[] = []
  const editor: any = {
    active: new Set(['bold']),
    canRun: true,
    isActive: vi.fn((name: string) => editor.active.has(name)),
    can: () => ({ chain: () => chain }),
    chain: () => chain,
  }
  const chain: any = new Proxy(
    {},
    {
      get(_target, prop: string) {
        return (...args: any[]) => {
          calls.push(`${prop}:${args.join(',')}`)
          if (prop === 'run') return editor.canRun
          return chain
        }
      },
    },
  )
  return { editor, calls }
}

describe('editor menu primitives and presets', () => {
  it('renders command items, separators, groups, active state, and disabled state in a fixed menu', async () => {
    const { EditorFixedMenu, Bold, Italic, HeadingGroup, Separator } = await import('./index')
    const { editor } = fakeEditor()
    editor.canRun = false

    const root = mount(EditorFixedMenu, {
      editor,
      buttons: [Bold, Separator, Italic, HeadingGroup],
    })

    expect(root.querySelector('[data-slot="fixed-menu"]')).toBeTruthy()
    expect(root.querySelector('[data-slot="menu-separator"]')).toBeTruthy()
    expect(root.querySelector('[aria-label="Bold"]')?.getAttribute('aria-pressed')).toBe('true')
    expect((root.querySelector('[aria-label="Italic"]') as HTMLButtonElement).disabled).toBe(true)
    expect(root.textContent).toContain('Heading')
    expect(root.textContent).toContain('Heading 2')
  })

  it('command item actions call the editor chain', async () => {
    const { EditorFixedMenu, Bold } = await import('./index')
    const { editor, calls } = fakeEditor()

    const root = mount(EditorFixedMenu, { editor, buttons: [Bold] })
    calls.length = 0
    ;(root.querySelector('[aria-label="Bold"]') as HTMLButtonElement).click()

    expect(calls.join('|')).toContain('focus:|toggleBold:|run:')
  })

  it('renders bubble and floating menus with the shared item shape', async () => {
    const { EditorBubbleMenu, EditorFloatingMenu, Bold } = await import('./index')
    const { editor } = fakeEditor()

    expect(mount(EditorBubbleMenu, { editor, buttons: [Bold], options: {} }).textContent).toContain('Bold')
    expect(mount(EditorFloatingMenu, { editor, buttons: [Bold], options: {} }).textContent).toContain('Bold')
  })

  it('exports menu presets as plain arrays', async () => {
    const { commentToolbar, articleToolbar, minimalToolbar } = await import('./index')

    expect(Array.isArray(commentToolbar)).toBe(true)
    expect(Array.isArray(articleToolbar)).toBe(true)
    expect(minimalToolbar.map((item: any) => item.label)).toEqual(['Bold', 'Italic', 'Link'])
  })
})
