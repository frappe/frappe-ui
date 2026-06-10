import * as url from 'url'
import path from 'path'
import fs from 'fs'

import type { MetaCheckerOptions } from 'vue-component-meta'
import { createChecker } from 'vue-component-meta'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

// When the ignore function fires for a node_modules type, vue-component-meta
// stores `getFullyQualifiedName(type)` as the schema string — which includes
// full generic args (e.g. `ComponentOptions<any,…>`) and minified internal
// names (e.g. `kt` for RouteLocationAsRelativeGeneric from vue-router's bundle).
// We capture a cleaner display name here and look it up in schemaToTypeStr.
const typeNameOverrides = new Map<string, string>()

const checkerOptions: MetaCheckerOptions = {
  forceUseTs: true,
  schema: {
    ignore: [
      (_name: string, type: any) => {
        const symbol = type.aliasSymbol ?? type.symbol
        const decls: any[] | undefined = symbol?.declarations
        if (!decls?.length) return false
        const isNodeModules = decls.some((d: any) => {
          const fn: string = d.getSourceFile().fileName
          return (
            fn.includes('/node_modules/') &&
            !fn.includes('/node_modules/typescript/lib/lib.es')
          )
        })
        if (isNodeModules && symbol.name && symbol.name !== _name) {
          typeNameOverrides.set(_name, symbol.name)
        }
        return isNodeModules
      },
    ],
  },
  printer: { newLine: 1 },
}

const tsconfigChecker = createChecker(
  // the app project — the root tsconfig.json is solution-style (no files)
  path.join(__dirname, '../../tsconfig.app.json'),
  checkerOptions,
)

const SOURCE_ROOTS = [
  path.join(__dirname, '../../src/components'),
  path.join(__dirname, '../../frappe'),
]
const AUTO_STORIES_START = '<!-- AUTO-GENERATED STORIES START -->'
const AUTO_STORIES_END = '<!-- AUTO-GENERATED STORIES END -->'

function stripUndefined(type: string) {
  if (type.includes('undefined')) {
    return type.replace(' | undefined', '').trim()
  }
  return type
}

// Vue's `Component` type alias distributes to three interfaces. When TypeScript
// resolves through PropType<> generics it loses the alias, so we collapse the
// expanded members back to the clean alias name.
const VUE_COMPONENT_BASES = new Set([
  'ComponentOptions',
  'FunctionalComponent',
  'ComponentPublicInstanceConstructor',
  'ConcreteComponent',
])

// vue-router bundles its types with minified internal names (e.g. `kt`).
// After resolving via typeNameOverrides we get the full names; collapse the
// known parts of RouteLocationRaw back to the public alias.
const VUE_ROUTER_ROUTE_PARTS = new Set([
  'RouteLocationAsRelativeGeneric',
  'RouteLocationAsPathGeneric',
])

function collapseKnownUnions(parts: string[]): string[] {
  const partsSet = new Set(parts)

  // Collapse Vue component interfaces → Component
  if (parts.some((p) => VUE_COMPONENT_BASES.has(p))) {
    parts = [
      ...parts.filter((p) => !VUE_COMPONENT_BASES.has(p)),
      'Component',
    ]
  }

  // Collapse RouteLocationRaw parts (including the `string` member that's
  // already part of RouteLocationRaw) → RouteLocationRaw
  if ([...VUE_ROUTER_ROUTE_PARTS].every((p) => partsSet.has(p))) {
    parts = [
      ...parts.filter((p) => !VUE_ROUTER_ROUTE_PARTS.has(p) && p !== 'string'),
      'RouteLocationRaw',
    ]
  }

  return parts
}

// Vue renders VNode with full internal generics (RendererNode, RendererElement, …)
// that are meaningless to consumers. Strip them so we show just `VNode`.
const STRIP_VNODE_GENERICS_RE = /\bVNode<[^<>]*(?:<[^<>]*>[^<>]*)*>/g

function schemaToTypeStr(schema: any, seen = new Set<string>()): string {
  if (typeof schema === 'string') {
    // Resolve minified/generic names to their cleaner symbol names
    let resolved = typeNameOverrides.get(schema) ?? schema
    if (resolved === 'undefined') return ''
    // Strip internal VNode generic args — they're implementation detail noise
    resolved = resolved.replace(STRIP_VNODE_GENERICS_RE, 'VNode')
    return resolved
  }
  if (!schema) return ''

  const kind: string = schema.kind
  const type: string = schema.type ?? ''

  if (!kind) return type

  if (type && seen.has(type)) return type
  const next = new Set(seen)
  if (type) next.add(type)

  if (kind === 'enum') {
    if (type === 'boolean') return 'boolean'
    const members: any[] = schema.schema ?? []
    let parts = members
      .map((s: any) => schemaToTypeStr(s, next))
      .filter((s: string) => s && s !== 'undefined')
    // TypeScript expands `boolean` to `true | false` as literals — normalise it back.
    if ([...parts].sort().join('|') === 'false|true') return 'boolean'
    parts = collapseKnownUnions(parts)
    return parts.length ? parts.join(' | ') : stripUndefined(type)
  }

  if (kind === 'array') {
    const items: any[] = schema.schema ?? []
    if (!items.length) return stripUndefined(type)
    const el = schemaToTypeStr(items[0], next)
    if (!el) return stripUndefined(type)
    // Wrap union element types in parens so `(A | B)[]` is unambiguous
    return el.includes(' | ') ? `(${el})[]` : `${el}[]`
  }

  if (kind === 'object') {
    const propMap: Record<string, any> = schema.schema ?? {}
    const entries = Object.values(propMap)
    if (!entries.length) return stripUndefined(type)
    const fields = (entries as any[])
      .filter((p) => !p.global)
      .map((p) => {
        const raw = schemaToTypeStr(p.schema, next) || stripUndefined(p.type)
        // Strip `| undefined` from optional property types — the `?:` already
        // signals optionality; including it is redundant and adds visual noise.
        const ft = p.required ? raw : stripUndefined(raw)
        return `${p.name}${p.required ? '' : '?'}: ${ft}`
      })
    return fields.length ? `{ ${fields.join('; ')} }` : stripUndefined(type)
  }

  return stripUndefined(type)
}

function resolveType(type: string, schema: any): string {
  const resolved = schemaToTypeStr(schema) || stripUndefined(type)
  return resolved.replace(STRIP_VNODE_GENERICS_RE, 'VNode')
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
      change: 'Fired after the value is committed.',
      open: 'Fired when the component opens.',
      close: 'Fired when the component closes.',
      dismiss: 'Fired when the component is dismissed.',
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
  return [...stories].sort((a, b) => {
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
        type: resolveType(x.type, x.schema),
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
        type: resolveType(x.type, x.schema),
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
      scriptLines.push(`\n  const ${names.props} = ${toVueExpression(c.props)}`)
    }
    if (c.slots.length > 0) {
      scriptLines.push(`\n  const ${names.slots} = ${toVueExpression(c.slots)}`)
    }
    if (c.emits.length > 0) {
      scriptLines.push(`\n  const ${names.emits} = ${toVueExpression(c.emits)}`)
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

function getAvailableComponents(rootDir: string) {
  if (!fs.existsSync(rootDir)) return []
  return fs
    .readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => {
      return fs.existsSync(path.join(rootDir, name, `${name}.vue`))
    })
    .sort((a, b) => a.localeCompare(b))
}

// A folder's `index.ts` may re-export additional public sub-components
// alongside the primary one (e.g. DatePicker also exports DateRangePicker
// and DateTimePicker). Each public sub-component gets its own meta file.
function getPublicComponentsFromIndex(rootDir: string, folder: string): string[] {
  const indexPath = path.join(rootDir, folder, 'index.ts')
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
  rootDir: string
  vuePath: string
  siblings: string[]
}

function getDocumentables(): Documentable[] {
  const docs: Documentable[] = []
  for (const rootDir of SOURCE_ROOTS) {
    for (const folder of getAvailableComponents(rootDir)) {
      const fromIndex = getPublicComponentsFromIndex(rootDir, folder)
      const candidates = fromIndex.length > 0 ? fromIndex : [folder]
      const names = (
        candidates.includes(folder) ? candidates : [folder, ...candidates]
      ).filter((name) =>
        fs.existsSync(path.join(rootDir, folder, `${name}.vue`)),
      )

      for (const name of names) {
        docs.push({
          folder,
          name,
          rootDir,
          vuePath: path.join(rootDir, folder, `${name}.vue`),
          siblings: names,
        })
      }
    }
  }
  return docs
}

function getStories(rootDir: string, componentName: string) {
  const storiesDir = path.join(rootDir, componentName, 'stories')

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

function getStoryPreviewMarkup(rootDir: string, componentName: string) {
  return getStories(rootDir, componentName)
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

function syncComponentDocsStories(rootDir: string, componentName: string) {
  const docsPath = path.join(rootDir, componentName, `${componentName}.md`)

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

  const storiesMarkup = getStoryPreviewMarkup(rootDir, componentName)
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
    if (docs.length === 0) return
    // Primary first, then any sub-components in declaration order.
    const ordered = [
      ...docs.filter((d) => d.name === d.folder),
      ...docs.filter((d) => d.name !== d.folder),
    ]
    const rootDir = ordered[0].rootDir

    const components = ordered.map((d) => {
      const meta = tsconfigChecker.getComponentMeta(d.vuePath)
      return extractTableData(d.name, meta)
    })

    const metaFilePath = path.join(rootDir, folder, `${folder}.api.md`)
    const str = genFolderMetaTable(folder, components)
    fs.writeFileSync(metaFilePath, str)
    console.log(`Generated ${folder} meta`)

    syncComponentDocsStories(rootDir, folder)
  } catch (error) {
    console.error('-----------------------------\n', folder, ':', error)
    process.exitCode = 1
  }
})
