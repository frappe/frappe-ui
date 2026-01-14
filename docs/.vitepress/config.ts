import { defineConfig } from 'vitepress'
import { lucideIcons } from '../../vite/lucideIcons'
import path from 'path'
import { meta } from './meta'
import { getComponentItems } from './utils'

import componentPreview from './plugins/componentPreview'

export default defineConfig({
  srcDir: 'content',
  lastUpdated: true,
  title: meta.name,
  description: meta.description,
  titleTemplate: meta.name,

  markdown: {
    theme: 'vesper',
    config(md) {
      md.use(componentPreview)
    },
  },
  cleanUrls: true,

  head: [
    // set data-theme attribute since vitepress uses just the dark class.
    [
      'script',
      {},
      `;(() => {
      const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      const theme = localStorage.getItem('theme') || preferredTheme
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.theme = theme
    })()`,
    ],

    // ===== Open Graph =====
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: meta.name }],
    ['meta', { property: 'og:title', content: meta.name }],
    ['meta', { property: 'og:description', content: meta.description }],
    ['meta', { property: 'og:url', content: 'https://ui.frappe.io' }],
    [
      'meta',
      {
        property: 'og:image',
        content: '/frappe-demo.png',
      },
    ],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:alt', content: meta.description }],

    // ===== Twitter =====
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: meta.name }],
    ['meta', { name: 'twitter:description', content: meta.description }],
    [
      'meta',
      {
        name: 'twitter:image',
        content: '/frappe-demo.png',
      },
    ],
  ],

  themeConfig: {
    sidebarLinks: getComponentItems(),
    outline: [2, 3],
    logo: '/logo.svg',
    search: { provider: 'local' },
    nav: [
      { text: 'Docs', link: '/docs/introduction' },
      { text: 'Blog', link: '/blog' },
    ],
    // sidebar: sidebarConfig,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/frappe/frappe-ui' },
    ],
  },

  vite: {
    plugins: [lucideIcons()],
    resolve: {
      alias: {
        '@/srcomponents': path.resolve(__dirname, '../../src/components'),
        '@/components': path.resolve(__dirname, '../components/'),
        'frappe-ui': path.resolve(__dirname, '../../src'),
      },
    },
  },
})
