#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse as parseSfc } from '@vue/compiler-sfc'

const NodeTypes = {
  ELEMENT: 1,
  SIMPLE_EXPRESSION: 4,
  ATTRIBUTE: 6,
  DIRECTIVE: 7,
}

const USAGE = `Usage: base-props-v1 [--dry-run] <dir-or-file...>

Renames the v1 base-component props on statically named Vue component tags:
  Icon name -> icon
  Divider position -> align
  Progress intervals + intervalCount -> numeric intervals`

const COMPONENTS = new Set(['Icon', 'Divider', 'Progress'])

function walk(target, visited = new Set()) {
  if (fs.lstatSync(target).isSymbolicLink()) return []
  const resolved = fs.realpathSync(target)
  if (visited.has(resolved)) return []
  visited.add(resolved)
  const stat = fs.statSync(resolved)
  if (stat.isFile()) return path.extname(target) === '.vue' ? [target] : []
  return fs.readdirSync(resolved, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === 'node_modules' || entry.name === '.git') return []
    return walk(path.join(resolved, entry.name), visited)
  })
}

function kebabCase(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function setAlias(aliases, binding, component) {
  aliases.set(binding, component)
  aliases.set(kebabCase(binding), component)
}

function importedComponentAliases(source) {
  const aliases = new Map()
  for (const name of COMPONENTS) setAlias(aliases, name, name)
  const importPattern = /import\s*\{([\s\S]*?)\}\s*from\s*['"]([^'"]+)['"]/g
  for (const match of source.matchAll(importPattern)) {
    for (const part of match[1].split(',')) {
      const binding = part
        .trim()
        .match(/^(Icon|Divider|Progress)(?:\s+as\s+([A-Za-z_$][\w$]*))?$/)
      if (!binding) continue
      const name = binding[2] || binding[1]
      if (match[2] === 'frappe-ui') setAlias(aliases, name, binding[1])
      else {
        aliases.delete(name)
        aliases.delete(kebabCase(name))
      }
    }
  }
  for (const match of source.matchAll(
    /import\s+([A-Za-z_$][\w$]*)\s+from\s*['"]([^'"]+)['"]/g,
  )) {
    const [, binding, specifier] = match
    const component = [...COMPONENTS].find((name) =>
      specifier.endsWith(`/${name}/${name}.vue`),
    )
    if (component) setAlias(aliases, binding, component)
    else {
      aliases.delete(binding)
      aliases.delete(kebabCase(binding))
    }
  }
  return aliases
}

function propName(prop) {
  if (prop.type === NodeTypes.ATTRIBUTE) return prop.name
  if (
    prop.type === NodeTypes.DIRECTIVE &&
    prop.name === 'bind' &&
    prop.arg?.type === NodeTypes.SIMPLE_EXPRESSION &&
    prop.arg.isStatic
  ) {
    return prop.arg.content
  }
}

function renamePropEdit(prop, from, to, offset) {
  const relative = prop.loc.source.indexOf(from)
  return {
    start: offset + prop.loc.start.offset + relative,
    end: offset + prop.loc.start.offset + relative + from.length,
    text: to,
    description: `${from} -> ${to}`,
  }
}

function boundExpression(prop) {
  if (prop?.type !== NodeTypes.DIRECTIVE || prop.name !== 'bind')
    return undefined
  const match = prop.loc.source.match(/^(?::|v-bind:)[^=]+=(['"])([\s\S]*)\1$/)
  return match?.[2]
}

function countExpression(prop) {
  if (prop.type === NodeTypes.ATTRIBUTE) return prop.value?.content
  return boundExpression(prop)
}

function looksNumericExpression(expression) {
  return (
    /^\d+(?:\.\d+)?$/.test(expression) ||
    /(?:^|\.)(?:length|size)$/.test(expression) ||
    /^(?:Number|parseInt|parseFloat)\s*\(/.test(expression) ||
    /[+*/%]|\?[^:]+:\s*(?:undefined|\d)/.test(expression)
  )
}

function progressEdit(element, offset, refusals) {
  const intervals = element.props.find((prop) => propName(prop) === 'intervals')
  const count = element.props.find((prop) =>
    ['intervalCount', 'interval-count'].includes(propName(prop)),
  )
  if (!count && !intervals) return []

  if (count && !intervals) {
    refusals.push({
      line: count.loc.start.line,
      message:
        'Progress has intervalCount without intervals; choose continuous or interval mode',
    })
    return []
  }

  const condition = boundExpression(intervals)
  const shorthandBinding =
    intervals.type === NodeTypes.DIRECTIVE && condition === undefined
  // A dynamic `:intervals` without `intervalCount` may already be the v1
  // numeric API. Leaving it alone makes repeat runs idempotent.
  if (!count && shorthandBinding) {
    refusals.push({
      line: intervals.loc.start.line,
      message:
        'Progress shorthand :intervals may still be the v0 boolean mode; replace it with a segment count',
    })
    return []
  }
  if (!count && condition !== 'true' && condition !== 'false') {
    if (!looksNumericExpression(condition)) {
      refusals.push({
        line: intervals.loc.start.line,
        message: `Progress :intervals="${condition}" may still be the v0 boolean mode; replace it with a segment count`,
      })
    }
    return []
  }

  let replacement
  if (condition === 'false') {
    replacement = ''
  } else {
    const countValue = count ? countExpression(count) : '6'
    if (!countValue) {
      refusals.push({
        line: count.loc.start.line,
        message: 'Progress intervalCount has no static value to migrate',
      })
      return []
    }
    if (condition && condition !== 'true') {
      replacement = `:intervals="(${condition}) ? (${countValue}) : undefined"`
    } else {
      replacement = `:intervals="${countValue}"`
    }
  }

  const edits = [
    {
      start: offset + intervals.loc.start.offset,
      end: offset + intervals.loc.end.offset,
      text: replacement,
      description: 'Progress intervals + intervalCount -> numeric intervals',
    },
  ]
  if (count) {
    let countStart = count.loc.start.offset
    let countEnd = count.loc.end.offset
    if (countStart > intervals.loc.end.offset) {
      while (
        countStart > intervals.loc.end.offset &&
        /\s/.test(
          element.loc.source[countStart - element.loc.start.offset - 1] || '',
        )
      )
        countStart--
    } else {
      while (
        countEnd < intervals.loc.start.offset &&
        /\s/.test(element.loc.source[countEnd - element.loc.start.offset] || '')
      )
        countEnd++
    }
    edits.push({
      start: offset + countStart,
      end: offset + countEnd,
      text: '',
      description: 'remove Progress intervalCount',
    })
  }
  return edits
}

export function migrateBaseProps(source) {
  const parsed = parseSfc(source, { filename: 'component.vue' })
  if (parsed.errors.length) {
    return {
      migrated: source,
      changes: [],
      refusals: [
        { line: 1, message: `Vue parse error: ${String(parsed.errors[0])}` },
      ],
    }
  }
  const block = parsed.descriptor.template
  if (!block) return { migrated: source, changes: [], refusals: [] }

  const aliases = importedComponentAliases(source)
  const ast = block.ast
  const edits = []
  const refusals = []

  function visit(node) {
    if (node.type === NodeTypes.ELEMENT) {
      const component = aliases.get(node.tag)
      if (component === 'Icon') {
        for (const prop of node.props) {
          if (propName(prop) === 'name')
            edits.push(renamePropEdit(prop, 'name', 'icon', 0))
        }
      } else if (component === 'Divider') {
        for (const prop of node.props) {
          if (propName(prop) === 'position')
            edits.push(renamePropEdit(prop, 'position', 'align', 0))
        }
      } else if (component === 'Progress') {
        edits.push(...progressEdit(node, 0, refusals))
      }
    }
    for (const child of node.children || []) visit(child)
  }
  visit(ast)

  if (refusals.length) return { migrated: source, changes: [], refusals }
  const migrated = [...edits]
    .sort((a, b) => b.start - a.start)
    .reduce(
      (text, edit) =>
        text.slice(0, edit.start) + edit.text + text.slice(edit.end),
      source,
    )
  return { migrated, changes: edits, refusals }
}

function main() {
  const args = process.argv.slice(2)
  if (args.includes('--help') || args.includes('-h')) {
    console.log(USAGE)
    return
  }
  const unknown = args.filter(
    (arg) => arg.startsWith('-') && arg !== '--dry-run',
  )
  const targets = args.filter((arg) => !arg.startsWith('-'))
  if (unknown.length || !targets.length) {
    if (unknown.length) console.error(`Unknown option: ${unknown.join(' ')}`)
    console.error(USAGE)
    process.exit(1)
  }

  for (const target of targets) {
    if (!fs.existsSync(target)) {
      console.error(`Invalid path: ${target}`)
      process.exit(1)
    }
  }

  const dryRun = args.includes('--dry-run')
  const files = [...new Set(targets.flatMap((target) => walk(target)))]
  let changed = 0
  const refusals = []
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8')
    const result = migrateBaseProps(source)
    if (result.refusals.length) {
      for (const refusal of result.refusals) refusals.push({ file, ...refusal })
      continue
    }
    if (!result.changes.length) continue
    changed++
    if (!dryRun) fs.writeFileSync(file, result.migrated)
    console.log(`${file} (${result.changes.length})`)
  }
  console.log(
    `\n${dryRun ? '[dry-run] would update' : 'Updated'} ${changed} files`,
  )
  if (refusals.length) {
    console.error(`\nNot converted — ${refusals.length} sites need a decision:`)
    for (const refusal of refusals)
      console.error(`  ${refusal.file}:L${refusal.line} ${refusal.message}`)
    process.exit(1)
  }
}

const scriptPath = fileURLToPath(import.meta.url)
const invokedPath = process.argv[1]
if (invokedPath && fs.realpathSync(invokedPath) === fs.realpathSync(scriptPath))
  main()
