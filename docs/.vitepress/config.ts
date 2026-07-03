import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'
import {
  defineDocsConfig,
  syncColocatedComponentDocs,
  type SidebarSection,
} from 'frappe-ui/vitepress'
import { meta } from './meta'
import { getComponentItems, getFrappeItems } from './utils'

const configDir = path.dirname(fileURLToPath(import.meta.url))
// rootDir is the docs dir (defineDocsConfig sets srcDir: 'content' under it).
const rootDir = path.resolve(configDir, '..')
// frappe-ui package root — drives source-root + alias math.
const repoRoot = path.resolve(rootDir, '..')

// Component story/types snippet roots, in lookup order, for the markdown
// componentTransformer (<ComponentPreview> / <PropsTable>).
const sourceRoots = [
  path.resolve(repoRoot, 'src/components'),
  path.resolve(repoRoot, 'src/molecules'),
  path.resolve(repoRoot, 'frappe'),
  path.resolve(repoRoot, 'experimental'),
]

// frappe-ui's information architecture. The shared Sidebar is data-driven —
// it renders whatever tree we hand defineDocsConfig({ sidebar }). Component /
// Frappe Control entries are generated from the folders that ship stories.
function buildSidebar(): SidebarSection[] {
  const componentItems = [
    ...getComponentItems().map((name) => ({
      text: name,
      link: `/docs/components/${name.toLowerCase()}`,
    })),
    { text: 'Legacy components', link: '/docs/components/legacy' },
  ]

  const frappeItems = getFrappeItems().map((name) => ({
    text: name,
    link: `/docs/frappe/${name.toLowerCase()}`,
  }))

  const frappeSection: SidebarSection[] = frappeItems.length
    ? [{ text: 'Frappe Controls', items: frappeItems }]
    : []

  return [
    {
      text: 'Getting Started',
      items: [
        { text: 'Introduction', link: '/docs/introduction' },
        { text: 'Getting Started', link: '/docs/getting-started' },
        { text: 'Migration from v0', link: '/docs/migration' },
      ],
    },
    {
      text: 'Foundations',
      items: [
        { text: 'Base Colors', link: '/docs/foundations/colors/base' },
        { text: 'Semantic Colors', link: '/docs/foundations/colors/semantic' },
        { text: 'Typography', link: '/docs/foundations/typography' },
        { text: 'Radius', link: '/docs/foundations/radius' },
        { text: 'Elevation', link: '/docs/foundations/elevation' },
        { text: 'Focus Ring', link: '/docs/foundations/focus-ring' },
      ],
    },
    { text: 'Components', items: componentItems },
    ...frappeSection,
    {
      text: 'Molecules',
      items: [
        { text: 'Editor', link: '/docs/molecules/editor' },
        { text: 'List', link: '/docs/molecules/list' },
      ],
    },
    {
      text: 'Data Fetching',
      items: [
        { text: 'Resource', link: '/docs/data-fetching/resource' },
        { text: 'List Resource', link: '/docs/data-fetching/list-resource' },
        {
          text: 'Document Resource',
          link: '/docs/data-fetching/document-resource',
        },
      ],
    },
    {
      text: 'Other',
      items: [
        { text: 'Icons', link: '/docs/other/icons' },
        { text: 'Utilities', link: '/docs/other/utilities' },
        { text: 'Directives', link: '/docs/other/directives' },
        { text: 'Experimental', link: '/docs/experimental' },
      ],
    },
  ]
}

const base = process.env.VITEPRESS_BASE || '/'
const isDev = process.env.NODE_ENV !== 'production'

// Dev-only branch badge — shown in the Navbar via the __DEV_BRANCH__ define.
let devBranch = ''
if (isDev) {
  try {
    devBranch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: repoRoot })
      .toString()
      .trim()
  } catch {}
}
const devTitle = devBranch ? `[${devBranch}] ${meta.name}` : meta.name

// Colocated component docs live next to their source; molecules (lowercase
// folders like list/) proxy into /docs/molecules alongside the hand-written
// editor page.
const colocatedRoots = [
  {
    sourceDir: path.resolve(repoRoot, 'src/components'),
    proxyDir: path.resolve(rootDir, 'content/docs/components'),
  },
  {
    sourceDir: path.resolve(repoRoot, 'src/molecules'),
    proxyDir: path.resolve(rootDir, 'content/docs/molecules'),
  },
  {
    sourceDir: path.resolve(repoRoot, 'frappe'),
    proxyDir: path.resolve(rootDir, 'content/docs/frappe'),
  },
]

// Generate the @include proxy pages for colocated component docs before
// VitePress scans srcDir. The colocatedDocs vite plugin (below) keeps them in
// sync during dev; this eager call seeds them for the initial route scan.
syncColocatedComponentDocs({ sourceRoots: colocatedRoots })

const config = defineDocsConfig({
  rootDir,
  base,
  name: meta.name,
  description: meta.description,
  githubUrl: meta.github,
  logo: '/logo.svg',
  sidebar: buildSidebar(),
  sourceRoots,
  // Dev watcher for colocated component .md changes (initial seed above).
  colocatedDocs: { sourceRoots: colocatedRoots },
  // Showcase-only head extras (defineDocsConfig already adds the generic
  // OG/Twitter title/description tags).
  head: [
    // LLM-friendly docs index — https://llmstxt.org
    ['link', { rel: 'alternate', type: 'text/markdown', href: '/llms.txt' }],
    // Newsreader font (used by the marketing Home / prose accents).
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
    // Bootstrap data-theme before paint (VitePress only toggles the dark class).
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
    // Open Graph / Twitter image + canonical URL.
    ['meta', { property: 'og:url', content: 'https://ui.frappe.io' }],
    ['meta', { property: 'og:image', content: '/frappe-demo.png' }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:alt', content: meta.description }],
    ['meta', { name: 'twitter:image', content: '/frappe-demo.png' }],
  ],
  // Live frappe-ui source aliases (defineDocsConfig keeps its own
  // `@/components` -> rootDir/components default + the `frappe-ui/vitepress`
  // -> browser-barrel alias, and merges these over them).
  //
  // Order matters: the bare `frappe-ui` -> src alias is prefix-matched. The
  // more-specific `frappe-ui/vitepress` alias is injected by defineDocsConfig
  // ahead of this `...alias` spread, so it still wins over `frappe-ui`.
  alias: {
    'frappe-ui/frappe': path.resolve(repoRoot, 'frappe'),
    '@components': path.resolve(repoRoot, 'src/components'),
    '@molecules': path.resolve(repoRoot, 'src/molecules'),
    '@utils': path.resolve(repoRoot, 'src/utils'),
    '@composables': path.resolve(repoRoot, 'src/composables'),
    'frappe-ui/editor': path.resolve(repoRoot, 'src/molecules/editor'),
    'frappe-ui/list': path.resolve(repoRoot, 'src/molecules/list'),
    'frappe-ui/code-editor': path.resolve(
      repoRoot,
      'src/components/CodeEditor',
    ),
    'frappe-ui': path.resolve(repoRoot, 'src'),
    'dayjs/esm': 'dayjs',
  },
})

// Dev-branch title + the __DEV_BRANCH__ define the Navbar badge reads.
config.title = devTitle
config.titleTemplate = devTitle
config.themeConfig!.outline = [2, 3]
config.vite!.define = { __DEV_BRANCH__: JSON.stringify(devBranch) }

export default config
