#!/usr/bin/env node
/**
 * Migrate the list family's pre-v1 row selectors and slot names.
 *
 * Usage: list-v1 [--dry-run] <dir-or-file...>
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const USAGE = 'Usage: list-v1 [--dry-run] <dir-or-file...>'
const EXTENSIONS = new Set([
  '.css',
  '.html',
  '.js',
  '.jsx',
  '.md',
  '.ts',
  '.tsx',
  '.vue',
])
const COMPONENTS = new Set(['ListGroup', 'ListHeaderCellSort', 'ListRow'])
const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'source',
  'track',
  'wbr',
])

const kebab = (name) =>
  name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

function knownComponent(name) {
  return [...COMPONENTS].find(
    (component) => name === component || name === kebab(component),
  )
}

function lineAt(source, index) {
  return source.slice(0, index).split('\n').length
}

// Only the start of an import has to be code. Its module string is expected to
// be masked, and checking every character would reject every real import.
function codeMask(source) {
  const mask = new Uint8Array(source.length)
  let i = 0
  while (i < source.length) {
    const char = source[i]
    const next = source[i + 1]
    if (char === '/' && next === '/') {
      const end = source.indexOf('\n', i + 2)
      const stop = end === -1 ? source.length : end
      mask.fill(1, i, stop)
      i = stop
      continue
    }
    if (char === '/' && next === '*') {
      const end = source.indexOf('*/', i + 2)
      const stop = end === -1 ? source.length : end + 2
      mask.fill(1, i, stop)
      i = stop
      continue
    }
    if (char === "'" || char === '"' || char === '`') {
      const quote = char
      mask[i] = 1
      i += 1
      while (i < source.length) {
        mask[i] = 1
        if (source[i] === '\\') {
          if (i + 1 < source.length) mask[i + 1] = 1
          i += 2
          continue
        }
        if (source[i] === quote) {
          i += 1
          break
        }
        i += 1
      }
      continue
    }
    i += 1
  }
  return mask
}

function importedBindings(clause) {
  const bindings = []
  const trimmed = clause.trim()
  if (!trimmed.startsWith('{') && !trimmed.startsWith('*')) {
    const name = trimmed.split(',')[0].trim()
    if (name) bindings.push({ imported: 'default', local: name })
  }
  const named = /\{([\s\S]*?)\}/.exec(clause)?.[1]
  if (!named) return bindings
  for (const part of named.split(',')) {
    const match = /^\s*(?:type\s+)?([\w$]+)(?:\s+as\s+([\w$]+))?\s*$/.exec(part)
    if (match)
      bindings.push({ imported: match[1], local: match[2] || match[1] })
  }
  return bindings
}

export function componentAliases(source) {
  const aliases = new Map()

  const mask = codeMask(source)
  const imports = /\bimport\s+([\s\S]*?)\s+from\s*(['"])([^'"]+)\2/g
  for (const match of source.matchAll(imports)) {
    if (mask[match.index]) continue
    const moduleName = match[3]
    for (const binding of importedBindings(match[1])) {
      if (moduleName === 'frappe-ui/list' && COMPONENTS.has(binding.imported)) {
        aliases.set(binding.local, binding.imported)
        aliases.set(kebab(binding.local), binding.imported)
      } else if (binding.local && COMPONENTS.has(binding.local)) {
        // A local component with the same name shadows a global registration.
        aliases.delete(binding.local)
        aliases.delete(kebab(binding.local))
      }
    }
  }

  for (const name of COMPONENTS) {
    const declaration = new RegExp(
      `\\b(?:const|let|var|class|function)\\s+${name}\\b`,
      'g',
    )
    let match
    while ((match = declaration.exec(source))) {
      if (mask[match.index]) continue
      aliases.delete(name)
      aliases.delete(kebab(name))
      break
    }
  }
  return aliases
}

function findTagEnd(source, start) {
  let quote
  for (let i = start; i < source.length; i += 1) {
    const char = source[i]
    if (quote) {
      if (char === quote && source[i - 1] !== '\\') quote = undefined
    } else if (char === "'" || char === '"') {
      quote = char
    } else if (char === '>') {
      return i
    }
  }
  return -1
}

function replaceStaticSlot(tag, from, to) {
  let migrated = tag
    .replace(new RegExp(`(^|\\s)#${from}(?=[.\\s=/>])`, 'g'), `$1#${to}`)
    .replace(
      new RegExp(`(^|\\s)v-slot:${from}(?=[.\\s=/>])`, 'g'),
      `$1v-slot:${to}`,
    )
  migrated = migrated.replace(
    new RegExp(`(\\sslot\\s*=\\s*)(['"])${from}\\2`, 'g'),
    `$1$2${to}$2`,
  )
  return migrated
}

function replaceListRowUtilities(tag) {
  return tag
    .replaceAll('data-[state=selected]', 'data-[selected]')
    .replaceAll('data-[active]', 'data-[state=active]')
}

function migrateMarkup(source, aliases) {
  let migrated = ''
  let cursor = 0
  const stack = []
  const refusals = []

  while (cursor < source.length) {
    const start = source.indexOf('<', cursor)
    if (start === -1) break
    migrated += source.slice(cursor, start)
    if (source.startsWith('<!--', start)) {
      const commentEnd = source.indexOf('-->', start + 4)
      const next = commentEnd === -1 ? source.length : commentEnd + 3
      migrated += source.slice(start, next)
      cursor = next
      continue
    }
    const end = findTagEnd(source, start + 1)
    if (end === -1) {
      migrated += source.slice(start)
      cursor = source.length
      break
    }
    const tag = source.slice(start, end + 1)
    const close = /^<\/([A-Za-z][\w.-]*)/.exec(tag)
    if (close) {
      const at = stack.map((entry) => entry.name).lastIndexOf(close[1])
      if (at !== -1) stack.splice(at)
      migrated += tag
      cursor = end + 1
      continue
    }
    const open = /^<([A-Za-z][\w.-]*)/.exec(tag)
    if (!open) {
      migrated += tag
      cursor = end + 1
      continue
    }

    const name = open[1]
    if (name === 'script' || name === 'style') {
      const close = new RegExp(`</${name}\\s*>`, 'gi')
      close.lastIndex = end + 1
      const match = close.exec(source)
      const next = match ? close.lastIndex : source.length
      migrated += source.slice(start, next)
      cursor = next
      continue
    }
    const component = aliases.get(name)
    const ambiguousComponent = component ? undefined : knownComponent(name)
    let nextTag = tag
    if (component === 'ListRow') nextTag = replaceListRowUtilities(nextTag)
    if (
      ambiguousComponent === 'ListRow' &&
      /data-\[(?:active|state=selected)\]/.test(tag)
    ) {
      refusals.push({
        line: lineAt(source, start),
        message:
          '<ListRow> state utility found but no frappe-ui/list import; check by hand',
      })
    }

    const parentEntry = stack.at(-1)
    const parent = parentEntry?.component
    const ambiguousParent = parentEntry?.ambiguousComponent
    if (name === 'template' && (parent || ambiguousParent)) {
      if (/#\[|v-slot:\[/.test(tag)) {
        const owner = parent || ambiguousParent
        if (owner === 'ListGroup' || owner === 'ListHeaderCellSort') {
          refusals.push({
            line: lineAt(source, start),
            message: `dynamic slot under <${owner}> must be checked manually`,
          })
        }
      } else if (parent === 'ListGroup') {
        nextTag = replaceStaticSlot(nextTag, 'header', 'label')
      } else if (parent === 'ListHeaderCellSort') {
        nextTag = replaceStaticSlot(nextTag, 'suffix', 'sort-indicator')
      } else if (
        ambiguousParent === 'ListGroup' &&
        /(?:#|v-slot:)header(?=[.\s=/>])|slot\s*=\s*(['"])header\1/.test(tag)
      ) {
        refusals.push({
          line: lineAt(source, start),
          message:
            '<ListGroup> #header found but no frappe-ui/list import; check by hand',
        })
      } else if (
        ambiguousParent === 'ListHeaderCellSort' &&
        /(?:#|v-slot:)suffix(?=[.\s=/>])|slot\s*=\s*(['"])suffix\1/.test(tag)
      ) {
        refusals.push({
          line: lineAt(source, start),
          message:
            '<ListHeaderCellSort> #suffix found but no frappe-ui/list import; check by hand',
        })
      }
    }

    migrated += nextTag
    if (
      !/\/\s*>$/.test(tag) &&
      !VOID_ELEMENTS.has(name.toLowerCase())
    ) {
      stack.push({ name, component, ambiguousComponent })
    }
    cursor = end + 1
  }
  migrated += source.slice(cursor)
  return { migrated, refusals }
}

const LIST_ROW_SLOT = String.raw`\[data-slot\s*=\s*(?:["']?list-row["']?)\]`
const OLD_SELECTED = String.raw`\[data-state\s*=\s*(?:["']?selected["']?)\]`

function migrateAnchoredSelectors(source) {
  return source
    .replace(
      new RegExp(`(${LIST_ROW_SLOT})(${OLD_SELECTED})`, 'g'),
      '$1[data-selected]',
    )
    .replace(
      new RegExp(`(${OLD_SELECTED})(${LIST_ROW_SLOT})`, 'g'),
      '[data-selected]$2',
    )
    .replace(
      new RegExp(`(${LIST_ROW_SLOT})\\[data-active\\]`, 'g'),
      "$1[data-state='active']",
    )
    .replace(
      new RegExp(`\\[data-active\\](${LIST_ROW_SLOT})`, 'g'),
      "[data-state='active']$1",
    )
}

export function migrateList(source) {
  const aliases = componentAliases(source)
  const selectorsMigrated = migrateAnchoredSelectors(source)
  return migrateMarkup(selectorsMigrated, aliases)
}

function filesIn(target, seen = new Set()) {
  let stat
  try {
    stat = fs.lstatSync(target)
  } catch (error) {
    throw new Error(
      `${target}: ${error.code === 'ENOENT' ? 'not found' : error.message}`,
    )
  }
  if (stat.isSymbolicLink()) return []
  if (stat.isFile()) {
    // Migration guides intentionally contain the old spelling in "before"
    // examples. Rewriting them makes the guide false and prevents idempotent
    // own-tree runs.
    if (path.basename(target).toLowerCase() === 'migration.md') return []
    return EXTENSIONS.has(path.extname(target)) ? [target] : []
  }
  if (!stat.isDirectory()) return []
  const real = fs.realpathSync(target)
  if (seen.has(real)) return []
  seen.add(real)
  return fs
    .readdirSync(target, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      if (['node_modules', '.git', 'dist', 'build'].includes(entry.name))
        return []
      return filesIn(path.join(target, entry.name), seen)
    })
}

export function run(argv) {
  const dryRun = argv.includes('--dry-run')
  const unknown = argv.find((arg) => arg.startsWith('-') && arg !== '--dry-run')
  if (unknown) {
    console.error(`Unknown option: ${unknown}\n${USAGE}`)
    return 1
  }
  const targets = argv.filter((arg) => arg !== '--dry-run')
  if (!targets.length) {
    console.error(USAGE)
    return 1
  }

  let files
  try {
    files = [
      ...new Set(targets.flatMap((target) => filesIn(path.resolve(target)))),
    ]
  } catch (error) {
    console.error(error.message)
    return 1
  }

  let changed = 0
  let refusalCount = 0
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8')
    const result = migrateList(source)
    if (result.refusals.length) {
      refusalCount += result.refusals.length
      for (const refusal of result.refusals) {
        console.error(`${file}:${refusal.line}: ${refusal.message}`)
      }
      continue
    }
    if (result.migrated === source) continue
    changed += 1
    if (!dryRun) fs.writeFileSync(file, result.migrated)
    console.log(`${dryRun ? 'Would migrate' : 'Migrated'} ${file}`)
  }
  console.log(
    `${dryRun ? 'Would migrate' : 'Migrated'} ${changed} file${changed === 1 ? '' : 's'}.`,
  )
  if (refusalCount) {
    console.error(
      `Refused ${refusalCount} dynamic slot${refusalCount === 1 ? '' : 's'}; no refused file was changed.`,
    )
    return 1
  }
  return 0
}

const script = fileURLToPath(import.meta.url)
let isMain = false
if (process.argv[1]) {
  try {
    isMain = fs.realpathSync(process.argv[1]) === fs.realpathSync(script)
  } catch {
    isMain = false
  }
}
if (isMain) process.exitCode = run(process.argv.slice(2))
