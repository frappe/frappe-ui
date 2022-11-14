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
          { text: 'Alert', link: '/components/alert' },
          { text: 'Autocomplete', link: '/components/autocomplete' },
          { text: 'Avatar', link: '/components/avatar' },
          { text: 'Badge', link: '/components/badge' },
          { text: 'Button', link: '/components/button' },
          { text: 'FeatherIcon', link: '/components/feathericon' },
          { text: 'DatePicker', link: '/components/datepicker' },
        ],
      },
    ],
  },
})
