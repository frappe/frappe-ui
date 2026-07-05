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
  },
} satisfies Theme
