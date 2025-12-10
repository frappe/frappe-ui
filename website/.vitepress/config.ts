import { defineConfig } from 'vitepress'
import { lucideIcons } from '../../vite/lucideIcons'
import fs from 'fs'
import path from 'path'

import { componentPreview } from '@vitepress-demo-preview/plugin'

const alias = {
  '@': path.resolve(__dirname, '../../src/'),
  '@/demos': path.resolve(__dirname, '../../src/components/'),
}

function getComponentList() {
  const componentsPath = path.resolve(__dirname, '../../src/components')
  return fs
    .readdirSync(componentsPath, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => ({
      text: d.name,
      link: `/docs/${d.name.toLowerCase()}`,
    }))
}

export default defineConfig({
  markdown: {
    lineNumbers: true,
    config(md) {
      md.use(componentPreview, { clientOnly: true, alias })
    },
  },
  vite: {
    plugins: [lucideIcons()],
    resolve: {
      alias,
    },
  },
  themeConfig: {
    search: { provider: 'local' },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],
    sidebar: [
      {
        text: 'Introduction',
        link: '/docs/introduction',
      },

      {
        text: 'Getting Started',
        link: '/docs/getting-started',
      },

      {
        text: 'Design System',
        items: [{ text: 'Tailwind', link: '/docs/tailwind' }],
      },
      {
        text: 'Data Fetching',
        collapsed: false,
        items: [
          { text: 'Resource', link: '/docs/resource' },
          { text: 'List Resource', link: '/docs/listresource' },
          { text: 'Form Resource', link: '/docs/formresource' },
        ],
      },

      {
        text: 'Components',
        collapsed: false,
        items: getComponentList(),
      },

      {
        text: 'Other',
        items: [
          { text: 'Utilities', link: '/docs/utilities' },
          { text: 'directives', link: '/docs/directives' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
})
