/**
 * @vitest-environment jsdom
 *
 * The palette teleports into `document.body`, so every query below runs
 * against the document rather than the mount host.
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref, type App } from 'vue'
import CommandPalette from './CommandPalette.vue'
import CommandPaletteEmpty from './CommandPaletteEmpty.vue'
import CommandPaletteFooter from './CommandPaletteFooter.vue'
import CommandPaletteGroup from './CommandPaletteGroup.vue'
import CommandPaletteInput from './CommandPaletteInput.vue'
import CommandPaletteItem from './CommandPaletteItem.vue'

// jsdom has no layout, so reka's scroll-the-highlight-into-view call throws.
Element.prototype.scrollIntoView = vi.fn()

let app: App | null = null

afterEach(() => {
  app?.unmount()
  app = null
  document.body.innerHTML = ''
})

interface MountOptions {
  query?: string
  filterable?: boolean
  onSelect?: (value: any, event: CustomEvent) => void
  onUpdateOpen?: (value: boolean) => void
}

/** Two groups of two items, the shape every fork renders. */
function mount(options: MountOptions = {}) {
  const query = ref(options.query ?? '')
  const Harness = defineComponent({
    setup() {
      return () =>
        h(
          CommandPalette,
          {
            open: true,
            query: query.value,
            filterable: options.filterable,
            'onUpdate:query': (value: string) => (query.value = value),
            'onUpdate:open': options.onUpdateOpen,
            onSelect: options.onSelect,
          },
          () => [
            h(CommandPaletteInput, { placeholder: 'Search commands' }),
            h(CommandPaletteGroup, { title: 'Pages' }, () => [
              h(
                CommandPaletteItem,
                { value: 'inbox', keywords: ['mail'] },
                () => 'Inbox',
              ),
              h(CommandPaletteItem, { value: 'settings' }, () => 'Settings'),
            ]),
            h(CommandPaletteGroup, { title: 'Actions' }, () => [
              h(
                CommandPaletteItem,
                { value: 'new-task', label: 'New task' },
                {
                  default: () => 'New task',
                  suffix: () => 'Mod+N',
                },
              ),
            ]),
            h(CommandPaletteEmpty),
            h(CommandPaletteFooter, () => 'Enter to run'),
          ],
        )
    },
  })
  const host = document.createElement('div')
  document.body.appendChild(host)
  app = createApp(Harness)
  app.mount(host)
  return { query }
}

function items() {
  return Array.from(
    document.querySelectorAll('[data-slot="command-palette-item"]'),
  ) as HTMLElement[]
}

function labels() {
  return items().map((el) => el.textContent?.trim())
}

describe('CommandPalette', () => {
  it('renders every part with its data-slot hook', async () => {
    mount()
    await nextTick()
    for (const slot of [
      'command-palette',
      'command-palette-input',
      'command-palette-group',
      'command-palette-item',
      'command-palette-footer',
    ]) {
      expect(document.querySelector(`[data-slot="${slot}"]`)).not.toBeNull()
    }
    expect(labels()).toEqual(['Inbox', 'Settings', 'New taskMod+N'])
  })

  it('filters items against the query by default', async () => {
    const { query } = mount()
    await nextTick()
    query.value = 'sett'
    await nextTick()
    expect(labels()).toEqual(['Settings'])
  })

  it('matches keywords as well as the label', async () => {
    const { query } = mount()
    await nextTick()
    query.value = 'mail'
    await nextTick()
    expect(labels()).toEqual(['Inbox'])
  })

  it('filters on `label`, not on what `#suffix` draws', async () => {
    const { query } = mount()
    await nextTick()
    // 'Mod+N' is the shortcut hint in `#suffix`. It must not be searchable.
    query.value = 'mod+n'
    await nextTick()
    expect(labels()).toEqual([])
  })

  it('keeps every item when `filterable` is false', async () => {
    const { query } = mount({ filterable: false })
    await nextTick()
    query.value = 'nothing matches this'
    await nextTick()
    expect(labels()).toEqual(['Inbox', 'Settings', 'New taskMod+N'])
  })

  it('hides a group whose items all filter out', async () => {
    const { query } = mount()
    await nextTick()
    query.value = 'inbox'
    await nextTick()
    const groups = Array.from(
      document.querySelectorAll('[data-slot="command-palette-group"]'),
    ) as HTMLElement[]
    expect(groups).toHaveLength(2)
    expect(groups[0].style.display).toBe('')
    expect(groups[1].style.display).toBe('none')
  })

  it('shows CommandPaletteEmpty only when the filter hides everything', async () => {
    const { query } = mount()
    await nextTick()
    expect(
      document.querySelector('[data-slot="command-palette-empty"]'),
    ).toBeNull()
    query.value = 'zzz'
    await nextTick()
    const empty = document.querySelector(
      '[data-slot="command-palette-empty"]',
    ) as HTMLElement
    expect(empty).not.toBeNull()
    expect(empty.textContent).toContain('zzz')
  })

  it('emits `select` with the value and closes', async () => {
    const onSelect = vi.fn()
    const onUpdateOpen = vi.fn()
    mount({ onSelect, onUpdateOpen })
    await nextTick()
    items()[0].click()
    await nextTick()
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect.mock.calls[0][0]).toBe('inbox')
    expect(onSelect.mock.calls[0][1].detail.originalEvent).toBeInstanceOf(Event)
    expect(onUpdateOpen).toHaveBeenCalledWith(false)
  })

  it('stays open when the handler prevents the select event', async () => {
    const onUpdateOpen = vi.fn()
    mount({
      onSelect: (_value, event) => event.preventDefault(),
      onUpdateOpen,
    })
    await nextTick()
    items()[0].click()
    await nextTick()
    expect(onUpdateOpen).not.toHaveBeenCalled()
  })

  it('marks the item under the pointer with data-state="active"', async () => {
    mount()
    await nextTick()
    const item = items()[1]
    item.dispatchEvent(new Event('pointermove', { bubbles: true }))
    await nextTick()
    expect(item.getAttribute('data-state')).toBe('active')
    expect(items()[0].getAttribute('data-state')).toBeNull()
  })

  it('renders a disabled item with data-disabled and no data-state', async () => {
    const Harness = defineComponent({
      setup() {
        return () =>
          h(CommandPalette, { open: true }, () => [
            h(
              CommandPaletteItem,
              { value: 'x', disabled: true },
              () => 'Disabled',
            ),
          ])
      },
    })
    const host = document.createElement('div')
    document.body.appendChild(host)
    app = createApp(Harness)
    app.mount(host)
    await nextTick()
    const item = items()[0]
    expect(item.getAttribute('data-disabled')).toBe('')
    expect(item.getAttribute('data-state')).toBeNull()
  })

  it('renders an item as a real link when `as` is "a"', async () => {
    const Harness = defineComponent({
      setup() {
        return () =>
          h(CommandPalette, { open: true }, () => [
            h(
              CommandPaletteItem,
              { value: '/docs', as: 'a', href: '/docs' },
              () => 'Docs',
            ),
          ])
      },
    })
    const host = document.createElement('div')
    document.body.appendChild(host)
    app = createApp(Harness)
    app.mount(host)
    await nextTick()
    const item = items()[0]
    expect(item.tagName).toBe('A')
    expect(item.getAttribute('href')).toBe('/docs')
  })

  it('writes the typed text back through `update:query`', async () => {
    const { query } = mount()
    await nextTick()
    const input = document.querySelector(
      '[data-slot="command-palette-input"] input',
    ) as HTMLInputElement
    expect(input.placeholder).toBe('Search commands')
    input.value = 'set'
    input.dispatchEvent(new Event('input'))
    await nextTick()
    expect(query.value).toBe('set')
  })
})
