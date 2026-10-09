import fs from 'node:fs'
import path from 'node:path'
import type { SidebarPreview } from 'frappe-ui/vitepress'

const components_path = path.resolve(__dirname, '../../src/components/')
const experimental_path = path.resolve(__dirname, '../../experimental/')
const charts_path = path.resolve(__dirname, '../../src/charts/')

function listWithStories(rootPath: string): string[] {
  const entries = fs.readdirSync(rootPath, { withFileTypes: true })

  const items = []

  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const storiesPath = path.join(rootPath, entry.name, 'stories')
    const docsPath = path.join(rootPath, entry.name, `${entry.name}.md`)

    if (!fs.existsSync(storiesPath) || !fs.existsSync(docsPath)) continue

    items.push(entry.name)
  }

  return items
}

export const getComponentItems = () => listWithStories(components_path)

// Experimental exports that ship a colocated page of their own; the rest are
// documented inline on the Experimental overview page.
export const getExperimentalItems = () => listWithStories(experimental_path)

// The page's intro paragraph, as plain text: the first prose block after the
// `# Title`, with markdown links and code ticks stripped.
function readDescription(markdown: string): string | undefined {
  const blocks = markdown.split(/\n\s*\n/).map((block) => block.trim())
  const intro = blocks.find((block) => /^[A-Za-z`[]/.test(block))
  return intro
    ?.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`/g, '')
    .replace(/\s+/g, ' ')
}

// The page's first `<ComponentPreview>`: its story id and the layout flags
// it renders with (`self-layout`, `wide`).
function readLeadStory(markdown: string) {
  const tag = markdown.match(/<ComponentPreview\s[^>]*>/)?.[0] ?? ''
  const story = tag.match(/name=["']([^"']+)["']/)?.[1]
  const hasFlag = (flag: string) => new RegExp(`\\s${flag}(\\s|/|>)`).test(tag)
  return { story, selfLayout: hasFlag('self-layout'), wide: hasFlag('wide') }
}

// What the sidebar hover card shows: the intro, the page's first
// `<ComponentPreview>` story and how many stories the component ships.
function getPreview(rootPath: string, name: string): SidebarPreview {
  const dir = path.join(rootPath, name)
  const markdown = fs.readFileSync(path.join(dir, `${name}.md`), 'utf-8')
  const count = fs
    .readdirSync(path.join(dir, 'stories'))
    .filter((file) => file.endsWith('.vue')).length
  return {
    description: readDescription(markdown),
    ...readLeadStory(markdown),
    count,
  }
}

export const getComponentPreview = (name: string) =>
  getPreview(components_path, name)

export const getExperimentalPreview = (name: string) =>
  getPreview(experimental_path, name)

// Charts share one `stories` folder, so a chart's count is the examples on
// its own page. Pages written outside `src/charts/docs` get no preview.
export function getChartPreview(name: string): SidebarPreview | undefined {
  const file = path.join(charts_path, 'docs', `${name}.md`)
  if (!fs.existsSync(file)) return undefined
  const markdown = fs.readFileSync(file, 'utf-8')
  const stories = markdown.matchAll(
    /<ComponentPreview\s[^>]*name=["']([^"']+)["']/g,
  )
  const count = new Set([...stories].map((match) => match[1])).size
  return {
    description: readDescription(markdown),
    ...readLeadStory(markdown),
    count,
  }
}
