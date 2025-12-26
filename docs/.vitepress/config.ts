import { defineConfig, postcssIsolateStyles } from 'vitepress'
import { lucideIcons } from '../../vite/lucideIcons'
import path from 'path'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import sidebarConfig from './sidebar'
import { meta } from './meta'

import componentPreview from './plugins/componentPreview'

export default defineConfig({
  srcDir: 'content',
  lastUpdated: true,
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
    outline: [2, 3],
    logo: '/logo.svg',
    search: { provider: 'local' },
    nav: [
      { text: 'Docs', link: '/docs/introduction' },
      { text: 'Blog', link: '/blog' },
    ],
    sidebar: sidebarConfig,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/frappe/frappe-ui' },
    ],
  },

  vite: {
    plugins: [lucideIcons()],
    resolve: {
      alias: {
        // '@': path.resolve(__dirname, '../../src/'),
        '@/srcomponents': path.resolve(__dirname, '../../src/components'),
        '@/components': path.resolve(__dirname, '../components/'),
        'frappe-ui': path.resolve(__dirname, '../../src'),
      },
    },
    css: {
      postcss: {
        plugins: [
          tailwind(),
          autoprefixer(),
          postcssIsolateStyles({
            includeFiles: [/vp-doc\.css/, /base\.css/],
          }),
        ],
      },
    },
  },
})
