/**
 * @vitest-environment jsdom
 *
 * Every component that renders an `href` from data keeps it only when it is
 * relative or uses a link scheme. A `javascript:` or `data:` URL would run
 * script in the app's origin on one click.
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick, type App, type VNode } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import SidebarItem from './Sidebar/SidebarItem.vue'
import SidebarRailItem from './SidebarRail/SidebarRailItem.vue'
import MobileNavItem from './MobileNav/MobileNavItem.vue'
import Breadcrumbs from './Breadcrumbs/Breadcrumbs.vue'
import List from '../molecules/list/List.vue'
import ListRow from '../molecules/list/ListRow.vue'
import CommandPalette from '../../experimental/CommandPalette/CommandPalette.vue'
import CommandPaletteList from '../../experimental/CommandPalette/CommandPaletteList.vue'
import CommandPaletteItem from '../../experimental/CommandPalette/CommandPaletteItem.vue'

// jsdom has no layout, so reka's scroll-the-highlight-into-view call throws.
Element.prototype.scrollIntoView = vi.fn()

const UNSAFE_HREFS = [
  'javascript:void 0',
  ' JaVaScRiPt:void 0',
  '\u0001javascript:void 0',
  'java\tscript:void 0',
  'data:text/html,<p>x</p>',
  'vbscript:x',
]

const SAFE_HREFS = [
  '/app/notes',
  'notes/1',
  '#section',
  '?q=1',
  'https://frappe.io/path',
  '//frappe.io/path',
  'mailto:hello@frappe.io',
  'tel:+911234567890',
]

// Without a router, a string `route` becomes a plain `href`.
const NO_ROUTER = 'SidebarItem (route, no router)'

const COMPONENTS: Record<string, (href: string) => VNode> = {
  SidebarItem: (href) => h(SidebarItem, { label: 'Notes', href }),
  [NO_ROUTER]: (href) => h(SidebarItem, { label: 'Notes', route: href }),
  SidebarRailItem: (href) => h(SidebarRailItem, { label: 'Notes', href }),
  MobileNavItem: (href) => h(MobileNavItem, { label: 'Notes', href }),
  Breadcrumbs: (href) =>
    h(Breadcrumbs, {
      items: [
        { label: 'Home', href: '/' },
        { label: 'Notes', href },
      ],
    }),
  ListRow: (href) =>
    h(List, null, () => [h(ListRow, { value: '1', href }, () => 'Row')]),
  CommandPaletteItem: (href) =>
    h(CommandPalette, { open: true }, () => [
      h(CommandPaletteList, () => [
        h(CommandPaletteItem, { value: 'notes', as: 'a', href }, () => 'Notes'),
      ]),
    ]),
}

let app: App | null = null

afterEach(() => {
  app?.unmount()
  app = null
  document.body.innerHTML = ''
})

async function renderedHrefs(
  render: () => VNode,
  withRouter: boolean,
): Promise<string[]> {
  const host = document.createElement('div')
  document.body.appendChild(host)
  app = createApp({ render })
  if (withRouter) {
    const routes = [{ path: '/:path(.*)*', component: { render: () => null } }]
    app.use(createRouter({ history: createMemoryHistory(), routes }))
  }
  app.mount(host)
  await nextTick()
  // CommandPalette teleports into the body, so read the whole document.
  return Array.from(document.querySelectorAll('a[href]')).map(
    (el) => el.getAttribute('href') ?? '',
  )
}

describe.each(Object.entries(COMPONENTS))('%s', (name, render) => {
  const withRouter = name !== NO_ROUTER

  it.each(UNSAFE_HREFS)('drops the unsafe href %j', async (href) => {
    const hrefs = await renderedHrefs(() => render(href), withRouter)
    expect(hrefs).not.toContain(href)
  })

  it.each(SAFE_HREFS)('keeps the href %j', async (href) => {
    const hrefs = await renderedHrefs(() => render(href), withRouter)
    expect(hrefs).toContain(href)
  })
})
