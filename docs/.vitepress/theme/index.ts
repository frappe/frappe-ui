// theme/index.ts
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import Demo from '../../components/Demo.vue'

const storyModules = import.meta.glob(
  '../../../src/components/**/*.story.vue',
  { eager: true },
)

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('ComponentPreview', Demo)

    for (const path in storyModules) {
      const match = path.match(/\/([^/]+)\.story\.vue$/)
      if (match) {
        const componentName = match[1]
        app.component(componentName, (storyModules[path] as any).default)
      }
    }
  },
} satisfies Theme
