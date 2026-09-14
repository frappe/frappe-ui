#!/usr/bin/env node
/** Rename pre-v1 navigation props to the v1 destination vocabulary.
 * Usage: destinations-v1 [--dry-run] <dir-or-file...>
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const USAGE = 'Usage: destinations-v1 [--dry-run] <dir-or-file...>'
const EXTENSIONS = new Set(['.vue', '.md'])
const PROP_RENAMES = {
  Button: { link: 'href' },
  PageHeaderBackButton: { to: 'fallback-route' },
  ListRow: { to: 'route' },
  SidebarItem: { to: 'route' },
  SidebarRailItem: { to: 'route' },
  MobileNavItem: { to: 'route' },
}
const kebab = (name) =>
  name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

function componentAliases(source) {
  const aliases = new Map()
  const imports =
    /import\s*\{([^}]+)\}\s*from\s*['"]frappe-ui(?:\/[^'"]*)?['"]/g
  for (const match of source.matchAll(imports)) {
    for (const binding of match[1].split(',')) {
      const [imported, local] = binding
        .trim()
        .replace(/^type\s+/, '')
        .split(/\s+as\s+/)
      if (PROP_RENAMES[imported]) {
        const binding = local || imported
        aliases.set(binding, imported)
        aliases.set(kebab(binding), imported)
      }
    }
  }
  // Local template bindings shadow imports with the same local name.
  const localImports =
    /import\s+([^'";]+?)\s+from\s*['"](?!frappe-ui(?:\/|['"]))[^'"]+['"]/g
  for (const match of source.matchAll(localImports)) {
    const clause = match[1].trim()
    const bindings = []
    if (!clause.startsWith('{') && !clause.startsWith('*')) {
      bindings.push(clause.split(',')[0].trim())
    }
    const named = clause.match(/\{([^}]+)\}/)?.[1]
    if (named) {
      for (const binding of named.split(',')) {
        bindings.push(
          binding
            .trim()
            .split(/\s+as\s+/)
            .at(-1),
        )
      }
    }
    for (const name of bindings) {
      if (!PROP_RENAMES[name]) continue
      aliases.delete(name)
      aliases.delete(kebab(name))
    }
  }
  return aliases
}

function renameAttributes(tag, renames) {
  let migrated = ''
  let cursor = 0
  let quote
  while (cursor < tag.length) {
    const character = tag[cursor]
    if (quote) {
      migrated += character
      if (character === quote && tag[cursor - 1] !== '\\') quote = undefined
      cursor += 1
      continue
    }
    if (character === '"' || character === "'") {
      quote = character
      migrated += character
      cursor += 1
      continue
    }
    if (!/\s/.test(character)) {
      migrated += character
      cursor += 1
      continue
    }
    migrated += character
    cursor += 1
    const match = tag
      .slice(cursor)
      .match(/^(v-bind:|[:.]?)([A-Za-z][\w-]*)(?=[.\s=/>])/)
    if (!match) continue
    const replacement = renames[match[2]]
    migrated += replacement ? `${match[1]}${replacement}` : match[0]
    cursor += match[0].length
  }
  return migrated
}

function migrateMarkup(source, aliases) {
  let migrated = ''
  let cursor = 0
  while (cursor < source.length) {
    const start = source.indexOf('<', cursor)
    if (start === -1) return migrated + source.slice(cursor)
    migrated += source.slice(cursor, start)
    if (source.startsWith('<!--', start)) {
      const commentEnd = source.indexOf('-->', start + 4)
      const next = commentEnd === -1 ? source.length : commentEnd + 3
      migrated += source.slice(start, next)
      cursor = next
      continue
    }
    const nameMatch = source.slice(start + 1).match(/^([A-Za-z][\w.-]*)/)
    if (!nameMatch) {
      migrated += '<'
      cursor = start + 1
      continue
    }
    let end = start + 1 + nameMatch[1].length
    let quote
    for (; end < source.length; end += 1) {
      const character = source[end]
      if (quote) {
        if (character === quote && source[end - 1] !== '\\') quote = undefined
      } else if (character === '"' || character === "'") {
        quote = character
      } else if (character === '>') {
        break
      }
    }
    if (end === source.length) return migrated + source.slice(start)
    const tag = source.slice(start, end + 1)
    const component = aliases.get(nameMatch[1])
    if (!component) {
      migrated += tag
      cursor = end + 1
      continue
    }
    migrated += renameAttributes(tag, PROP_RENAMES[component])
    cursor = end + 1
  }
  return migrated
}

export function migrateDestinations(source) {
  const aliases = componentAliases(source)
  const templateStart = source.indexOf('<template')
  const templateEnd = source.lastIndexOf('</template>')
  if (templateStart === -1 || templateEnd < templateStart)
    return migrateMarkup(source, aliases)
  const end = templateEnd + '</template>'.length
  return (
    source.slice(0, templateStart) +
    migrateMarkup(source.slice(templateStart, end), aliases) +
    source.slice(end)
  )
}

function filesIn(target, seen = new Set()) {
  const stat = fs.lstatSync(target)
  if (stat.isSymbolicLink()) return []
  if (stat.isFile()) return EXTENSIONS.has(path.extname(target)) ? [target] : []
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
  let changed = 0
  const files = [
    ...new Set(targets.flatMap((target) => filesIn(path.resolve(target)))),
  ]
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8')
    const migrated = migrateDestinations(source)
    if (migrated === source) continue
    changed += 1
    if (!dryRun) fs.writeFileSync(file, migrated)
    console.log(`${dryRun ? 'Would migrate' : 'Migrated'} ${file}`)
  }
  console.log(
    `${dryRun ? 'Would migrate' : 'Migrated'} ${changed} file${changed === 1 ? '' : 's'}.`,
  )
  return 0
}

const script = fileURLToPath(import.meta.url)
const isMain =
  process.argv[1] &&
  fs.realpathSync(process.argv[1]) === fs.realpathSync(script)
if (isMain) process.exitCode = run(process.argv.slice(2))
