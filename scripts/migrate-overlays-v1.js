#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { babelParse, parse as parseSfc, walkIdentifiers } from '@vue/compiler-sfc'

const USAGE = 'Usage: overlays-v1 [--dry-run] <dir-or-file...>'
const NodeTypes = { ELEMENT: 1, INTERPOLATION: 5, ATTRIBUTE: 6, DIRECTIVE: 7 }
const COMPONENTS = new Set([
  'Tooltip',
  'TooltipProvider',
  'HoverCard',
  'Popover',
  'Dropdown',
  'ContextMenu',
  'Select',
  'Combobox',
  'MultiSelect',
  'DatePicker',
  'DateRangePicker',
  'DateTimePicker',
  'TimePicker',
])
const CONTROL_COMPONENTS = new Set([
  'Popover',
  'DatePicker',
  'DateRangePicker',
  'DateTimePicker',
  'TimePicker',
])
const DELAY_PROPS = {
  Tooltip: new Set(['hoverdelay']),
  TooltipProvider: new Set(['hoverdelay', 'skipdelay']),
  HoverCard: new Set(['hoverdelay', 'leavedelay']),
}

const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
const normalize = (name) => name.replaceAll('-', '').toLowerCase()

function setAlias(aliases, local, component) {
  aliases.set(local, component)
  aliases.set(kebab(local), component)
}

function scriptBlocks(descriptor) {
  return [descriptor.script, descriptor.scriptSetup].filter(Boolean)
}

function componentAliases(descriptor) {
  const aliases = new Map()
  for (const name of COMPONENTS) setAlias(aliases, name, name)

  for (const block of scriptBlocks(descriptor)) {
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
      const source = statement.source.value
      const fromFrappeUi = source === 'frappe-ui' || source.startsWith('frappe-ui/')
      for (const specifier of statement.specifiers) {
        const local = specifier.local.name
        let imported
        if (specifier.type === 'ImportSpecifier') imported = specifier.imported.name
        else if (specifier.type === 'ImportDefaultSpecifier' && fromFrappeUi)
          imported = [...COMPONENTS].find((name) => source.endsWith(`/${name}`))
        if ((fromFrappeUi || imported) && COMPONENTS.has(imported)) {
          setAlias(aliases, local, imported)
        } else if (COMPONENTS.has(local) || aliases.has(local)) {
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
  if (stat.isFile())
    return ['.vue', '.js', '.jsx', '.ts', '.tsx'].includes(path.extname(resolved))
      ? [resolved]
      : []
  return fs.readdirSync(resolved, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === 'node_modules' || entry.name === '.git') return []
    return walk(path.join(resolved, entry.name), visited)
  })
}

/**
 * Render-function slot objects need a human because template slot ownership
 * is not available from the SFC template AST. Report code identifiers only;
 * strings and comments must not create migration work.
 */
export function listOverlayScriptRefusals(source, filename = 'module.ts') {
  if (
    !/\b(?:toggle|togglePopover)\b/.test(source) ||
    !new RegExp(`\\b(?:${[...CONTROL_COMPONENTS].join('|')})\\b`).test(source)
  ) {
    return []
  }
  let ast
  try {
    ast = babelParse(source, {
      sourceType: 'module',
      plugins: [
        ...(filename.endsWith('.ts') || filename.endsWith('.tsx')
          ? ['typescript']
          : []),
        ...(filename.endsWith('.jsx') || filename.endsWith('.tsx')
          ? ['jsx']
          : []),
      ],
    })
  } catch (error) {
    return [{ line: 1, message: `JavaScript parse error: ${String(error)}` }]
  }

  const identifiers = new Map()
  const collect = (node) => {
    if (!node || typeof node !== 'object') return
    if (node.type === 'Identifier' && !identifiers.has(node.name)) {
      identifiers.set(node.name, node)
    }
    for (const [key, value] of Object.entries(node)) {
      if (key === 'loc' || key === 'tokens' || key === 'comments') continue
      if (Array.isArray(value)) value.forEach(collect)
      else collect(value)
    }
  }
  collect(ast.program)
  const renderFactory =
    identifiers.has('h') ||
    identifiers.has('createVNode') ||
    identifiers.has('resolveComponent')
  if (!renderFactory) return []
  const owner = [...CONTROL_COMPONENTS].find((name) => identifiers.has(name))
  const legacy = identifiers.get('togglePopover')
  if (legacy) {
    return [{
      line: legacy.loc?.start.line ?? 1,
      message: 'render-function use of the removed Popover togglePopover API needs manual migration',
    }]
  }
  const toggle = identifiers.get('toggle')
  if (owner && toggle) {
    return [{
      line: toggle.loc?.start.line ?? 1,
      message: `render-function ${owner} slot control named toggle needs manual migration`,
    }]
  }
  return []
}

function propName(prop) {
  if (prop.type === NodeTypes.ATTRIBUTE) return prop.name
  if (prop.type === NodeTypes.DIRECTIVE && prop.name === 'bind' && prop.arg?.isStatic)
    return prop.arg.content
}

function isOpaqueSpread(prop) {
  return prop.type === NodeTypes.DIRECTIVE && prop.name === 'bind' && !prop.arg
}

function replacementEdit(prop, from, to) {
  if (prop.type === NodeTypes.DIRECTIVE && !prop.exp) {
    const binding = from.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
    return {
      start: prop.loc.start.offset,
      end: prop.loc.end.offset,
      text: `${prop.loc.source.replace(from, to)}="${binding}"`,
    }
  }
  const relative = prop.loc.source.indexOf(from)
  return {
    start: prop.loc.start.offset + relative,
    end: prop.loc.start.offset + relative + from.length,
    text: to,
  }
}

function delayValue(prop) {
  if (prop.type === NodeTypes.ATTRIBUTE) return prop.value?.content
  return prop.exp?.content
}

function delayEdit(prop, refusals) {
  const raw = delayValue(prop)?.trim()
  const value = raw && Number(raw)
  if (!raw || !/^\d+(?:\.\d+)?$/.test(raw) || !Number.isFinite(value)) {
    refusals.push({ line: prop.loc.start.line, message: `${prop.loc.source} is dynamic; convert it to milliseconds by hand` })
    return
  }
  if (value === 0 || value >= 50) return
  if (value < 0.05 || value > 10) {
    refusals.push({ line: prop.loc.start.line, message: `${prop.loc.source} has an ambiguous delay unit` })
    return
  }
  return {
    start: prop.value?.loc.start.offset ?? prop.exp.loc.start.offset,
    end: prop.value?.loc.end.offset ?? prop.exp.loc.end.offset,
    text: prop.value
      ? `${prop.value.loc.source[0]}${value * 1000}${prop.value.loc.source.at(-1)}`
      : String(value * 1000),
  }
}

function parseSlotPattern(content) {
  try {
    const ast = babelParse(`(${content}) => {}`, { sourceType: 'module', plugins: ['typescript'] })
    return ast.program.body[0]?.expression?.params?.[0]
  } catch {
    return undefined
  }
}

function staticSlotName(directive) {
  if (directive.name !== 'slot') return undefined
  if (!directive.arg) return 'default'
  return directive.arg.isStatic ? directive.arg.content : undefined
}

function objectProperty(pattern, name) {
  return pattern.properties.filter(
    (property) =>
      property.type === 'ObjectProperty' &&
      !property.computed &&
      ((property.key.type === 'Identifier' && property.key.name === name) ||
        (property.key.type === 'StringLiteral' && property.key.value === name)),
  )
}

function boundName(property) {
  if (property.value.type === 'Identifier') return property.value.name
  return undefined
}

function slotBindingEdit(directive, refusals) {
  const content = directive.exp?.content
  if (!content) return
  const pattern = parseSlotPattern(content)
  if (!pattern || pattern.type !== 'ObjectPattern') return
  const toggle = objectProperty(pattern, 'toggle')
  if (!toggle.length) return
  if (
    toggle.length !== 1 ||
    objectProperty(pattern, 'setOpen').length ||
    pattern.properties.some((property) => property.type === 'RestElement')
  ) {
    refusals.push({ line: directive.loc.start.line, message: 'slot control pattern has duplicate or opaque bindings' })
    return
  }
  const oldLocal = boundName(toggle[0])
  if (!oldLocal) {
    refusals.push({ line: directive.loc.start.line, message: 'slot toggle binding is not a plain identifier' })
    return
  }
  const open = objectProperty(pattern, 'open')
  if (open.length > 1) {
    refusals.push({ line: directive.loc.start.line, message: 'slot control pattern has duplicate open bindings' })
    return
  }
  let openLocal = open[0] && boundName(open[0])
  if (open[0] && !openLocal) {
    refusals.push({ line: directive.loc.start.line, message: 'slot open binding is not a plain identifier' })
    return
  }
  const shorthand = toggle[0].shorthand
  const newLocal = shorthand ? 'setOpen' : oldLocal
  if (!openLocal) {
    const bound = new Set(
      pattern.properties
        .filter((property) => property.type === 'ObjectProperty')
        .map(boundName)
        .filter(Boolean),
    )
    if (bound.has('open')) {
      refusals.push({ line: directive.loc.start.line, message: 'cannot add open without shadowing another slot binding' })
      return
    }
    openLocal = 'open'
  }
  const contentOffset = directive.exp.loc.start.offset
  const key = toggle[0].key
  const keyStart = contentOffset + key.start - 1
  const keyEnd = contentOffset + key.end - 1
  const edits = [{ start: keyStart, end: keyEnd, text: 'setOpen' }]
  if (!open[0]) {
    const closingWhitespace = content.match(/\s*}\s*$/)
    edits.push({
      start: contentOffset + closingWhitespace.index,
      end: contentOffset + closingWhitespace.index,
      text: ', open',
    })
  }
  return { oldLocal, newLocal, openLocal, edits }
}

function expressionEdits(expression, control, owner, slotName, refusals) {
  const content = expression.content
  if (!content || !content.includes(control.oldLocal)) return []
  const trimmed = content.trim()
  if (trimmed === control.oldLocal) {
    if (owner === 'Popover' && slotName === 'trigger') {
      refusals.push({ line: expression.loc.start.line, message: 'Popover trigger toggle handlers must be checked because the trigger toggles itself' })
      return []
    }
    return [{
      start: expression.loc.start.offset,
      end: expression.loc.end.offset,
      text: `${control.newLocal}(!${control.openLocal})`,
    }]
  }

  let ast
  try {
    ast = babelParse(content, { sourceType: 'module', plugins: ['typescript'] })
  } catch {
    refusals.push({ line: expression.loc.start.line, message: `cannot parse expression using ${control.oldLocal}` })
    return []
  }
  const edits = []
  walkIdentifiers(ast.program, (identifier, parent) => {
    if (identifier.name !== control.oldLocal) return
    if (parent?.type !== 'CallExpression' || parent.callee !== identifier) {
      refusals.push({ line: expression.loc.start.line, message: `${control.oldLocal} is passed as a value; migrate it by hand` })
      return
    }
    const args = parent.arguments
    let replacement
    if (!args.length) replacement = `${control.newLocal}(!${control.openLocal})`
    else if (args.length === 1 && args[0].type === 'BooleanLiteral')
      replacement = `${control.newLocal}(${args[0].value})`
    else {
      refusals.push({ line: expression.loc.start.line, message: `${control.oldLocal}(expression) needs a manual setter value` })
      return
    }
    edits.push({
      start: expression.loc.start.offset + parent.start,
      end: expression.loc.start.offset + parent.end,
      text: replacement,
    })
  })
  return edits
}

function shadowsControl(element, local) {
  for (const prop of element.props || []) {
    if (prop.type !== NodeTypes.DIRECTIVE || !prop.exp) continue
    if (prop.name === 'slot') {
      const pattern = parseSlotPattern(prop.exp.content)
      if (pattern?.type === 'ObjectPattern') {
        if (pattern.properties.some((property) => boundName(property) === local)) return true
      }
    }
    if (prop.name === 'for') {
      const lhs = prop.exp.content.split(/\s+(?:in|of)\s+/)[0]
      if (new RegExp(`\\b${local}\\b`).test(lhs)) return true
    }
  }
  return false
}

function visitControlledChildren(node, control, owner, slotName, edits, refusals, root = true) {
  if (!root && node.type === NodeTypes.ELEMENT && shadowsControl(node, control.oldLocal)) return
  if (node.type === NodeTypes.INTERPOLATION) {
    edits.push(...expressionEdits(node.content, control, owner, slotName, refusals))
  }
  if (node.type === NodeTypes.ELEMENT) {
    for (const prop of node.props) {
      if (prop.type === NodeTypes.DIRECTIVE && prop.name !== 'slot' && prop.exp)
        edits.push(...expressionEdits(prop.exp, control, owner, slotName, refusals))
    }
  }
  for (const child of node.children || [])
    visitControlledChildren(child, control, owner, slotName, edits, refusals, false)
}

function legacyPopoverSlot(node) {
  return node.props?.find(
    (prop) =>
      prop.type === NodeTypes.DIRECTIVE &&
      prop.name === 'slot' &&
      (!prop.arg?.isStatic || ['target', 'body', 'body-main'].includes(prop.arg.content)),
  )
}

export function migrateOverlays(source) {
  const parsed = parseSfc(source, { filename: 'component.vue' })
  if (parsed.errors.length)
    return { migrated: source, changes: [], refusals: [{ line: 1, message: `Vue parse error: ${String(parsed.errors[0])}` }] }
  const block = parsed.descriptor.template
  if (!block) return { migrated: source, changes: [], refusals: [] }
  const aliases = componentAliases(parsed.descriptor)
  const edits = []
  const refusals = []

  function visit(node, owner) {
    if (node.type !== NodeTypes.ELEMENT) {
      for (const child of node.children || []) visit(child, owner)
      return
    }
    const component = aliases.get(node.tag)
    const nextOwner = component || owner

    if (component) {
      const delayNames = DELAY_PROPS[component]
      if (delayNames) {
        const props = node.props.filter((prop) => delayNames.has(normalize(propName(prop) || '')))
        const names = props.map((prop) => normalize(propName(prop)))
        if (new Set(names).size !== names.length || (props.length && node.props.some(isOpaqueSpread))) {
          refusals.push({ line: node.loc.start.line, message: `<${component}> delay props are duplicated or hidden by v-bind` })
        } else {
          for (const prop of props) {
            const edit = delayEdit(prop, refusals)
            if (edit) edits.push(edit)
          }
        }
      }
      if (component === 'DateTimePicker') {
        const old = node.props.filter((prop) => normalize(propName(prop) || '') === 'allowcustomtime')
        const current = node.props.filter((prop) => normalize(propName(prop) || '') === 'typeable')
        if (old.length && (old.length > 1 || current.length || node.props.some(isOpaqueSpread))) {
          refusals.push({ line: node.loc.start.line, message: '<DateTimePicker> has duplicate or opaque typeable props' })
        } else if (old[0]) {
          const spelling = propName(old[0])
          edits.push(replacementEdit(old[0], spelling, spelling.includes('-') ? 'typeable' : 'typeable'))
        }
      }
    }

    const slotDirective = node.props.find(
      (prop) => prop.type === NodeTypes.DIRECTIVE && prop.name === 'slot',
    )
    const slotOwner = component && CONTROL_COMPONENTS.has(component) ? component : owner
    if (slotDirective && slotOwner === 'Popover' && legacyPopoverSlot(node)) {
      refusals.push({ line: slotDirective.loc.start.line, message: 'removed Popover slot API must be migrated from #target/#body to #trigger/#default' })
    }
    if (slotDirective && CONTROL_COMPONENTS.has(slotOwner)) {
      const control = slotBindingEdit(slotDirective, refusals)
      if (control) {
        edits.push(...control.edits)
        visitControlledChildren(node, control, slotOwner, staticSlotName(slotDirective), edits, refusals)
        return
      }
    }
    for (const child of node.children || []) visit(child, nextOwner)
  }
  visit(block.ast)

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
    const result = path.extname(file) === '.vue'
      ? migrateOverlays(source)
      : {
          migrated: source,
          changes: [],
          refusals: listOverlayScriptRefusals(source, file),
        }
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
