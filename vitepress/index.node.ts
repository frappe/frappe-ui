import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig, type DefaultTheme, type UserConfig } from 'vitepress'
import { transformerStyleToClass } from '@shikijs/transformers'
// @ts-ignore — JS package without bundled types
import { lucideIcons, barrelImports } from 'frappe-ui/vite'

import { createComponentTransformer } from './plugins/componentTransformer.ts'
import colocatedComponentDocs from './plugins/colocatedComponentDocs.ts'
import preventCircularChunks from './plugins/preventCircularChunks.ts'
import type { SidebarSection } from './components/Docs/sidebarList.ts'

// frappe-ui package root — this file lives at <root>/vitepress/index.node.ts.
const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)

type HeadConfig = NonNullable<UserConfig['head']>[number]

// Extends the default theme with the extra fields the shared Sidebar reads.
export interface DocsThemeConfig extends DefaultTheme.Config {
  name?: string
  version?: string
  githubUrl?: string
  sections?: SidebarSection[]
}

export interface DefineDocsConfigOptions {
  // Consumer project root (the docs dir). Drives every absolute path:
  // vite resolve.alias, plugin sourceRoots, shiki cache.
  rootDir: string
  name: string
  description: string
  base?: string
  githubUrl?: string
  logo?: string
  version?: string
  // Data-driven IA tree rendered by the shared Sidebar.
  sidebar: SidebarSection[]
  // Merged with generated OG/Twitter defaults.
  head?: HeadConfig[]
  // Absolute source roots for component story/types/playground resolution.
  sourceRoots?: string[]
  // Opt-in: generate @include proxy pages for colocated component docs.
  // `true` uses rootDir defaults; pass options to customize. Off by default
  // since most consumers don't have the frappe-ui component/frappe layout.
  colocatedDocs?: Parameters<typeof colocatedComponentDocs>[0] | boolean
  // Extra resolve.alias entries (merged over rootDir-relative defaults).
  alias?: Record<string, string>
  // Hook for extra markdown-it plugins.
  markdownConfig?: (md: any) => void
}

// Deps every docs page pulls in through the shared theme. Vite's startup scan
// walks raw `src/` SFCs (the `frappe-ui` alias) rather than a prebundled
// package, so it misses these; they then surface during the browser's module
// crawl, forcing a mid-load optimizer run plus the "optimized dependencies
// changed. reloading" full reload.
//
// Deliberately *excludes* the heavy, page-specific deps (echarts, TipTap,
// CodeMirror, socket.io): pre-bundling those would move their cost onto every
// cold start to benefit three pages. They stay page-local — a playground is
// imported only by the page that renders it (see `playgroundDir`).
//
// This list is hand-maintained and will drift. The symptom of a stale entry is
// `docs:dev` printing "optimized dependencies changed. reloading" and doing a
// full reload on first load; the line above it names the dep to add here.
const OPTIMIZE_DEPS_INCLUDE = [
  'vue-router',
  '@vueuse/core',
  'reka-ui',
  '@headlessui/vue',
  '@floating-ui/vue',
  '@popperjs/core',
  'tippy.js',
  'vue-sonner',
  'feather-icons',
  'fuzzysort',
  'shiki',
  'marked',
  'dompurify',
  'idb-keyval',
  // dayjs + the plugins the library registers eagerly
  'dayjs',
  'dayjs/plugin/relativeTime',
  'dayjs/plugin/localizedFormat',
  'dayjs/plugin/updateLocale',
  'dayjs/plugin/isToday',
  'dayjs/plugin/duration',
  'dayjs/plugin/utc',
  'dayjs/plugin/timezone',
  'dayjs/plugin/advancedFormat',
  'dayjs/plugin/customParseFormat',
]

function generatedHead(name: string, description: string): HeadConfig[] {
  return [
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: name }],
    ['meta', { property: 'og:title', content: name }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: name }],
    ['meta', { name: 'twitter:description', content: description }],
  ]
}

export function defineDocsConfig(
  options: DefineDocsConfigOptions,
): UserConfig<DocsThemeConfig> {
  const {
    rootDir,
    name,
    description,
    base = '/',
    githubUrl,
    logo,
    version,
    sidebar,
    head = [],
    sourceRoots = [],
    colocatedDocs = false,
    alias = {},
    markdownConfig,
  } = options

  const isDev = process.env.NODE_ENV !== 'production'

  // transformerStyleToClass turns shiki inline styles into classes; its CSS
  // is collected and injected via transformHead below.
  const toClass = transformerStyleToClass({ classPrefix: 's_' })

  return defineConfig<DocsThemeConfig>({
    base,
    srcDir: 'content',
    cleanUrls: true,
    lastUpdated: true,
    title: name,
    description,
    head: [...generatedHead(name, description), ...head],
    markdown: {
      theme: { dark: 'tokyo-night', light: 'github-light' },
      // In dev, transformerStyleToClass flushes only at buildEnd, so let
      // shiki emit inline --shiki-light/dark vars instead.
      codeTransformers: isDev ? [] : [toClass],
      config(md) {
        md.use(createComponentTransformer({ sourceRoots }))
        markdownConfig?.(md)
      },
    },
    themeConfig: {
      // Consumed by the shared Sidebar/Navbar (SSR-safe; no package.json read).
      name,
      logo,
      version,
      githubUrl,
      sidebar,
      sections: sidebar,
      // Enables VitePress' local search index, rendered by the shared Search.
      search: { provider: 'local' },
    },
    vite: {
      plugins: [
        // Rewrites `import { X } from 'frappe-ui'` to a deep import of the
        // module declaring X. Without it a single component drags the whole
        // re-export barrel — and with it echarts, TipTap and CodeMirror —
        // into every page's dev module graph.
        barrelImports(),
        lucideIcons(),
        // reka-ui 2.9 + VitePress both use @vueuse 14; pin shared Vue ecosystem
        // packages into the framework chunk so CI never ships a framework→theme
        // cycle (TDZ on ui.frappe.io). See preventCircularChunks.ts.
        preventCircularChunks(),
        ...(colocatedDocs
          ? [
              colocatedComponentDocs(
                colocatedDocs === true ? { rootDir } : colocatedDocs,
              ),
            ]
          : []),
      ],
      // The `frappe-ui` alias points at raw `src/`, so Vite's startup scan
      // walks SFCs rather than a prebundled package and misses most of the
      // library's third-party deps. They then surface one-by-one during the
      // browser's module crawl, forcing a mid-load optimizer run and the
      // "optimized dependencies changed. reloading" full reload (~40s cold).
      // Declaring them up front collapses that into a single startup pass.
      optimizeDeps: {
        include: OPTIMIZE_DEPS_INCLUDE,
      },
      resolve: {
        alias: {
          '@/components': path.resolve(rootDir, 'components'),
          // Force Vite (client + SSR) to resolve the bare `frappe-ui/vitepress`
          // specifier to the browser barrel — never the Node config entry this
          // file lives in. This sidesteps SSR export-condition ambiguity: the
          // `node` condition only ever serves VitePress' Node config loader.
          'frappe-ui/vitepress': path.resolve(
            packageRoot,
            'vitepress/index.ts',
          ),
          ...alias,
        },
      },
      // frappe-ui is often a symlink resolving outside the project root (e.g.
      // bundled fonts/assets); allow the dev server to serve from its real dir.
      server: {
        fs: {
          allow: [rootDir, fs.realpathSync(packageRoot)],
        },
      },
      // The shared theme renders frappe-ui during SSR. Bundle frappe-ui and
      // its ESM-only deps (which use extensionless imports Node can't resolve
      // when externalized) into the server build.
      ssr: {
        noExternal: ['frappe-ui', 'dayjs'],
      },
    },
    // Inject shiki's collected CSS into each page's <head>; the production
    // CSS bundle is finalized before markdown runs, so this side-steps timing.
    transformHead: () => {
      const css = toClass.getCSS()
      if (!css) return []
      return [['style', { 'data-shiki': '' }, css]]
    },
  })
}

export type {
  SidebarSection,
  SidebarItem,
} from './components/Docs/sidebarList.ts'
export { isActiveLink, getSidebarList } from './components/Docs/sidebarList.ts'

// Re-exports for convenience. Explicit .ts extensions keep this entry
// loadable when externalized by VitePress' Node-based config loader.
// Vue SFCs are intentionally omitted here — Node can't evaluate them. The
// browser barrel (index.ts, the `default` export condition) re-exports the
// components/theme for Vue code.
export * from './plugins/index.ts'
