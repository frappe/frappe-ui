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
import CommandPaletteList from './CommandPaletteList.vue'

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
  title?: string
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
            title: options.title,
            filterable: options.filterable,
            'onUpdate:query': (value: string) => (query.value = value),
            'onUpdate:open': options.onUpdateOpen,
            onSelect: options.onSelect,
          },
          () => [
            h(CommandPaletteInput, { placeholder: 'Search commands' }),
            h(CommandPaletteList, () => [
              h(CommandPaletteGroup, { label: 'Pages' }, () => [
                h(
                  CommandPaletteItem,
                  { value: 'inbox', keywords: ['mail'] },
                  () => 'Inbox',
                ),
                h(CommandPaletteItem, { value: 'settings' }, () => 'Settings'),
              ]),
              h(CommandPaletteGroup, { label: 'Actions' }, () => [
                h(
                  CommandPaletteItem,
                  { value: 'new-task', label: 'New task' },
                  {
                    default: () => 'New task',
                    suffix: () => 'Mod+N',
                  },
                ),
              ]),
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

function input() {
  return document.querySelector(
    '[data-slot="command-palette-input"] input',
  ) as HTMLInputElement
}

/** Reka defers its highlight work by a tick of its own. */
async function flush() {
  await nextTick()
  await nextTick()
  await nextTick()
}

/** Reka listens for the navigation keys on the filter field. */
function press(key: string) {
  input().dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
  )
}

describe('CommandPalette', () => {
  it('renders every part with its data-slot hook', async () => {
    mount()
    await nextTick()
    for (const slot of [
      'command-palette',
      'command-palette-input',
      'command-palette-list',
      'command-palette-group',
      'command-palette-item',
      'command-palette-footer',
    ]) {
      expect(document.querySelector(`[data-slot="${slot}"]`)).not.toBeNull()
    }
    expect(labels()).toEqual(['Inbox', 'Settings', 'New taskMod+N'])
  })

  it('lets the listbox own groups and options only', async () => {
    // A listbox may own `option` and `group` and nothing else, so the field,
    // the empty state and the footer are its siblings, never its children.
    mount()
    await nextTick()
    const listbox = document.querySelector('[role="listbox"]') as HTMLElement
    expect(listbox.dataset.slot).toBe('command-palette-list')
    const roles = Array.from(listbox.children).map((el) =>
      el.getAttribute('role'),
    )
    expect(roles).toEqual(['group', 'group'])
    for (const slot of [
      'command-palette-input',
      'command-palette-footer',
      'command-palette-empty',
    ]) {
      expect(listbox.querySelector(`[data-slot="${slot}"]`)).toBeNull()
    }
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
    // The message is not a row and the focus stays in the field, so a live
    // region is the only way it reaches a screen reader.
    expect(empty.closest('[role="status"]')).not.toBeNull()
  })

  it('does not quote an empty query in the default empty message', async () => {
    // `empty` is true whenever nothing is on screen, which includes a palette
    // that has been given no rows at all. Quoting the query gives `for ""`.
    const Harness = defineComponent({
      setup() {
        return () =>
          h(CommandPalette, { open: true }, () => [
            h(CommandPaletteList, () => []),
            h(CommandPaletteEmpty),
          ])
      },
    })
    const host = document.createElement('div')
    document.body.appendChild(host)
    app = createApp(Harness)
    app.mount(host)
    await flush()
    const empty = document.querySelector(
      '[data-slot="command-palette-empty"]',
    ) as HTMLElement
    expect(empty.textContent?.trim()).toBe('No results')
  })

  it('names the listbox with the dialog title', async () => {
    // Without a name the listbox is an unlabelled control. The title is the
    // caller's own string and already names the dialog, so it names both.
    mount()
    await flush()
    expect(
      document.querySelector('[role="listbox"]')?.getAttribute('aria-label'),
    ).toBe('Command palette')
    app?.unmount()
    document.body.innerHTML = ''

    mount({ title: 'Jump to' })
    await flush()
    expect(
      document.querySelector('[role="listbox"]')?.getAttribute('aria-label'),
    ).toBe('Jump to')
  })

  it('lets go of the highlight when the filter empties the list', async () => {
    // Reka keeps the highlight on a row the filter has unmounted, so the field
    // goes on pointing `aria-activedescendant` at an id that has left the
    // document. axe grades that critical, and the empty state is announcing at
    // the same time.
    const { query } = mount()
    await flush()
    expect(input().getAttribute('aria-activedescendant')).toBe(items()[0].id)

    query.value = 'zzz'
    await flush()
    expect(items()).toEqual([])
    expect(input().getAttribute('aria-activedescendant')).toBeNull()

    // The ordinary path still works: narrowing to one row highlights it.
    query.value = 'settings'
    await flush()
    expect(labels()).toEqual(['Settings'])
    expect(input().getAttribute('aria-activedescendant')).toBe(items()[0].id)
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
    await flush()
    const item = items()[1]

    // `pointermove` and nothing else. Reka binds no mouse event, so the wrong
    // name is a silent no-op: the row never moves and an assertion about the
    // highlight reads the row that was already there.
    item.dispatchEvent(new Event('mouseover', { bubbles: true }))
    await flush()
    expect(item.getAttribute('data-state')).toBeNull()
    expect(items()[0].getAttribute('data-state')).toBe('active')

    item.dispatchEvent(new Event('pointermove', { bubbles: true }))
    await flush()
    expect(item.getAttribute('data-state')).toBe('active')
    expect(items()[0].getAttribute('data-state')).toBeNull()
    // Reka highlights on hover with focus off, so the caret stays where the
    // user is typing while the pointer roams.
    expect(document.activeElement).toBe(input())
  })

  it('renders a disabled item with data-disabled and no data-state', async () => {
    const Harness = defineComponent({
      setup() {
        return () =>
          h(CommandPalette, { open: true }, () => [
            h(CommandPaletteList, () => [
              h(
                CommandPaletteItem,
                { value: 'x', disabled: true },
                () => 'Disabled',
              ),
            ]),
          ])
      },
    })
    const host = document.createElement('div')
    document.body.appendChild(host)
    app = createApp(Harness)
    app.mount(host)
    await flush()
    const item = items()[0]
    expect(item.getAttribute('data-disabled')).toBe('')
    // A disabled row is left out of the keyboard's collection, so the
    // highlight-the-first-item pass skips it.
    expect(item.getAttribute('data-state')).toBeNull()
  })

  it('renders an item as a real link when `as` is "a"', async () => {
    const Harness = defineComponent({
      setup() {
        return () =>
          h(CommandPalette, { open: true }, () => [
            h(CommandPaletteList, () => [
              h(
                CommandPaletteItem,
                { value: '/docs', as: 'a', href: '/docs' },
                () => 'Docs',
              ),
            ]),
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

  it('puts the keyboard on the first item when it opens', async () => {
    mount()
    await flush()
    expect(items()[0].getAttribute('data-state')).toBe('active')
  })

  it('moves the active item with the arrow keys', async () => {
    mount()
    await flush()
    press('ArrowDown')
    await flush()
    expect(items()[1].getAttribute('data-state')).toBe('active')
    press('ArrowDown')
    await flush()
    expect(items()[2].getAttribute('data-state')).toBe('active')
    press('ArrowUp')
    await flush()
    expect(items()[1].getAttribute('data-state')).toBe('active')
  })

  it('keeps the focus in the field while the keyboard walks the list', async () => {
    mount()
    await flush()
    press('ArrowDown')
    await flush()
    expect(document.activeElement).toBe(input())
  })

  it('picks the active item with Enter and closes', async () => {
    const onSelect = vi.fn()
    const onUpdateOpen = vi.fn()
    mount({ onSelect, onUpdateOpen })
    await flush()
    press('ArrowDown')
    await flush()
    press('Enter')
    await flush()
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect.mock.calls[0][0]).toBe('settings')
    expect(onUpdateOpen).toHaveBeenCalledWith(false)
  })

  it('re-aims the keyboard at the first match while typing', async () => {
    const { query } = mount()
    await flush()
    press('ArrowDown')
    await flush()
    query.value = 'new'
    await flush()
    expect(labels()).toEqual(['New taskMod+N'])
    expect(items()[0].getAttribute('data-state')).toBe('active')
  })

  it('marks the active row when the values are objects', async () => {
    // Regression: comparing the highlight against a copy of the value made
    // `data-state` never appear for object values, because a `ref` wraps an
    // object in a reactive proxy. The highlight is read off the element now.
    const rows = [{ title: 'One' }, { title: 'Two' }]
    const onSelect = vi.fn()
    const Harness = defineComponent({
      setup() {
        return () =>
          h(CommandPalette, { open: true, onSelect }, () => [
            h(CommandPaletteInput),
            h(CommandPaletteList, () =>
              rows.map((row) =>
                h(CommandPaletteItem, { value: row }, () => row.title),
              ),
            ),
          ])
      },
    })
    const host = document.createElement('div')
    document.body.appendChild(host)
    app = createApp(Harness)
    app.mount(host)
    await flush()
    expect(items()[0].getAttribute('data-state')).toBe('active')
    press('ArrowDown')
    await flush()
    expect(items()[1].getAttribute('data-state')).toBe('active')
    press('Enter')
    await flush()
    expect(onSelect.mock.calls[0][0]).toBe(rows[1])
  })

  it('hangs each option straight off its group, with nothing in between', async () => {
    // A listbox owns options and groups. A wrapper element between the two
    // breaks that, so the row carries its own inset instead.
    mount()
    await nextTick()
    const group = document.querySelector('[data-slot="command-palette-group"]')
    expect(items()[0].parentElement).toBe(group)
  })

  it('filters items that carry no `label` when it opens with a query', async () => {
    // Regression: the filter reads the label off the mounted element, so an
    // item that is hidden on its first render never gets measured and stays
    // hidden for as long as the query lasts.
    mount({ query: 'sett' })
    await flush()
    expect(labels()).toEqual(['Settings'])
  })

  it('filters items that arrive after mount, with a query already set', async () => {
    const rows = ref([{ value: 'inbox', title: 'Inbox' }])
    const Harness = defineComponent({
      setup() {
        return () =>
          h(CommandPalette, { open: true, query: 'sett' }, () => [
            h(CommandPaletteInput),
            h(CommandPaletteList, () =>
              rows.value.map((row) =>
                h(CommandPaletteItem, { value: row.value }, () => row.title),
              ),
            ),
          ])
      },
    })
    const host = document.createElement('div')
    document.body.appendChild(host)
    app = createApp(Harness)
    app.mount(host)
    await flush()
    expect(labels()).toEqual([])

    rows.value = [...rows.value, { value: 'settings', title: 'Settings' }]
    await flush()
    expect(labels()).toEqual(['Settings'])
  })

  it('warns when the rows are not inside a CommandPaletteList', async () => {
    // Without the list there is no listbox: the rows draw, and then nothing
    // else works. Nothing in the DOM says so, so the warning has to.
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const Harness = defineComponent({
      setup() {
        return () =>
          h(CommandPalette, { open: true }, () => [
            h(CommandPaletteGroup, { label: 'Pages' }, () => [
              h(CommandPaletteItem, { value: 'inbox' }, () => 'Inbox'),
            ]),
          ])
      },
    })
    const host = document.createElement('div')
    document.body.appendChild(host)
    app = createApp(Harness)
    app.mount(host)
    await flush()

    expect(
      warn.mock.calls.flat().filter((arg) => String(arg).startsWith('[frappe')),
    ).toEqual([
      '[frappe-ui] CommandPaletteGroup has to render inside a CommandPaletteList.',
      '[frappe-ui] CommandPaletteItem has to render inside a CommandPaletteList.',
    ])
    expect(document.querySelector('[role="listbox"]')).toBeNull()
    warn.mockRestore()
  })

  it('warns about an item the filter can never narrow away', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    // Reka warns about the dialog description here too, so read ours only.
    const ours = () =>
      warn.mock.calls
        .flat()
        .filter((arg) => String(arg).startsWith('[frappe-ui]'))

    const { query } = mount()
    await flush()
    query.value = 'in'
    await flush()
    expect(ours()).toEqual([])
    app?.unmount()
    document.body.innerHTML = ''

    // Text that arrives after the row is on screen is not the case the
    // warning is for. The item reads it in `onUpdated` and filters fine.
    const title = ref('')
    const lateQuery = ref('')
    const Late = defineComponent({
      setup() {
        return () =>
          h(
            CommandPalette,
            {
              open: true,
              query: lateQuery.value,
              'onUpdate:query': (value: string) => (lateQuery.value = value),
            },
            () => [
              h(CommandPaletteList, () => [
                h(CommandPaletteItem, { value: 'inbox' }, () => title.value),
              ]),
            ],
          )
      },
    })
    const lateHost = document.createElement('div')
    document.body.appendChild(lateHost)
    app = createApp(Late)
    app.mount(lateHost)
    await flush()
    title.value = 'Inbox'
    await flush()
    lateQuery.value = 'in'
    await flush()
    expect(ours()).toEqual([])
    app?.unmount()
    document.body.innerHTML = ''

    // An icon and nothing else, so there is nothing for a query to narrow.
    const iconQuery = ref('')
    const Harness = defineComponent({
      setup() {
        return () =>
          h(
            CommandPalette,
            {
              open: true,
              query: iconQuery.value,
              'onUpdate:query': (value: string) => (iconQuery.value = value),
            },
            () => [
              h(CommandPaletteList, () => [
                h(CommandPaletteItem, { value: 'inbox' }, () =>
                  h('span', { class: 'lucide-inbox' }),
                ),
              ]),
            ],
          )
      },
    })
    const host = document.createElement('div')
    document.body.appendChild(host)
    app = createApp(Harness)
    app.mount(host)
    await flush()
    // Nothing to answer yet, so nothing to warn about.
    expect(ours()).toEqual([])

    iconQuery.value = 'in'
    await flush()
    expect(ours()).toEqual([
      '[frappe-ui] CommandPaletteItem draws no text, so the filter keeps it under every query. Give it a `label`.',
    ])

    // Once, not once per keystroke.
    iconQuery.value = 'inb'
    await flush()
    expect(ours()).toHaveLength(1)
    warn.mockRestore()
  })

  it('leaves no row marked selected when the handler keeps it open', async () => {
    // `preventDefault` is how a handler keeps the palette open, and it is also
    // how reka is told not to record the pick, so no row can end up selected
    // while the palette is on screen. `active` is the only row state there is.
    const rows = [{ title: 'One' }, { title: 'Two' }]
    const Harness = defineComponent({
      setup() {
        return () =>
          h(
            CommandPalette,
            {
              open: true,
              onSelect: (_v: any, e: CustomEvent) => e.preventDefault(),
            },
            () => [
              h(CommandPaletteInput),
              h(CommandPaletteList, () =>
                rows.map((row) =>
                  h(CommandPaletteItem, { value: row }, () => row.title),
                ),
              ),
            ],
          )
      },
    })
    const host = document.createElement('div')
    document.body.appendChild(host)
    app = createApp(Harness)
    app.mount(host)
    await flush()
    items()[1].click()
    await flush()
    expect(items().map((item) => item.getAttribute('aria-selected'))).toEqual([
      'false',
      'false',
    ])
    expect(items().map((item) => item.getAttribute('data-state'))).toEqual([
      'active',
      null,
    ])
  })

  it('writes the typed text back through `update:query`', async () => {
    const { query } = mount()
    await nextTick()
    expect(input().placeholder).toBe('Search commands')
    input().value = 'set'
    input().dispatchEvent(new Event('input'))
    await nextTick()
    expect(query.value).toBe('set')
  })
})
