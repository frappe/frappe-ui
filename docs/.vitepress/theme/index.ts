import type { Theme } from 'vitepress'
import "../../../src/fonts/Inter/inter.css"
import "../../css/style.css"
import "../../css/shiki.css"
import Demo from '../../components/Docs/Demo.vue'
import ButtonBuilder from '../../components/Docs/ButtonBuilder.vue'
import BadgeBuilder from '../../components/Docs/BadgeBuilder.vue'
import Layout from '../../components/Layout.vue'

if (process.env.NODE_ENV === 'production') {
  import.meta.glob('../components/**/stories/*.vue', { eager: true })
}

export default {
	Layout,
  enhanceApp({ app, router, siteData }) {
    app.component('ComponentPreview', Demo)
    app.component('ButtonBuilder', ButtonBuilder)
    app.component('BadgeBuilder', BadgeBuilder)
  },
} satisfies Theme
