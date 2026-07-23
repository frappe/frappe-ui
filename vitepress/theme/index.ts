import type { Theme } from 'vitepress'
import '../css/style.css'

import Layout from '../components/Layout.vue'
import Demo from '../components/Docs/Demo.vue'
import PropsTable from '../components/Docs/PropsTable.vue'
import SlotsTable from '../components/Docs/SlotsTable.vue'
import EmitsTable from '../components/Docs/EmitsTable.vue'
import PlaygroundFrame from '../components/Docs/PlaygroundFrame.vue'

// PROSE theme: layout + generic doc components only. The individual
// `<Name>.playground.vue` files are colocated with the components they
// document and imported per page by the markdown transformer; only the frame
// they render into is shared, so it's registered globally here.
export const theme = {
  Layout,
  enhanceApp({ app }) {
    app.component('ComponentPreview', Demo)
    app.component('PropsTable', PropsTable)
    app.component('SlotsTable', SlotsTable)
    app.component('EmitsTable', EmitsTable)
    app.component('PlaygroundFrame', PlaygroundFrame)
  },
} satisfies Theme
