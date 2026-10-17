import type { Theme } from 'vitepress'
import { createMemoryHistory, createRouter } from 'vue-router'
import { h } from 'vue'
import {
  theme as DocsTheme,
  sidebarStoriesKey,
  type SidebarStoryLoader,
} from 'frappe-ui/vitepress'
// Apps get these tokens from the `frappe-ui/charts` barrel. The docs alias
// `frappe-ui` at src and render some charts without importing the barrel, so
// pull the stylesheet in by path here.
import 'frappe-ui/charts/style.css'
import Layout from './Layout.vue'

// Every story, lazily, for the sidebar's hover-card previews. Keyed by the
// same `<Component>-<Story>` id `<ComponentPreview>` takes. Chart stories sit
// in `src/charts/stories` but are named `Charts-…`, so ids match ignoring case.
const storyModules = import.meta.glob([
  '../../../src/components/*/stories/*.vue',
  '../../../src/charts/stories/*.vue',
  '../../../experimental/*/stories/*.vue',
])
const storiesById = Object.fromEntries(
  Object.entries(storyModules).map(([file, load]) => {
    const [, component, story] = file.match(/([^/]+)\/stories\/([^/]+)\.vue$/)!
    return [`${component}-${story}`.toLowerCase(), load]
  }),
)
const loadSidebarStory: SidebarStoryLoader = (id) =>
  storiesById[id.toLowerCase()] as ReturnType<SidebarStoryLoader>

// VitePress runs its own routing, but frappe-ui components like Breadcrumbs,
// Sidebar and SidebarRail render `<router-link>` and call `useRouter()`.
// Recipes are standalone app screens, so give the app a real (in-memory)
// vue-router: links resolve to `<a>` and no injection warnings fire. It never
// drives the URL.
const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: { render: () => h('div') } }],
})

// Reuse the shared prose theme (ComponentPreview, Props/Slots/EmitsTable,
// shared Layout). Swap in a frappe-ui Layout that adds the marketing Home +
// showcase Navbar. Each component's `<Name>.playground.vue` is imported by
// its own page — see transformPlayground in componentTransformer.
export default {
  ...DocsTheme,
  Layout,
  enhanceApp(ctx) {
    DocsTheme.enhanceApp?.(ctx)
    ctx.app.use(router)
    ctx.app.provide(sidebarStoriesKey, loadSidebarStory)

    // A demo whose component throws in setup() (e.g. a `<router-link>` pointing at
    // a named route this stub router doesn't register) must not blank the whole
    // page. Log it and let VitePress render the rest — the broken demo is the
    // only casualty. `info` is a bare docs URL in production builds, so name the
    // component too: without it every failure logs an identical, untraceable line.
    ctx.app.config.errorHandler = (err, instance, info) => {
      const type = instance?.$?.type as { __file?: string; __name?: string }
      const where = type?.__file ?? type?.__name ?? 'unknown component'
      console.error(`[docs] demo render error in ${where} (${info}):`, err)
    }
  },
} satisfies Theme
