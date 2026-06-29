import type { Theme } from 'vitepress'
import { theme as DocsTheme } from 'frappe-ui/vitepress'
import { registerBuilders } from '@/components/builders'
import Layout from './Layout.vue'

// Reuse the shared prose theme (ComponentPreview, Props/Slots/EmitsTable,
// shared Layout). Swap in a frappe-ui Layout that adds the marketing Home +
// showcase Navbar, and register the *Builder showcase components on top.
export default {
  ...DocsTheme,
  Layout,
  enhanceApp(ctx) {
    DocsTheme.enhanceApp?.(ctx)
    registerBuilders(ctx.app)
  },
} satisfies Theme
