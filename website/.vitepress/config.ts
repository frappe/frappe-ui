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
  appearance: 'dark',
  vite: {
    plugins: [lucideIcons()],
    resolve: {
      alias,
    },

    build: {
      chunkSizeWarningLimit: 1000,
    },

    css: {
      postcss: {
        plugins: [tailwind(), autoprefixer()],
      },
    },
  },

  themeConfig: {
		logo: {
			light: '/logo.svg',
			dark: '/logo-dark.svg',
		},
    search: { provider: 'local' },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/docs/badge' },
      { text: 'Examples', link: '/markdown-examples' },
    ],
    sidebar: sidebarConfig,
  },
})
