import * as url from 'url'
import path from 'path'
import fs from 'fs'

import type { MetaCheckerOptions } from 'vue-component-meta'
import { createChecker } from 'vue-component-meta'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const checkerOptions: MetaCheckerOptions = {
  forceUseTs: true,
  schema: { ignore: ['MyIgnoredNestedProps'] },
  printer: { newLine: 1 },
}

const tsconfigChecker = createChecker(
  path.join(__dirname, '../../tsconfig.json'),
  checkerOptions,
)

const componentDir = path.join(__dirname, '../../src/components')
const AUTO_STORIES_START = '<!-- AUTO-GENERATED STORIES START -->'
const AUTO_STORIES_END = '<!-- AUTO-GENERATED STORIES END -->'

function parseTypeStr(type: string) {
  if (type.includes('undefined')) {
    return type.replace(' | undefined', '').trim()
  }
  return type
}

// Return the `@deprecated` message, `true` if the tag is present without
// a message, or `undefined` if the prop/slot/emit is not deprecated.
// Callers should omit the field when this returns `undefined` so the
// generated data stays clean.
function getDeprecation(
  tags: { name: string; text?: string }[] | undefined,
): string | true | undefined {
  const tag = tags?.find((t) => t.name === 'deprecated')
  if (!tag) return undefined
  return tag.text?.trim() || true
}

function withOptional<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) result[key] = value
  }
  return result as T
}

function formatObjectKey(key: string) {
  return /^[A-Za-z_$][\w$]*$/.test(key) ? key : `'${key}'`
}

function escapeJsString(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

function toVueExpression(value: unknown, indentLevel = 0): string {
  const indent = '  '.repeat(indentLevel)
  const nextIndent = '  '.repeat(indentLevel + 1)

  if (value === null) return 'null'
  if (value === undefined) return 'undefined'

  if (typeof value === 'string') {
    return `'${escapeJsString(value)}'`
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'

    return `[
${value.map((item) => `${nextIndent}${toVueExpression(item, indentLevel + 1)}`).join(',\n')}
${indent}]`
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value)
    if (entries.length === 0) return '{}'

    return `{
${entries
  .map(
    ([key, itemValue]) =>
      `${nextIndent}${formatObjectKey(key)}: ${toVueExpression(itemValue, indentLevel + 1)}`,
  )
  .join(',\n')}
${indent}}`
  }

  return String(value)
}

function arrToExpression(value: unknown) {
  return toVueExpression(value)
}

function humanizeStoryName(name: string) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .trim()
}

function humanizeEventKey(name: string) {
  return name
    .replace(/^update:/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_:]/g, ' ')
    .toLowerCase()
    .trim()
}

function getEventDescription(name: string, description?: string) {
  if (description) {
    return description
  }

  if (name.startsWith('update:')) {
    const eventKey = humanizeEventKey(name)
    return `Fired when the ${eventKey === 'open' ? 'open state' : eventKey} changes.`
  }

  return (
    {
      'change': 'Fired after the value is committed.',
      'open': 'Fired when the component opens.',
      'close': 'Fired when the component closes.',
      'dismiss': 'Fired when the component is dismissed.',
      'item-click': 'Fired when an enabled item is clicked.',
      'value-commit': 'Fired once when the user finishes committing the value.',
    }[name] ?? ''
  )
}

function parseStoryFileName(fileName: string) {
  const storyFileName = fileName.replace(/\.vue$/, '')
  const orderedMatch = storyFileName.match(/^(\d+)[-_](.+)$/)

  if (!orderedMatch) {
    return {
      fileName: storyFileName,
      title: humanizeStoryName(storyFileName),
      order: null as number | null,
    }
  }

  return {
    fileName: storyFileName,
    title: humanizeStoryName(orderedMatch[2]),
    order: Number(orderedMatch[1]),
  }
}

function sortStories(
  stories: Array<{ fileName: string; title: string; order: number | null }>,
) {
  return [...stories].toSorted((a, b) => {
    if (a.order != null || b.order != null) {
      if (a.order == null) return 1
      if (b.order == null) return -1
      if (a.order !== b.order) return a.order - b.order
    }

    return a.title.localeCompare(b.title)
  })
}

function camelCase(name: string) {
  return name.charAt(0).toLowerCase() + name.slice(1)
}

function extractTableData(name: string, data: any) {
  const props = data.props
    .filter((x: any) => !x.global)
    .map((x: any) =>
      withOptional({
        name: x.name,
        description: x.description,
        required: x.required,
        type: parseTypeStr(x.type),
        default: x.default,
        deprecated: getDeprecation(x.tags),
      }),
    )

  const slots = data.slots
    .filter((x: any) => !x.global)
    .map((x: any) =>
      withOptional({
        name: x.name,
        description: x.description,
        type: x.type.slice(0, 100),
        deprecated: getDeprecation(x.tags),
      }),
    )

  const emits = data.events
    .filter((x: any) => !x.global)
    .map((x: any) =>
      withOptional({
        name: x.name,
        description: getEventDescription(x.name, x.description),
        type: x.type,
        deprecated: getDeprecation(x.tags),
      }),
    )

  return { name, props, slots, emits }
}

type ComponentMeta = ReturnType<typeof extractTableData>

// Generate one meta file per folder. Multi-component folders (e.g.
// DatePicker, which also exports DateTimePicker and DateRangePicker) emit
// a single file with all sibling components — required because each Vue
// SFC can only have one `<script setup>`, and doc pages include the meta
// file inline.
function genFolderMetaTable(folder: string, components: ComponentMeta[]) {
  const multi = components.length > 1
  const scriptLines = [
    '<!-- Auto Generated by scripts/propsgen.ts -->',
    '<script setup>',
    "  import PropsTable from '@/components/Docs/PropsTable.vue'",
    "  import SlotsTable from '@/components/Docs/SlotsTable.vue'",
    "  import EmitsTable from '@/components/Docs/EmitsTable.vue'",
  ]

  const constNames = (componentName: string) => {
    if (!multi) {
      return { props: 'propsData', slots: 'slotsData', emits: 'emitsData' }
    }
    const prefix = camelCase(componentName)
    return {
      props: `${prefix}Props`,
      slots: `${prefix}Slots`,
      emits: `${prefix}Emits`,
    }
  }

  for (const c of components) {
    const names = constNames(c.name)
    if (c.props.length > 0) {
      scriptLines.push(`\n  const ${names.props} = ${arrToExpression(c.props)}`)
    }
    if (c.slots.length > 0) {
      scriptLines.push(`\n  const ${names.slots} = ${arrToExpression(c.slots)}`)
    }
    if (c.emits.length > 0) {
      scriptLines.push(`\n  const ${names.emits} = ${arrToExpression(c.emits)}`)
    }
  }

  scriptLines.push('</script>')

  let markupStr = `${scriptLines.join('\n')}\n`

  const hasAnyAcross = components.some(
    (c) => c.props.length || c.slots.length || c.emits.length,
  )
  if (multi && hasAnyAcross) {
    markupStr += `## API Reference\n\n`
  }

  for (const c of components) {
    const hasAny = c.props.length || c.slots.length || c.emits.length
    if (!hasAny) continue

    if (multi) {
      markupStr += `### ${c.name}\n\n`
    } else {
      markupStr += `## API Reference\n\n`
    }

    const names = constNames(c.name)
    const folderAttr = folder !== c.name ? ` folder="${folder}"` : ''

    if (c.props.length > 0) {
      markupStr += `<PropsTable${folderAttr} name="${c.name}" :data="${names.props}"/> \n\n`
    }
    if (c.slots.length > 0) {
      markupStr += `<SlotsTable :data="${names.slots}"/> \n\n`
    }
    if (c.emits.length > 0) {
      markupStr += `<EmitsTable :data="${names.emits}"/> \n\n`
    }
  }

  return markupStr
}

function getAvailableComponents() {
  return fs
    .readdirSync(componentDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => {
      return fs.existsSync(path.join(componentDir, name, `${name}.vue`))
    })
    .toSorted((a, b) => a.localeCompare(b))
}

// A folder's `index.ts` may re-export additional public sub-components
// alongside the primary one (e.g. DatePicker also exports DateRangePicker
// and DateTimePicker). Each public sub-component gets its own meta file.
function getPublicComponentsFromIndex(folder: string): string[] {
  const indexPath = path.join(componentDir, folder, 'index.ts')
  if (!fs.existsSync(indexPath)) return []

  const content = fs.readFileSync(indexPath, 'utf8')
  const re =
    /export\s*\{\s*default\s+as\s+(\w+)\s*\}\s*from\s*['"]\.\/(\w+)\.vue['"]/g
  const names = new Set<string>()
  let m: RegExpExecArray | null
  while ((m = re.exec(content))) {
    if (m[1] === m[2]) names.add(m[1])
  }
  return [...names]
}

type Documentable = {
  folder: string
  name: string
  vuePath: string
  siblings: string[]
}

function getDocumentables(): Documentable[] {
  const docs: Documentable[] = []
  for (const folder of getAvailableComponents()) {
    const fromIndex = getPublicComponentsFromIndex(folder)
    const candidates = fromIndex.length > 0 ? fromIndex : [folder]
    const names = (
      candidates.includes(folder) ? candidates : [folder, ...candidates]
    ).filter((name) =>
      fs.existsSync(path.join(componentDir, folder, `${name}.vue`)),
    )

    for (const name of names) {
      docs.push({
        folder,
        name,
        vuePath: path.join(componentDir, folder, `${name}.vue`),
        siblings: names,
      })
    }
  }
  return docs
}

function getStories(componentName: string) {
  const storiesDir = path.join(componentDir, componentName, 'stories')

  if (!fs.existsSync(storiesDir)) {
    return []
  }

  return sortStories(
    fs
      .readdirSync(storiesDir)
      .filter((file) => file.endsWith('.vue'))
      .map((file) => parseStoryFileName(file)),
  )
}

function getStoryPreviewMarkup(componentName: string) {
  return getStories(componentName)
    .map((story) => {
      return `## ${story.title}\n<ComponentPreview name="${componentName}-${story.fileName}" />`
    })
    .join('\n\n')
}

function replaceAutoGeneratedSection(content: string, replacement: string) {
  const startIndex = content.indexOf(AUTO_STORIES_START)
  const endIndex = content.indexOf(AUTO_STORIES_END)

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    return content
  }

  const before = content.slice(0, startIndex)
  const after = content.slice(endIndex + AUTO_STORIES_END.length)
  return `${before}${replacement}${after}`
}

function syncComponentDocsStories(componentName: string) {
  const docsPath = path.join(componentDir, componentName, `${componentName}.md`)

  if (!fs.existsSync(docsPath)) {
    return
  }

  const content = fs.readFileSync(docsPath, 'utf8')
  if (
    !content.includes(AUTO_STORIES_START) ||
    !content.includes(AUTO_STORIES_END)
  ) {
    return
  }

  const storiesMarkup = getStoryPreviewMarkup(componentName)
  const replacement = `${AUTO_STORIES_START}\n${storiesMarkup}\n${AUTO_STORIES_END}`
  const nextContent = replaceAutoGeneratedSection(content, replacement)

  if (nextContent !== content) {
    fs.writeFileSync(docsPath, nextContent)
    console.log(`Synced ${componentName} docs stories`)
  }
}

function parseRequestedFolders(
  documentables: Documentable[],
  folders: string[],
) {
  const byLowerName = new Map(
    documentables.map((d) => [d.name.toLowerCase(), d.folder]),
  )

  const args = process.argv.slice(2).filter((arg) => arg !== '--')
  const rawNames = args.flatMap((arg) => {
    if (arg === '--all') return []
    if (arg.startsWith('--components=')) {
      return arg
        .slice('--components='.length)
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean)
    }
    if (arg.startsWith('--')) return []
    return arg
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean)
  })

  if (args.includes('--all') || rawNames.length === 0) {
    return folders
  }

  const unknownNames = rawNames.filter(
    (name) => !byLowerName.has(name.toLowerCase()),
  )

  if (unknownNames.length) {
    console.error(
      `Unknown component(s): ${unknownNames.join(', ')}\nAvailable: ${documentables.map((d) => d.name).join(', ')}`,
    )
    process.exit(1)
  }

  // Names can be primary or sub-components; resolve each to its folder
  // and dedupe — generation runs once per folder.
  return [
    ...new Set(rawNames.map((name) => byLowerName.get(name.toLowerCase())!)),
  ]
}

const documentables = getDocumentables()
const folderOrder = [...new Set(documentables.map((d) => d.folder))]
const selectedFolders = parseRequestedFolders(documentables, folderOrder)
const docsByFolder = new Map<string, Documentable[]>()
for (const d of documentables) {
  const list = docsByFolder.get(d.folder) ?? []
  list.push(d)
  docsByFolder.set(d.folder, list)
}

console.log(`Generating docs meta for: ${selectedFolders.join(', ')}`)

selectedFolders.forEach((folder) => {
  try {
    const docs = docsByFolder.get(folder) ?? []
    // Primary first, then any sub-components in declaration order.
    const ordered = [
      ...docs.filter((d) => d.name === d.folder),
      ...docs.filter((d) => d.name !== d.folder),
    ]

    const components = ordered.map((d) => {
      const meta = tsconfigChecker.getComponentMeta(d.vuePath)
      return extractTableData(d.name, meta)
    })

    const metaFilePath = path.join(componentDir, folder, `${folder}.api.md`)
    const str = genFolderMetaTable(folder, components)
    fs.writeFileSync(metaFilePath, str)
    console.log(`Generated ${folder} meta`)

    syncComponentDocsStories(folder)
  } catch (error) {
    console.error('-----------------------------\n', folder, ':', error)
    process.exitCode = 1
  }
})
