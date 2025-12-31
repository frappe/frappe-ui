import { defineConfig, postcssIsolateStyles } from 'vitepress'
import { lucideIcons } from '../../vite/lucideIcons'
import path from 'path'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'
// import sidebarConfig from './sidebar'
import { meta } from './meta'

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
      const preference = localStorage.getItem('vitepress-theme-appearance') || 'auto'
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const isDark = preference === 'auto' ? prefersDark : preference === 'dark'
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
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
    css: {
      postcss: {
        plugins: [
          tailwind(),
          autoprefixer(),
					  //    postcssIsolateStyles({
					  // prefix: ':not(:where(.vp-style-raw, .vp-style-raw *, .vp-raw, .vp-raw *))',
					  //      includeFiles: [/vp-doc\.css/, /base\.css/],
					  //    }),
        ],
      },
    },
  },
})
