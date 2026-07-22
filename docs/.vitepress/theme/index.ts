import type { Theme } from 'vitepress'
import { createMemoryHistory, createRouter } from 'vue-router'
import { h } from 'vue'
import { theme as DocsTheme } from 'frappe-ui/vitepress'
import { registerBuilders } from '@/components/builders'
import Layout from './Layout.vue'

// VitePress runs its own routing, but frappe-ui components like Breadcrumbs,
// Sidebar and Rail render `<router-link>` and call `useRouter()`. Recipes are
// standalone app screens, so give the app a real (in-memory) vue-router: links
// resolve to `<a>` and no injection warnings fire. It never drives the URL.
const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: { render: () => h('div') } }],
})

// Reuse the shared prose theme (ComponentPreview, Props/Slots/EmitsTable,
// shared Layout). Swap in a frappe-ui Layout that adds the marketing Home +
// showcase Navbar, and register the *Builder showcase components on top.
export default {
  ...DocsTheme,
  Layout,
  enhanceApp(ctx) {
    DocsTheme.enhanceApp?.(ctx)
    ctx.app.use(router)
    registerBuilders(ctx.app)

    // A demo whose component throws in setup() (e.g. a `<router-link>` pointing at
    // a named route this stub router doesn't register) must not blank the whole
    // page. Log it clearly and let VitePress render the rest — the broken demo is
    // the only casualty, and the message names the offending component.
    ctx.app.config.errorHandler = (err, _instance, info) => {
      console.error(`[docs] demo render error (${info}):`, err)
    }
  },
} satisfies Theme
