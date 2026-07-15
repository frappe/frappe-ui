import {
  defineAsyncComponent,
  type AsyncComponentLoader,
  type Component,
} from 'vue'
import { recipeSlugs } from './slugs'

export type Platform = 'desktop' | 'mobile'

/** One platform-specific screen: its own SFC + demo route (`/recipes/demo/<slug>`). */
export interface RecipeVariant {
  slug: string
  platform: Platform
  /** Render the demo client-side only (e.g. the tiptap editor is not SSR-safe). */
  csr?: boolean
  component: Component
  /**
   * Kick off the dynamic import behind `component` without mounting it. The
   * gallery calls this for the eager (above-the-fold) recipe so its chunk is
   * warm in the shared same-origin HTTP cache by the time the demo iframe's
   * own app boots and imports it — turning that import into a cache hit.
   */
  preload: AsyncComponentLoader
}

/**
 * A single screen in the recipes gallery. A group has a desktop and/or mobile
 * variant the reader toggles between; the shared metadata (title, components)
 * describes the screen regardless of platform.
 */
export interface RecipeGroup {
  /** Stable key used by `<RecipeExample base="…">` and for slugs. */
  base: string
  title: string
  /** Headline frappe-ui components the recipe showcases. */
  components: string[]
  desktop?: RecipeVariant
  mobile?: RecipeVariant
}

// Take the raw dynamic-import loader (not a pre-wrapped component) so we can
// both render it lazily and expose it as `preload` for cache-warming.
function desktop(
  slug: string,
  loader: AsyncComponentLoader,
  csr = false,
): RecipeVariant {
  return {
    slug,
    platform: 'desktop',
    component: defineAsyncComponent(loader),
    preload: loader,
    csr,
  }
}
function mobile(
  slug: string,
  loader: AsyncComponentLoader,
  csr = false,
): RecipeVariant {
  return {
    slug,
    platform: 'mobile',
    component: defineAsyncComponent(loader),
    preload: loader,
    csr,
  }
}

// Full-page, copy-pastable screens. Each variant is one self-contained SFC in
// this folder; the demo route renders it chrome-less for iframes and
// full-screen viewing. Not every group has both platforms yet — the gallery
// only offers the variants that exist.
export const recipeGroups: RecipeGroup[] = [
  {
    base: 'discussions',
    title: 'Discussions',
    components: [
      'DesktopShell',
      'Rail',
      'Sidebar',
      'ScrollArea',
      'List',
      'PageHeader',
      'SettingsDialog',
      'KeyboardShortcutsModal',
    ],
    desktop: desktop(
      'discussions-desktop',
      () => import('./DiscussionsDesktop.vue'),
    ),
    mobile: mobile(
      'discussions-mobile',
      () => import('./DiscussionsMobile.vue'),
    ),
  },
  {
    base: 'compose',
    title: 'Compose',
    components: [
      'DesktopShell',
      'MobileShell',
      'PageHeader',
      'Breadcrumbs',
      'Editor',
      'EditorFixedMenu',
      'EditorContent',
    ],
    desktop: desktop(
      'compose-desktop',
      () => import('./ComposeDesktop.vue'),
      true,
    ),
    mobile: mobile(
      'compose-mobile',
      () => import('./ComposeMobile.vue'),
      true,
    ),
  },
  {
    base: 'deals',
    title: 'Deals',
    components: [
      'DesktopShell',
      'Sidebar',
      'ScrollArea',
      'PageHeader',
      'HoverCard',
      'Dropdown',
    ],
    desktop: desktop(
      'deals-desktop',
      () => import('./DealsDesktop.vue'),
    ),
    mobile: mobile(
      'deals-mobile',
      () => import('./DealsMobile.vue'),
    ),
  },
  {
    base: 'tickets',
    title: 'Tickets',
    components: [
      'DesktopShell',
      'Sidebar',
      'List',
      'ListHeaderCellSort',
      'PageHeader',
      'Badge',
    ],
    desktop: desktop(
      'tickets-desktop',
      () => import('./TicketsDesktop.vue'),
    ),
    mobile: mobile(
      'tickets-mobile',
      () => import('./TicketsMobile.vue'),
    ),
  },
  {
    base: 'mail',
    title: 'Mail',
    components: [
      'DesktopShell',
      'MobileShell',
      'Sidebar',
      'ScrollArea',
      'List',
      'Avatar',
      'Badge',
      'Dropdown',
    ],
    desktop: desktop(
      'mail-desktop',
      () => import('./MailDesktop.vue'),
    ),
    mobile: mobile(
      'mail-mobile',
      () => import('./MailMobile.vue'),
    ),
  },
  {
    base: 'files',
    title: 'Files',
    components: [
      'DesktopShell',
      'MobileShell',
      'Sidebar',
      'List',
      'PageHeader',
      'BottomSheet',
      'Dropdown',
      'Progress',
    ],
    desktop: desktop(
      'files-desktop',
      () => import('./FilesDesktop.vue'),
    ),
    mobile: mobile(
      'files-mobile',
      () => import('./FilesMobile.vue'),
    ),
  },
  {
    base: 'tasks',
    title: 'Tasks',
    components: [
      'DesktopShell',
      'MobileShell',
      'Sidebar',
      'PageHeader',
      'Breadcrumbs',
      'List',
      'Select',
      'Dropdown',
    ],
    desktop: desktop(
      'tasks-desktop',
      () => import('./TasksDesktop.vue'),
    ),
    mobile: mobile(
      'tasks-mobile',
      () => import('./TasksMobile.vue'),
    ),
  },
  {
    base: 'accounting',
    title: 'Accounting',
    components: [
      'DesktopShell',
      'Sidebar',
      'PageHeader',
      'AxisChart',
      'List',
      'Checkbox',
      'TabButtons',
    ],
    desktop: desktop(
      'accounting-desktop',
      () => import('./AccountingDesktop.vue'),
    ),
    mobile: mobile(
      'accounting-mobile',
      () => import('./AccountingMobile.vue'),
    ),
  },
]

// Flat slug → variant map for the demo route (Layout.vue resolves the recipe
// from the `slug` param).
const variantsBySlug = new Map<string, RecipeVariant>()
for (const group of recipeGroups) {
  for (const variant of [group.desktop, group.mobile]) {
    if (variant) variantsBySlug.set(variant.slug, variant)
  }
}

// The demo routes are generated from ./slugs.ts (a vue-free copy the esbuild
// paths loader can import). Fail loudly if the two lists drift — otherwise a
// new recipe silently 404s its demo iframe, or a stale slug renders blank.
const knownSlugs: readonly string[] = recipeSlugs
if (
  variantsBySlug.size !== recipeSlugs.length ||
  [...variantsBySlug.keys()].some((slug) => !knownSlugs.includes(slug))
) {
  throw new Error('recipes registry and slugs.ts are out of sync')
}

export function getRecipe(slug: string): RecipeVariant | undefined {
  return variantsBySlug.get(slug)
}

export function getRecipeGroup(base: string): RecipeGroup | undefined {
  return recipeGroups.find((group) => group.base === base)
}
