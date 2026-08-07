import * as url from 'url'
import path from 'path'
import fs from 'fs'

import ts from 'typescript'
import type { MetaCheckerOptions } from 'vue-component-meta'
import { createChecker } from 'vue-component-meta'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

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
  path.join(__dirname, '../../frappe'),
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

const BRACKET_PAIRS: Record<string, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
}

// Walks a printed type from `start` (an opening bracket) to its matching
// closing bracket, skipping brackets inside string literals and the `>` of an
// arrow. Returns -1 if the brackets are unbalanced.
function findMatchingBracket(type: string, start: number) {
  const stack: string[] = []
  let quote: string | null = null

  for (let i = start; i < type.length; i++) {
    const char = type[i]

    if (quote) {
      if (char === '\\') i++
      else if (char === quote) quote = null
      continue
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char
      continue
    }
    if (char === '=' && type[i + 1] === '>') {
      i++
      continue
    }
    if (BRACKET_PAIRS[char]) {
      stack.push(BRACKET_PAIRS[char])
      continue
    }
    if (stack.length > 0 && char === stack[stack.length - 1]) {
      stack.pop()
      if (stack.length === 0) return i
    }
  }

  return -1
}

// Splits a printed type on the given separators, ignoring the ones nested in
// brackets or string literals. Parts keep their surrounding whitespace, and
// the separators are returned alongside so the caller can put them back.
function splitTopLevel(type: string, separators: string) {
  const parts: string[] = []
  const seps: string[] = []
  const stack: string[] = []
  let quote: string | null = null
  let current = ''

  for (let i = 0; i < type.length; i++) {
    const char = type[i]

    if (quote) {
      current += char
      if (char === '\\') current += type[++i] ?? ''
      else if (char === quote) quote = null
      continue
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char
      current += char
      continue
    }
    if (char === '=' && type[i + 1] === '>') {
      current += '=>'
      i++
      continue
    }
    if (BRACKET_PAIRS[char]) {
      stack.push(BRACKET_PAIRS[char])
      current += char
      continue
    }
    if (stack.length > 0 && char === stack[stack.length - 1]) {
      stack.pop()
      current += char
      continue
    }
    if (stack.length === 0 && separators.includes(char)) {
      parts.push(current)
      seps.push(char)
      current = ''
      continue
    }

    current += char
  }

  parts.push(current)
  return { parts, seps }
}

// Drops every balanced bracket group so a member can be checked on its own
// syntax: `Record<string, number>` collapses to `Record`, which has nothing
// position-dependent left in it.
function stripBracketGroups(member: string) {
  let result = ''
  let quote: string | null = null

  for (let i = 0; i < member.length; i++) {
    const char = member[i]

    if (quote) {
      if (char === '\\') i++
      else if (char === quote) quote = null
      continue
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char
      continue
    }
    if (char === '=' && member[i + 1] === '>') {
      result += '=>'
      i++
      continue
    }
    if (BRACKET_PAIRS[char]) {
      const end = findMatchingBracket(member, i)
      if (end === -1) {
        result += char
        continue
      }
      i = end
      continue
    }

    result += char
  }

  return result
}

// Only plain type references and literals get reordered. Anything with a
// parameter list, an object member or an arrow left after the bracket groups
// are stripped is a member whose position may carry meaning, so leave it.
function isReorderableUnionMember(member: string) {
  const trimmed = member.trim()
  return (
    trimmed.length > 0 && !/[:;,(){}<>=?]/.test(stripBracketGroups(trimmed))
  )
}

// Compare by code point rather than locale so the output does not depend on
// the machine's ICU data.
function compareUnionMembers(a: string, b: string) {
  return a < b ? -1 : a > b ? 1 : 0
}

// An object member, tuple element or named parameter keeps its label where it
// is; only the type after the label is a union.
const MEMBER_LABEL = /^\s*(?:readonly\s+)?[A-Za-z_$][\w$]*\??\s*:\s*/

/**
 * Sorts the members of every union in a printed type.
 *
 * TypeScript prints union members in the order its checker happened to resolve
 * them, which shifts with how much of the program is loaded. Without this an
 * unrelated new component folder can reorder `Tooltip`'s `side` union and fail
 * the CI staleness check for a change that touched nothing.
 */
function sortUnions(type: string): string {
  const { parts, seps } = splitTopLevel(type, ',;')
  return parts
    .map(sortUnionInPart)
    .reduce((acc, part, i) => acc + seps[i - 1] + part)
}

function sortUnionInPart(part: string): string {
  const label = part.match(MEMBER_LABEL)?.[0] ?? ''
  const rest = part.slice(label.length)

  const members = splitTopLevel(rest, '|').parts.map(sortUnionsInsideBrackets)
  if (members.length < 2 || !members.every(isReorderableUnionMember)) {
    return label + members.join('|')
  }

  const leading = members[0].match(/^\s*/)![0]
  const trailing = members[members.length - 1].match(/\s*$/)![0]
  const sorted = members.map((m) => m.trim()).sort(compareUnionMembers)
  return `${label}${leading}${sorted.join(' | ')}${trailing}`
}

function sortUnionsInsideBrackets(member: string) {
  let result = ''
  let quote: string | null = null

  for (let i = 0; i < member.length; i++) {
    const char = member[i]

    if (quote) {
      result += char
      if (char === '\\') result += member[++i] ?? ''
      else if (char === quote) quote = null
      continue
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char
      result += char
      continue
    }
    if (char === '=' && member[i + 1] === '>') {
      result += '=>'
      i++
      continue
    }
    if (BRACKET_PAIRS[char]) {
      const end = findMatchingBracket(member, i)
      if (end === -1) {
        result += char
        continue
      }
      result += char + sortUnions(member.slice(i + 1, end)) + member[end]
      i = end
      continue
    }

    result += char
  }

  return result
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
 * Payload types for a component's emits, read off the emit types Vue generates
 * for the SFC rather than off `$emit`.
 *
 * vue-component-meta derives each emit's payload from the call signatures of
 * `$emit`, which Vue builds from `__VLS_ModelEmit & __VLS_Emit`. An event
 * declared *both* by `defineModel()` and in the `defineEmits<T>()` type
 * argument therefore ends up with an intersection of two tuples as its payload,
 * and TypeScript cannot infer named rest args back out of a tuple intersection
 * — the signature collapses to `(event, ...args: unknown[])` and the docs lose
 * the real type. The declared types survive intact in the generated file, so
 * read them straight from there.
 *
 * `defineEmits<T>()` is applied last: when both declare an event, the
 * hand-written interface is the documented contract.
 */
function getDeclaredEmitTypes(vuePath: string) {
  const types = new Map<string, string>()
  const program = tsconfigChecker.getProgram()
  const sourceFile = program?.getSourceFile(vuePath)
  if (!program || !sourceFile) return types

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
      types.set(emit.getName(), printType(typeChecker, payload))
    }
  }

  return types
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
  // Only consulted for emits vue-component-meta could not resolve, so
  // components it already types correctly keep their existing output.
  const declaredEmitTypes = getDeclaredEmitTypes(vuePath)

  const props = data.props
    .filter((x: any) => !x.global)
    .map((x: any) =>
      withOptional({
        name: x.name,
        description: x.description,
        required: x.required,
        type: sortUnions(parseTypeStr(x.type)),
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
        type: sortUnions(x.type).slice(0, 100),
        deprecated: getDeprecation(x.tags),
      }),
    )

  const emits = data.events
    .filter((x: any) => !x.global)
    .map((x: any) =>
      withOptional({
        name: x.name,
        description: getEventDescription(x.name, x.description),
        type: sortUnions(
          x.type === 'unknown[]'
            ? (declaredEmitTypes.get(x.name) ?? x.type)
            : x.type,
        ),
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
  // the staleness check in CI would then fail on formatting instead of on a
  // real API change.
  const scriptStr = scriptLines.join('\n')
  const bodyStr = markupStr.trimEnd()
  return bodyStr ? `${scriptStr}\n\n${bodyStr}\n` : `${scriptStr}\n`
}

function pascalCase(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

function getAvailableComponents(rootDir: string) {
  if (!fs.existsSync(rootDir)) return []
  return fs
    .readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => {
      // Molecule folders are lowercase (src/molecules/list → List.vue) and
      // opt into generated docs via a colocated <folder>.md — this keeps
      // folders with hand-written docs pages (editor) out of --all runs.
      if (name !== pascalCase(name)) {
        return (
          fs.existsSync(path.join(rootDir, name, `${pascalCase(name)}.vue`)) &&
          fs.existsSync(path.join(rootDir, name, `${name}.md`))
        )
      }
      if (!fs.existsSync(path.join(rootDir, name, `${name}.vue`))) return false
      // Experimental exports opt in the same way: most of them are documented
      // in prose on the Experimental overview page and have no page of their
      // own to render the generated tables into.
      if (rootDir === EXPERIMENTAL_ROOT) {
        return fs.existsSync(path.join(rootDir, name, `${name}.md`))
      }
      return true
    })
    .sort((a, b) => a.localeCompare(b))
}

// A folder's `index.ts` may re-export additional public sub-components
// alongside the primary one (e.g. DatePicker also exports DateRangePicker
// and DateTimePicker). Each public sub-component gets its own meta file.
function getPublicComponentsFromIndex(
  rootDir: string,
  folder: string,
): string[] {
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
      const primary = pascalCase(folder)
      const fromIndex = getPublicComponentsFromIndex(rootDir, folder)
      const candidates = fromIndex.length > 0 ? fromIndex : [primary]
      const names = (
        candidates.includes(primary) ? candidates : [primary, ...candidates]
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

// TypeScript orders the members of a union by the order it resolved them, which
// depends on how much of the program the checker has loaded. A run over one
// folder therefore prints some unions in a different order than a full run, even
// though nothing in the source changed. The committed tables are the full run's
// output — CI regenerates everything and fails on any diff — so a partial run is
// for iterating, not for committing.
if (selectedFolders.length !== folderOrder.length) {
  console.warn(
    'Note: this is a partial run. Run `yarn docs:gen` with no arguments before committing.',
  )
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
