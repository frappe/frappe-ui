import type { Theme } from 'vitepress'
import "../../../src/fonts/Inter/inter.css"
import "../../css/style.css"
import Demo from '../../components/Docs/Demo.vue'
import Layout from '../../components/Layout.vue'

if (process.env.NODE_ENV === 'production') {
  import.meta.glob('../components/**/*.story.vue', { eager: true })
}

export default {
	Layout,
  enhanceApp({ app, router, siteData }) {
    app.component('ComponentPreview', Demo)
  },
} satisfies Theme
