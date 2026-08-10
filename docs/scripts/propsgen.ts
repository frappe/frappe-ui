import * as url from 'url'
import path from 'path'
import fs from 'fs'

import ts from 'typescript'
import type { MetaCheckerOptions } from 'vue-component-meta'
import { createChecker } from 'vue-component-meta'

import {
  diffApiTables,
  formatDifferences,
  parseApiTables,
  summarizeDifference,
} from './api-tables'
import { createSourceOrder } from './source-order'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const REPO_ROOT = path.join(__dirname, '../..')

// `--check` compares the committed tables against a fresh run instead of
// rewriting them. It reports an entry that was added, removed or whose type,
// default or description changed, and ignores the order of the rows.
const isCheck = process.argv.slice(2).includes('--check')

const checkerOptions: MetaCheckerOptions = {
  forceUseTs: true,
  schema: { ignore: ['MyIgnoredNestedProps'] },
  printer: { newLine: 1 },
}

const tsconfigChecker = createChecker(
  // the app project — the root tsconfig.json is solution-style (no files)
  path.join(__dirname, '../../tsconfig.app.json'),
  checkerOptions,
)

const EXPERIMENTAL_ROOT = path.join(__dirname, '../../experimental')

const SOURCE_ROOTS = [
  path.join(__dirname, '../../src/components'),
  path.join(__dirname, '../../src/molecules'),
  // `src` itself, for families that sit directly under it (src/charts).
  path.join(__dirname, '../../src'),
  EXPERIMENTAL_ROOT,
]
const AUTO_STORIES_START = '<!-- AUTO-GENERATED STORIES START -->'
const AUTO_STORIES_END = '<!-- AUTO-GENERATED STORIES END -->'

function parseTypeStr(type: string) {
  if (type.includes('undefined')) {
    return type.replace(' | undefined', '').trim()
  }
  return type
}

// Names Vue's language tooling gives the emit types it generates for an SFC:
// `__VLS_ModelEmit` holds one entry per `defineModel()`, `__VLS_Emit` holds the
// `defineEmits<T>()` type argument.
const MODEL_EMIT_TYPE = '__VLS_ModelEmit'
const DECLARED_EMIT_TYPE = '__VLS_Emit'

// Mirrors vue-component-meta's own type printing so recovered types read
// exactly like the ones it resolves itself.
function printType(typeChecker: ts.TypeChecker, type: ts.Type) {
  const str = typeChecker.typeToString(
    type,
    undefined,
    ts.TypeFormatFlags.UseFullyQualifiedType | ts.TypeFormatFlags.NoTruncation,
  )
  return str.includes('import(') ? str.replace(/import\(.*?\)\./g, '') : str
}

/**
 * Payload types and descriptions for a component's emits, read off the emit
 * types Vue generates for the SFC rather than off `$emit`.
 *
 * vue-component-meta derives each emit's payload from the call signatures of
 * `$emit`, which Vue builds from `__VLS_ModelEmit & __VLS_Emit`. An event
 * declared *both* by `defineModel()` and in the `defineEmits<T>()` type
 * argument therefore ends up with an intersection of two tuples as its payload,
 * and TypeScript cannot infer named rest args back out of a tuple intersection
 * — the signature collapses to `(event, ...args: unknown[])` and the docs lose
 * the real type. It reports no description for an emit at all. Both survive
 * intact in the generated file, so read them straight from there.
 *
 * `defineEmits<T>()` is applied last: when both declare an event, the
 * hand-written interface is the documented contract.
 */
function getDeclaredEmits(vuePath: string) {
  const emits = new Map<string, { type: string; description: string }>()
  const program = tsconfigChecker.getProgram()
  const sourceFile = program?.getSourceFile(vuePath)
  if (!program || !sourceFile) return emits

  const typeChecker = program.getTypeChecker()

  for (const aliasName of [MODEL_EMIT_TYPE, DECLARED_EMIT_TYPE]) {
    const declaration = sourceFile.statements.find(
      (statement): statement is ts.TypeAliasDeclaration =>
        ts.isTypeAliasDeclaration(statement) &&
        statement.name.text === aliasName,
    )
    if (!declaration) continue

    const symbol = typeChecker.getSymbolAtLocation(declaration.name)
    const emitsType = symbol
      ? typeChecker.getDeclaredTypeOfSymbol(symbol)
      : typeChecker.getTypeAtLocation(declaration.type)

    for (const emit of emitsType.getProperties()) {
      const payload = typeChecker.getTypeOfSymbolAtLocation(emit, declaration)
      emits.set(emit.getName(), {
        type: printType(typeChecker, payload),
        description: ts
          .displayPartsToString(emit.getDocumentationComment(typeChecker))
          .trim(),
      })
    }
  }

  return emits
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

function extractTableData(name: string, data: any, vuePath: string) {
  // The payload is only consulted for emits vue-component-meta could not
  // resolve, so components it already types correctly keep their existing
  // output. The description always comes from here — it reports none.
  const declaredEmits = getDeclaredEmits(vuePath)
  const sourceOrder = createSourceOrder(tsconfigChecker.getProgram()!)

  const props = sourceOrder
    .sortByDeclaration(data.props.filter((x: any) => !x.global))
    .map((x: any) =>
      withOptional({
        name: x.name,
        description: x.description,
        required: x.required,
        // Only a prop's type is ever a union at the top level; a slot's is an
        // object and an emit's is a tuple.
        type: sourceOrder.orderUnion(parseTypeStr(x.type), x),
        // An explicit `= undefined` is not a default — the docs table renders
        // the string as a literal "undefined" in the Default column.
        default: x.default === 'undefined' ? undefined : x.default,
        deprecated: getDeprecation(x.tags),
      }),
    )

  const slots = sourceOrder
    .sortByDeclaration(data.slots.filter((x: any) => !x.global))
    .map((x: any) =>
      withOptional({
        name: x.name,
        description: x.description,
        type: x.type.slice(0, 100),
        deprecated: getDeprecation(x.tags),
      }),
    )

  const emits = sourceOrder
    .sortByDeclaration(data.events.filter((x: any) => !x.global))
    .map((x: any) =>
      withOptional({
        name: x.name,
        description: getEventDescription(
          x.name,
          x.description || declaredEmits.get(x.name)?.description,
        ),
        type:
          x.type === 'unknown[]'
            ? (declaredEmits.get(x.name)?.type ?? x.type)
            : x.type,
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

  let markupStr = ''

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
      markupStr += `<PropsTable${folderAttr} name="${c.name}" :data="${names.props}"/>\n\n`
    }
    if (c.slots.length > 0) {
      markupStr += `<SlotsTable :data="${names.slots}"/>\n\n`
    }
    if (c.emits.length > 0) {
      markupStr += `<EmitsTable :data="${names.emits}"/>\n\n`
    }
  }

  // The output has to match what Prettier would write. `lint-staged` runs
  // `prettier --write` over `*.md`, so a trailing space or a missing blank
  // line here gets rewritten by the next commit that touches the file, and
  // the generated files and the generator drift apart with nothing to say so.
  const scriptStr = scriptLines.join('\n')
  const bodyStr = markupStr.trimEnd()
  return bodyStr ? `${scriptStr}\n\n${bodyStr}\n` : `${scriptStr}\n`
}

function pascalCase(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

// A folder opts into generated docs by carrying its own docs page: either a
// single colocated `<folder>.md`, or a `docs/` directory of per-component
// pages (src/charts). Folders documented by hand elsewhere (editor) carry
// neither, which keeps them out of `--all` runs.
function hasDocsPages(rootDir: string, folder: string) {
  if (fs.existsSync(path.join(rootDir, folder, `${folder}.md`))) return true

  const pagesDir = path.join(rootDir, folder, 'docs')
  if (!fs.existsSync(pagesDir)) return false
  return fs
    .readdirSync(pagesDir)
    .some((file) => file.endsWith('.md') && !file.endsWith('.api.md'))
}

function getAvailableComponents(rootDir: string) {
  if (!fs.existsSync(rootDir)) return []
  return fs
    .readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => {
      // Molecule folders are lowercase (src/molecules/list → List.vue).
      if (name !== pascalCase(name)) {
        if (!hasDocsPages(rootDir, name)) return false
        // The family's public SFCs are either one named after the folder
        // (src/molecules/list → List.vue) or a set re-exported from its
        // index (src/charts → BarChart.vue, LineChart.vue, …).
        return (
          fs.existsSync(path.join(rootDir, name, `${pascalCase(name)}.vue`)) ||
          getPublicComponentsFromIndex(rootDir, name).length > 0
        )
      }
      if (!fs.existsSync(path.join(rootDir, name, `${name}.vue`))) return false
      // Experimental exports opt in the same way: most of them are documented
      // in prose on the Experimental overview page and have no page of their
      // own to render the generated tables into.
      if (rootDir === EXPERIMENTAL_ROOT) {
        return hasDocsPages(rootDir, name)
      }
      return true
    })
    .sort((a, b) => a.localeCompare(b))
}

// A folder's `index.ts` may re-export additional public sub-components
// alongside the primary one (e.g. DatePicker also exports DateRangePicker
// and DateTimePicker). Each public sub-component gets its own meta file.
//
// The SFC may sit in a sub-directory of the folder (src/charts exports its
// chrome from `./components/`), so the match keeps the whole relative path and
// only the basename has to equal the exported name.
function getPublicComponentsFromIndex(
  rootDir: string,
  folder: string,
): { name: string; relativePath: string }[] {
  const indexPath = path.join(rootDir, folder, 'index.ts')
  if (!fs.existsSync(indexPath)) return []

  const content = fs.readFileSync(indexPath, 'utf8')
  const re =
    /export\s*\{\s*default\s+as\s+(\w+)\s*\}\s*from\s*['"]\.\/((?:[\w-]+\/)*(\w+))\.vue['"]/g
  const found = new Map<string, string>()
  let m: RegExpExecArray | null
  while ((m = re.exec(content))) {
    if (m[1] === m[3]) found.set(m[1], `${m[2]}.vue`)
  }
  return [...found].map(([name, relativePath]) => ({ name, relativePath }))
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
      const primary = pascalCase(folder)
      const fromIndex = getPublicComponentsFromIndex(rootDir, folder)
      const primaryEntry = { name: primary, relativePath: `${primary}.vue` }
      const candidates = fromIndex.length > 0 ? fromIndex : [primaryEntry]
      const entries = (
        candidates.some((c) => c.name === primary)
          ? candidates
          : [primaryEntry, ...candidates]
      ).filter((entry) =>
        fs.existsSync(path.join(rootDir, folder, entry.relativePath)),
      )
      const names = entries.map((entry) => entry.name)

      for (const entry of entries) {
        docs.push({
          folder,
          name: entry.name,
          rootDir,
          vuePath: path.join(rootDir, folder, entry.relativePath),
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

// The story list comes straight off the filesystem, so it is the same on every
// run — unlike the emit rows, which the TypeScript checker orders. `null` means
// the page is already up to date, or has no auto-generated section at all.
function getDocsStoriesUpdate(rootDir: string, componentName: string) {
  const docsPath = path.join(rootDir, componentName, `${componentName}.md`)

  if (!fs.existsSync(docsPath)) {
    return null
  }

  const content = fs.readFileSync(docsPath, 'utf8')
  if (
    !content.includes(AUTO_STORIES_START) ||
    !content.includes(AUTO_STORIES_END)
  ) {
    return null
  }

  const storiesMarkup = getStoryPreviewMarkup(rootDir, componentName)
  const replacement = `${AUTO_STORIES_START}\n${storiesMarkup}\n${AUTO_STORIES_END}`
  const nextContent = replaceAutoGeneratedSection(content, replacement)

  if (nextContent === content) return null
  return { docsPath, nextContent }
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

// Props and union members are put back into source order (see `source-order`),
// so they no longer move between runs. Emits still can: an event declared by
// `defineModel()` is declared in Vue's own types, and where that lands relative
// to the ones from `defineEmits<T>()` is the checker's call. The committed
// tables are the full run's output, so a partial run is for iterating, not for
// committing. CI compares the rows themselves and ignores their order
// (`--check`), so a committed partial run does not fail the build.
if (!isCheck && selectedFolders.length !== folderOrder.length) {
  console.warn(
    'Note: this is a partial run. Run `yarn docs:gen` with no arguments before committing.',
  )
}

console.log(
  `${isCheck ? 'Checking' : 'Generating'} docs meta for: ${selectedFolders.join(', ')}`,
)

const staleFiles: string[] = []

function reportStale(relativePath: string, report: string) {
  staleFiles.push(relativePath)
  console.error(`\n${relativePath}\n${report}`)
}

function annotate(relativePath: string, message: string) {
  if (!process.env.GITHUB_ACTIONS) return
  // A workflow command is one line: the runner reads `%25`, `%0D` and `%0A`
  // back as `%`, CR and LF.
  const escaped = message
    .replace(/%/g, '%25')
    .replace(/\r/g, '%0D')
    .replace(/\n/g, '%0A')
  console.error(`::error file=${relativePath}::${escaped}`)
}

function checkMetaFile(
  folder: string,
  metaFilePath: string,
  generated: string,
) {
  const relativePath = path.relative(REPO_ROOT, metaFilePath)

  if (!fs.existsSync(metaFilePath)) {
    reportStale(relativePath, '  the table has never been generated')
    annotate(relativePath, 'the API table has never been generated')
    return
  }

  const committed = fs.readFileSync(metaFilePath, 'utf8')
  const differences = diffApiTables(
    parseApiTables(committed, folder),
    parseApiTables(generated, folder),
  )

  if (differences.length > 0) {
    reportStale(relativePath, formatDifferences(differences))
    for (const difference of differences) {
      annotate(relativePath, summarizeDifference(difference))
    }
  }
}

function checkStories(rootDir: string, folder: string) {
  const storiesUpdate = getDocsStoriesUpdate(rootDir, folder)
  if (storiesUpdate) {
    const storiesPath = path.relative(REPO_ROOT, storiesUpdate.docsPath)
    reportStale(storiesPath, '  the story list does not match the story files')
    annotate(storiesPath, 'the story list does not match the story files')
  }
}

selectedFolders.forEach((folder) => {
  try {
    const docs = docsByFolder.get(folder) ?? []
    if (docs.length === 0) return
    // Primary first, then any sub-components in declaration order.
    const ordered = [
      ...docs.filter((d) => d.name === pascalCase(d.folder)),
      ...docs.filter((d) => d.name !== pascalCase(d.folder)),
    ]
    const rootDir = ordered[0].rootDir

    const components = ordered.map((d) => {
      const meta = tsconfigChecker.getComponentMeta(d.vuePath)
      return extractTableData(d.name, meta, d.vuePath)
    })

    // A family that splits its docs one page per component (`<folder>/docs/
    // <Name>.md`, as src/charts does) gets a `<Name>.api.md` beside each page,
    // so the tables land under the component they belong to. Components
    // without a page of their own stay in the single `<folder>.api.md` that
    // one-page families include.
    const pagesDir = path.join(rootDir, folder, 'docs')
    const hasOwnPage = (name: string) =>
      fs.existsSync(path.join(pagesDir, `${name}.md`))

    const metaFiles = components
      .filter((c) => hasOwnPage(c.name))
      .map((component) => ({
        path: path.join(pagesDir, `${component.name}.api.md`),
        content: genFolderMetaTable(folder, [component]),
      }))

    const shared = components.filter((c) => !hasOwnPage(c.name))
    if (shared.length) {
      metaFiles.push({
        path: path.join(rootDir, folder, `${folder}.api.md`),
        content: genFolderMetaTable(folder, shared),
      })
    }

    if (isCheck) {
      for (const file of metaFiles) {
        checkMetaFile(folder, file.path, file.content)
      }
      checkStories(rootDir, folder)
      return
    }

    for (const file of metaFiles) {
      fs.writeFileSync(file.path, file.content)
    }
    console.log(`Generated ${folder} meta`)

    const storiesUpdate = getDocsStoriesUpdate(rootDir, folder)
    if (storiesUpdate) {
      fs.writeFileSync(storiesUpdate.docsPath, storiesUpdate.nextContent)
      console.log(`Synced ${folder} docs stories`)
    }
  } catch (error) {
    console.error('-----------------------------\n', folder, ':', error)
    process.exitCode = 1
  }
})

if (isCheck) {
  if (staleFiles.length > 0) {
    console.error(
      `\n${staleFiles.length} file(s) are out of date. Run \`yarn docs:gen\` with no arguments and commit the result.`,
    )
    process.exitCode = 1
  } else {
    console.log('\nThe committed API tables match the source.')
  }
}
