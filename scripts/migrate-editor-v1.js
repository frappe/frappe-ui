#!/usr/bin/env node
/**
 * Editor v1 migration codemod.
 *
 * Renames the public EditorFixedMenu `buttonSize` prop to `size` in Vue
 * templates. Suggestion `component` keys deliberately stay manual because the
 * replacement is `nodeView` or `listComponent` depending on the config shape.
 *
 * Usage: editor-v1 [--dry-run] <dir-or-file...>
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const USAGE = 'Usage: editor-v1 [--dry-run] <dir-or-file...>'
const OPTIONS = new Set(['--dry-run', '--help', '-h'])
const VUE_EXTENSIONS = new Set(['.vue'])
const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'cache',
  'coverage',
])

function kebabCase(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function editorFixedMenuBindings(source) {
  const bindings = new Set()
  const importPattern =
    /import\s*\{([^}]*)\}\s*from\s*['"]frappe-ui\/editor['"]/g
  for (const match of source.matchAll(importPattern)) {
    for (const specifier of match[1].split(',')) {
      const parts = specifier
        .trim()
        .match(/^EditorFixedMenu(?:\s+as\s+([A-Za-z_$][\w$]*))?$/)
      if (parts) bindings.add(parts[1] || 'EditorFixedMenu')
    }
  }
  return bindings
}

function lineAt(source, offset) {
  return source.slice(0, offset).split('\n').length
}

function tagEnd(source, start) {
  let quote
  for (let index = start; index < source.length; index++) {
    const char = source[index]
    if (quote) {
      if (char === quote) quote = undefined
    } else if (char === '"' || char === "'") {
      quote = char
    } else if (char === '>') {
      return index + 1
    }
  }
  return source.length
}

function expressionEnd(source, start) {
  let quote
  let escaped = false
  for (let index = start; index < source.length - 1; index++) {
    const char = source[index]
    if (quote) {
      if (escaped) escaped = false
      else if (char === '\\') escaped = true
      else if (char === quote) quote = undefined
    } else if (char === '"' || char === "'" || char === '`') {
      quote = char
    } else if (char === '}' && source[index + 1] === '}') {
      return index + 2
    }
  }
  return source.length
}

function templateContentRange(source) {
  let index = 0
  while (index < source.length) {
    const start = source.indexOf('<', index)
    if (start === -1) return
    if (source.startsWith('<!--', start)) {
      const end = source.indexOf('-->', start + 4)
      index = end === -1 ? source.length : end + 3
      continue
    }

    const opening = source.slice(start).match(/^<([A-Za-z][\w.-]*)\b/)
    if (!opening) {
      index = start + 1
      continue
    }
    const name = opening[1]
    const contentStart = tagEnd(source, start)
    if (name !== 'template') {
      const closing = new RegExp(`</${name}\\s*>`, 'i').exec(
        source.slice(contentStart),
      )
      index = closing
        ? contentStart + closing.index + closing[0].length
        : contentStart
      continue
    }

    let depth = 1
    index = contentStart
    while (index < source.length) {
      if (source.startsWith('<!--', index)) {
        const end = source.indexOf('-->', index + 4)
        index = end === -1 ? source.length : end + 3
        continue
      }
      if (source.startsWith('{{', index)) {
        index = expressionEnd(source, index + 2)
        continue
      }
      if (source[index] !== '<') {
        index++
        continue
      }
      const tag = source.slice(index).match(/^<(\/?)template\b/i)
      if (!tag) {
        index++
        continue
      }
      const end = tagEnd(source, index)
      if (tag[1]) depth--
      else if (!/\/\s*>$/.test(source.slice(index, end))) depth++
      if (depth === 0) return { start: contentStart, end: index }
      index = end
    }
    return { start: contentStart, end: source.length }
  }
}

function attributesIn(tag, tagNameLength) {
  const attributes = []
  let index = 1 + tagNameLength
  while (index < tag.length - 1) {
    while (/\s/.test(tag[index])) index++
    if (tag[index] === '/' || tag[index] === '>' || index >= tag.length - 1)
      break

    const start = index
    while (index < tag.length && !/[\s=/>]/.test(tag[index])) index++
    const nameEnd = index
    while (/\s/.test(tag[index])) index++

    let value
    if (tag[index] === '=') {
      index++
      while (/\s/.test(tag[index])) index++
      const quote = tag[index]
      if (quote === '"' || quote === "'") {
        const valueStart = ++index
        while (index < tag.length && tag[index] !== quote) index++
        value = tag.slice(valueStart, index)
        if (index < tag.length) index++
      } else {
        const valueStart = index
        while (index < tag.length && !/[\s>]/.test(tag[index])) index++
        value = tag.slice(valueStart, index)
      }
    }
    attributes.push({ start, nameEnd, name: tag.slice(start, nameEnd), value })
  }
  return attributes
}

function rewriteTag(tag, tagName, filename, offset, source) {
  const edits = []
  const refusals = []
  for (const attribute of attributesIn(tag, tagName.length)) {
    if (
      attribute.name === 'v-bind' &&
      attribute.value &&
      /\bbuttonSize\b|['"]button-size['"]\s*:/.test(attribute.value)
    ) {
      refusals.push({
        file: filename,
        line: lineAt(source, offset + attribute.start),
        message:
          'EditorFixedMenu uses an object v-bind containing `buttonSize`; rename that JavaScript property to `size` manually. This file is unchanged.',
      })
      continue
    }

    const match = attribute.name.match(
      /^((?:v-bind:|:)?)(button-size|buttonSize)$/,
    )
    if (!match) continue
    const [, prefix] = match
    const replacement =
      prefix && attribute.value === undefined
        ? `${prefix}size="buttonSize"`
        : `${prefix}size`
    edits.push({ start: attribute.start, end: attribute.nameEnd, replacement })
  }

  if (refusals.length) return { tag, refusals }
  for (const edit of edits.reverse()) {
    tag = tag.slice(0, edit.start) + edit.replacement + tag.slice(edit.end)
  }
  return { tag, refusals }
}

export function migrateEditor(source, filename = '<source>') {
  const bindings = editorFixedMenuBindings(source)
  if (!bindings.size) return { migrated: source, changed: false, refusals: [] }

  const tagNames = new Set()
  for (const binding of bindings) {
    tagNames.add(binding)
    tagNames.add(kebabCase(binding))
  }

  const edits = []
  const refusals = []
  const template = templateContentRange(source)
  if (!template) return { migrated: source, changed: false, refusals: [] }

  let index = template.start
  while (index < template.end) {
    if (source.startsWith('<!--', index)) {
      const end = source.indexOf('-->', index + 4)
      index = end === -1 ? template.end : end + 3
      continue
    }
    if (source.startsWith('{{', index)) {
      index = expressionEnd(source, index + 2)
      continue
    }
    if (source[index] !== '<') {
      index++
      continue
    }
    const match = source.slice(index).match(/^<([A-Za-z][\w.-]*)\b/)
    if (!match) {
      index++
      continue
    }
    const tagName = match[1]
    const start = index
    const end = tagEnd(source, start)
    index = end
    if (!tagNames.has(tagName)) continue
    const tag = source.slice(start, end)
    const result = rewriteTag(tag, tagName, filename, start, source)
    refusals.push(...result.refusals)
    if (result.tag !== tag) edits.push({ start, end, replacement: result.tag })
  }

  if (refusals.length) return { migrated: source, changed: false, refusals }
  let migrated = source
  for (const edit of edits.reverse()) {
    migrated =
      migrated.slice(0, edit.start) +
      edit.replacement +
      migrated.slice(edit.end)
  }
  return { migrated, changed: migrated !== source, refusals }
}

function* walk(target) {
  if (fs.statSync(target).isFile()) {
    if (VUE_EXTENSIONS.has(path.extname(target))) yield target
    else console.error(`Skipped ${target}: not a Vue file`)
    return
  }
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    const full = path.join(target, entry.name)
    if (entry.isSymbolicLink()) continue
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) yield* walk(full)
    } else if (VUE_EXTENSIONS.has(path.extname(entry.name))) {
      yield full
    }
  }
}

function main(argv) {
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log(USAGE)
    return 0
  }
  const unknown = argv.filter((arg) => arg.startsWith('-') && !OPTIONS.has(arg))
  if (unknown.length) {
    console.error(`Unknown option: ${unknown.join(' ')}`)
    console.error(USAGE)
    return 1
  }

  const dryRun = argv.includes('--dry-run')
  const targets = argv.filter((arg) => !arg.startsWith('-'))
  if (!targets.length) {
    console.error(USAGE)
    return 1
  }

  const files = []
  const seen = new Set()
  for (const target of targets) {
    if (!fs.existsSync(target)) {
      console.error(`Invalid path: ${target}`)
      return 1
    }
    for (const file of walk(path.resolve(target))) {
      const resolved = fs.realpathSync(file)
      if (seen.has(resolved)) continue
      seen.add(resolved)
      files.push(file)
    }
  }

  let changed = 0
  let refused = 0
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8')
    const result = migrateEditor(source, file)
    for (const refusal of result.refusals) {
      refused++
      console.error(`${refusal.file}:${refusal.line}: ${refusal.message}`)
    }
    if (!result.changed) continue
    changed++
    if (!dryRun) fs.writeFileSync(file, result.migrated)
    console.log(`${dryRun ? 'Would update' : 'Updated'} ${file}`)
  }

  if (!changed && !refused)
    console.log('No EditorFixedMenu buttonSize props found.')
  return refused ? 1 : 0
}

const scriptPath = fileURLToPath(import.meta.url)
const invokedPath = process.argv[1]
const isCLI =
  invokedPath && fs.realpathSync(invokedPath) === fs.realpathSync(scriptPath)
if (isCLI) process.exitCode = main(process.argv.slice(2))
