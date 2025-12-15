import { defineConfig } from 'vitepress'
import { lucideIcons } from '../../vite/lucideIcons'
import path from 'path'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import sidebarConfig from './sidebar'
import { meta } from './meta'

import componentPreview from './plugins/componentPreview'

const alias = {
  '@': path.resolve(__dirname, '../../src/'),
  '@/demos': path.resolve(__dirname, '../../src/components/'),
}

export default defineConfig({
  title: meta.name,
  description: meta.description,
  titleTemplate: meta.name,

  markdown: {
    theme: 'github-dark',
    // lineNumbers: true,
    config(md) {
      md.use(componentPreview)
    },
  },
  cleanUrls: true,
  vite: {
    plugins: [lucideIcons()],
    resolve: {
      alias,
    },
    // css: {
    //   postcss: {
    //     plugins: [tailwind(), autoprefixer()],
    //   },
    // },
  },

  appearance: {
    onChanged(isDark, defaultHandler, mode) {
      if (typeof document === 'undefined') return

      document.documentElement.setAttribute(
        'data-theme',
        isDark ? 'dark' : 'light',
      )
      defaultHandler(mode)
    },
  },

  head: [
    [
      'script',
      {},
      `;(() => {
        const preference = localStorage.getItem('vitepress-theme-appearance') || 'auto'
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const isDark = preference === 'auto' ? prefersDark : preference === 'dark'
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
      })()`,
    ],
  ],

  themeConfig: {
    logo: {
      light: '/logo.svg',
      dark: '/logo-dark.svg',
    },
    search: { provider: 'local' },
    nav: [
      { text: 'Docs', link: '/docs/introduction' },
      { text: 'Examples', link: '/markdown-examples' },
    ],
    sidebar: sidebarConfig,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/frappe/frappe-ui' },
    ],
  },
})
