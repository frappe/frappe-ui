import type { Theme } from 'vitepress'
import '../css/style.css'

import Layout from '../components/Layout.vue'
import Demo from '../components/Docs/Demo.vue'
import PropsTable from '../components/Docs/PropsTable.vue'
import SlotsTable from '../components/Docs/SlotsTable.vue'
import EmitsTable from '../components/Docs/EmitsTable.vue'

// PROSE theme: layout + generic doc components only. Component-showcase
// machinery (the *Builder.vue playgrounds) is not part of the reusable
// theme — it lives in the frappe-ui docs site that documents those components.
export const theme = {
  Layout,
  enhanceApp({ app }) {
    app.component('ComponentPreview', Demo)
    app.component('PropsTable', PropsTable)
    app.component('SlotsTable', SlotsTable)
    app.component('EmitsTable', EmitsTable)
  },
} satisfies Theme
