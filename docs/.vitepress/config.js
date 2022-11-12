import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Frappe UI',
  description: 'A set of components and utilities for rapid UI development',
  themeConfig: {
    sidebar: [
      {
        text: 'Guide',
        items: [{ text: 'Getting Started', link: '/getting-started' }],
      },
      {
        text: 'Components',
        items: [
          { text: 'Button', link: '/components/button' },
          { text: 'FeatherIcon', link: '/components/feathericon' },
        ],
      },
    ],
  },
})
