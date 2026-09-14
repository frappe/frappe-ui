#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { babelParse, parse as parseSfc, walkIdentifiers } from '@vue/compiler-sfc'

const USAGE = 'Usage: navigation-v1 [--dry-run] <dir-or-file...>'
const NodeTypes = { ELEMENT: 1, INTERPOLATION: 5, ATTRIBUTE: 6, DIRECTIVE: 7 }
const COMPONENTS = new Set(['SettingsDialog', 'SidebarRailItem', 'TabButtons', 'Tabs', 'TabTrigger'])
const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

function setAlias(aliases, local, component) {
  aliases.set(local, component)
  aliases.set(kebab(local), component)
}

function componentAliases(descriptor) {
  const aliases = new Map()
  for (const name of COMPONENTS) setAlias(aliases, name, name)
  for (const block of [descriptor.script, descriptor.scriptSetup].filter(Boolean)) {
    let ast
    try {
      ast = babelParse(block.content, {
        sourceType: 'module',
        plugins: block.lang === 'ts' || block.lang === 'tsx' ? ['typescript'] : [],
      })
    } catch {
      continue
    }
    for (const statement of ast.program.body) {
      if (statement.type !== 'ImportDeclaration') continue
      const fromFrappeUi = statement.source.value === 'frappe-ui' || statement.source.value.startsWith('frappe-ui/')
      for (const specifier of statement.specifiers) {
        const local = specifier.local.name
        const imported = specifier.type === 'ImportSpecifier' ? specifier.imported.name : undefined
        if (fromFrappeUi && COMPONENTS.has(imported)) setAlias(aliases, local, imported)
        else if (COMPONENTS.has(local) || aliases.has(local)) {
          aliases.delete(local)
          aliases.delete(kebab(local))
        }
      }
    }
  }
  return aliases
}

function walk(target, visited = new Set()) {
  if (fs.lstatSync(target).isSymbolicLink()) return []
  const resolved = fs.realpathSync(target)
  if (visited.has(resolved)) return []
  visited.add(resolved)
  const stat = fs.statSync(resolved)
  if (stat.isFile()) return path.extname(resolved) === '.vue' ? [resolved] : []
  return fs.readdirSync(resolved, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === 'node_modules' || entry.name === '.git') return []
    return walk(path.join(resolved, entry.name), visited)
  })
}

function propName(prop) {
  if (prop.type === NodeTypes.ATTRIBUTE) return prop.name
  if (prop.type === NodeTypes.DIRECTIVE && prop.name === 'bind' && prop.arg?.isStatic)
    return prop.arg.content
}

const normalized = (value) => value.replaceAll('-', '').toLowerCase()
const opaqueSpread = (prop) => prop.type === NodeTypes.DIRECTIVE && prop.name === 'bind' && !prop.arg

function renameProp(prop, from, to, binding = from) {
  if (prop.type === NodeTypes.DIRECTIVE && !prop.exp) {
    return { start: prop.loc.start.offset, end: prop.loc.end.offset, text: `${prop.loc.source.replace(from, to)}="${binding}"` }
  }
  const relative = prop.loc.source.indexOf(from)
  return { start: prop.loc.start.offset + relative, end: prop.loc.start.offset + relative + from.length, text: to }
}

function migrateSettingsShortcut(prop, refusals) {
  if (prop.type === NodeTypes.ATTRIBUTE || prop.exp?.content.trim() === 'true') {
    return { start: prop.loc.start.offset, end: prop.loc.end.offset, text: '' }
  }
  if (prop.exp?.content.trim() === 'false')
    return renameProp(prop, propName(prop), 'keyboard-shortcut')
  refusals.push({
    line: prop.loc.start.line,
    message: '<SettingsDialog> dynamic shortcut needs a manual combo or false value',
  })
}

function parsePattern(content) {
  try {
    return babelParse(`(${content}) => {}`, { sourceType: 'module', plugins: ['typescript'] }).program.body[0]?.expression?.params?.[0]
  } catch {
    return undefined
  }
}

function propertyName(property) {
  if (property.type !== 'ObjectProperty' || property.computed) return undefined
  if (property.key.type === 'Identifier') return property.key.name
  if (property.key.type === 'StringLiteral') return property.key.value
}

function boundName(property) {
  return property?.type === 'ObjectProperty' && property.value.type === 'Identifier'
    ? property.value.name
    : undefined
}

function slotControl(directive, oldName, refusals) {
  const content = directive.exp?.content
  if (!content || !content.includes(oldName)) return
  const pattern = parsePattern(content)
  if (!pattern || pattern.type !== 'ObjectPattern') {
    refusals.push({ line: directive.loc.start.line, message: `cannot parse ${oldName} slot binding` })
    return
  }
  const oldProps = pattern.properties.filter((property) => propertyName(property) === oldName)
  const newProps = pattern.properties.filter((property) => propertyName(property) === 'active')
  if (
    oldProps.length !== 1 ||
    newProps.length ||
    pattern.properties.some((property) => property.type === 'RestElement' || property.computed)
  ) {
    refusals.push({ line: directive.loc.start.line, message: `${oldName} slot binding is duplicate or opaque` })
    return
  }
  const oldLocal = boundName(oldProps[0])
  if (!oldLocal) {
    refusals.push({ line: directive.loc.start.line, message: `${oldName} slot binding is not a plain identifier` })
    return
  }
  const shorthand = oldProps[0].shorthand
  const key = oldProps[0].key
  const offset = directive.exp.loc.start.offset
  return {
    oldLocal,
    newLocal: shorthand ? 'active' : oldLocal,
    edits: [{ start: offset + key.start - 1, end: offset + key.end - 1, text: 'active' }],
  }
}

function expressionEdits(expression, control) {
  if (!expression.content?.includes(control.oldLocal) || control.oldLocal === control.newLocal) return []
  let ast
  try {
    ast = babelParse(expression.content, { sourceType: 'module', plugins: ['typescript'] })
  } catch {
    return []
  }
  const edits = []
  walkIdentifiers(ast.program, (identifier) => {
    if (identifier.name === control.oldLocal)
      edits.push({
        start: expression.loc.start.offset + identifier.start,
        end: expression.loc.start.offset + identifier.end,
        text: control.newLocal,
      })
  })
  return edits
}

function shadows(element, local) {
  for (const prop of element.props || []) {
    if (prop.type !== NodeTypes.DIRECTIVE || !prop.exp) continue
    if (prop.name === 'slot') {
      const pattern = parsePattern(prop.exp.content)
      if (pattern?.type === 'ObjectPattern' && pattern.properties.some((property) => boundName(property) === local)) return true
    }
    if (prop.name === 'for' && new RegExp(`\\b${local}\\b`).test(prop.exp.content.split(/\s+(?:in|of)\s+/)[0])) return true
  }
  return false
}

function visitScope(node, control, edits, root = true) {
  if (!root && node.type === NodeTypes.ELEMENT && shadows(node, control.oldLocal)) return
  if (node.type === NodeTypes.INTERPOLATION) edits.push(...expressionEdits(node.content, control))
  if (node.type === NodeTypes.ELEMENT) {
    for (const prop of node.props) {
      if (prop.type === NodeTypes.DIRECTIVE && prop.name !== 'slot' && prop.exp)
        edits.push(...expressionEdits(prop.exp, control))
    }
  }
  for (const child of node.children || []) visitScope(child, control, edits, false)
}

export function migrateNavigation(source) {
  const parsed = parseSfc(source, { filename: 'component.vue' })
  if (parsed.errors.length)
    return { migrated: source, changes: [], refusals: [{ line: 1, message: `Vue parse error: ${String(parsed.errors[0])}` }] }
  const template = parsed.descriptor.template
  if (!template) return { migrated: source, changes: [], refusals: [] }
  const aliases = componentAliases(parsed.descriptor)
  const edits = []
  const refusals = []

  function visit(node, owner) {
    if (node.type !== NodeTypes.ELEMENT) {
      for (const child of node.children || []) visit(child, owner)
      return
    }
    const component = aliases.get(node.tag)
    const inheritedOwner = node.tagType === 1 && !component ? undefined : owner
    const nextOwner = component || inheritedOwner
    if (component === 'SettingsDialog') {
      const old = node.props.filter((prop) => normalized(propName(prop) || '') === 'shortcut')
      const current = node.props.filter((prop) => normalized(propName(prop) || '') === 'keyboardshortcut')
      if (old.length && (old.length > 1 || current.length || node.props.some(opaqueSpread)))
        refusals.push({ line: node.loc.start.line, message: '<SettingsDialog> shortcut is duplicated or hidden by v-bind' })
      else if (old[0]) {
        const edit = migrateSettingsShortcut(old[0], refusals)
        if (edit) edits.push(edit)
      }
    }
    if (component === 'SidebarRailItem') {
      const variants = node.props.filter((prop) => normalized(propName(prop) || '') === 'variant')
      if (variants.length > 1 || (variants.length && node.props.some(opaqueSpread)))
        refusals.push({ line: node.loc.start.line, message: '<SidebarRailItem> variant is duplicated or hidden by v-bind' })
      else if (variants[0]) {
        const prop = variants[0]
        const value = prop.type === NodeTypes.ATTRIBUTE ? prop.value?.content : prop.exp?.content
        if (value === 'tile') {
          const valueLoc = prop.value?.loc || prop.exp.loc
          edits.push({
            start: valueLoc.start.offset,
            end: valueLoc.end.offset,
            text: prop.value ? `${valueLoc.source[0]}subtle${valueLoc.source.at(-1)}` : 'subtle',
          })
        } else if (/^['"]tile['"]$/.test(value || '')) {
          const quote = value[0]
          edits.push({ start: prop.exp.loc.start.offset, end: prop.exp.loc.end.offset, text: `${quote}subtle${quote}` })
        }
      }
    }

    const slot = node.props.find((prop) => prop.type === NodeTypes.DIRECTIVE && prop.name === 'slot')
    const slotOwner = ['TabButtons', 'Tabs', 'TabTrigger'].includes(component) ? component : inheritedOwner
    if (slot && slotOwner) {
      const oldName = slotOwner === 'TabButtons' ? 'checked' : 'selected'
      const control = slotControl(slot, oldName, refusals)
      if (control) {
        edits.push(...control.edits)
        visitScope(node, control, edits)
        return
      }
    }
    for (const child of node.children || []) visit(child, nextOwner)
  }
  visit(template.ast)

  if (refusals.length) return { migrated: source, changes: [], refusals }
  const migrated = edits
    .sort((a, b) => b.start - a.start)
    .reduce((text, edit) => text.slice(0, edit.start) + edit.text + text.slice(edit.end), source)
  return { migrated, changes: edits, refusals }
}

function main() {
  const args = process.argv.slice(2)
  if (args.includes('--help') || args.includes('-h')) return console.log(USAGE)
  const unknown = args.filter((arg) => arg.startsWith('-') && arg !== '--dry-run')
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
    const result = migrateNavigation(source)
    if (result.refusals.length) {
      for (const refusal of result.refusals) refusals.push({ file, ...refusal })
      continue
    }
    if (!result.changes.length) continue
    changed++
    if (!dryRun) fs.writeFileSync(file, result.migrated)
    console.log(`${file} (${result.changes.length})`)
  }
  console.log(`\n${dryRun ? '[dry-run] would update' : 'Updated'} ${changed} files`)
  if (refusals.length) {
    console.error(`\nNot converted: ${refusals.length} sites need a decision; refused files were left unchanged:`)
    for (const refusal of refusals) console.error(`  ${refusal.file}:L${refusal.line} ${refusal.message}`)
    process.exit(1)
  }
}

const scriptPath = fileURLToPath(import.meta.url)
const invokedPath = process.argv[1]
if (invokedPath && fs.realpathSync(invokedPath) === fs.realpathSync(scriptPath)) main()
