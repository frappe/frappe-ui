import { defineConfig } from 'vitepress'
import { lucideIcons } from '../../vite/lucideIcons'
import path from 'path'
import { meta } from './meta'
import { getComponentItems, getFrappeItems } from './utils'
import { transformerStyleToClass } from '@shikijs/transformers'
import componentTransformer from './plugins/componentTransformer'
import colocatedComponentDocs, {
  syncColocatedComponentDocs,
} from './plugins/colocatedComponentDocs'
import fs from 'fs'
import { execSync } from 'child_process'

// needed for transforming shiki inline styles to classes
const toClass = transformerStyleToClass({
  classPrefix: 's_',
})

const base = process.env.VITEPRESS_BASE || '/'

const isDev = process.env.NODE_ENV !== 'production'
let devBranch = ''
if (isDev) {
  try {
    devBranch = execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: path.resolve(__dirname, '../..'),
    })
      .toString()
      .trim()
  } catch {}
}
const devTitle = devBranch ? `[${devBranch}] ${meta.name}` : meta.name

// Generate proxy files for colocated component docs before VitePress
// scans srcDir. The Vite plugin below keeps them in sync during dev.
syncColocatedComponentDocs()

// shiki.css is written at buildEnd for dev-mode imports, but the
// production CSS bundle is finalized by Vite *before* markdown
// processing runs — so the bundle never picks up the generated
// classes. We inject the collected styles into each page's <head>
// via transformHead below to side-step that timing. Still write the
// stub here so theme/index.ts's eager import resolves on fresh
// checkouts.
const shikiCssPath = path.resolve(__dirname, '../css/shiki.css')
if (!fs.existsSync(shikiCssPath)) {
  fs.mkdirSync(path.dirname(shikiCssPath), { recursive: true })
  fs.writeFileSync(shikiCssPath, '/* Auto-generated on build-time */\n', 'utf-8')
}

export default defineConfig({
  base,
  srcDir: 'content',
  lastUpdated: true,
  title: devTitle,
  description: meta.description,
  titleTemplate: devTitle,
  markdown: {
    theme: {
      dark: 'tokyo-night',
      light: 'github-light',
    },
    codeTransformers: [toClass],
    config(md) {
      md.use(componentTransformer)
    },
  },
  cleanUrls: true,
  head: [
    // LLM-friendly docs index — https://llmstxt.org
    ['link', { rel: 'alternate', type: 'text/markdown', href: '/llms.txt' }],
    // newsreader font
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    [
      'link',
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    ],
    [
      'link',
      {
        href: 'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&display=swap',
        rel: 'stylesheet',
      },
    ],
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
    componentList: getComponentItems(),
    frappeList: getFrappeItems(),
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
    plugins: [lucideIcons(), colocatedComponentDocs()],
    define: {
      __DEV_BRANCH__: JSON.stringify(devBranch),
    },
    resolve: {
      alias: {
        '@/components': path.resolve(__dirname, '../components/'),
        'frappe-ui/frappe': path.resolve(__dirname, '../../frappe'),
        'frappe-ui': path.resolve(__dirname, '../../src'),
        'dayjs/esm': 'dayjs',
      },
    },
  },
  transformHead: () => {
    const css = toClass.getCSS()
    if (!css) return []
    return [['style', { 'data-shiki': '' }, css]]
  },
  buildEnd: async () => {
    const str = '/* Auto-generated on build-time */ \n\n ' + toClass.getCSS()
    const cssPath = path.resolve(__dirname, '../css/shiki.css')
    await fs.promises.writeFile(cssPath, str, 'utf-8')
  },
})
