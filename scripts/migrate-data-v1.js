#!/usr/bin/env node
/**
 * Data v1 migration codemod.
 *
 * The FrappeUI plugin's `resources` option is a boolean in v1. The object
 * form was never read — the plugin only checked whether the value was set —
 * so every object value becomes `true`:
 *
 *   app.use(FrappeUI, { resources: { todos } })  ->  app.use(FrappeUI, { resources: true })
 *
 * A value the codemod cannot read (a variable, a call, a spread) is reported
 * and the file is left unchanged.
 *
 * Usage: data-v1 [--dry-run] <dir-or-file...>
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { parse as parseSfc } from '@vue/compiler-sfc'

const USAGE = `Usage: data-v1 [--dry-run] <dir-or-file...>

Narrows the FrappeUI plugin's resources option to a boolean:
  app.use(FrappeUI, { resources: { … } }) -> app.use(FrappeUI, { resources: true })`

const SCRIPT_EXTENSIONS = new Set([
  '.js',
  '.mjs',
  '.cjs',
  '.jsx',
  '.ts',
  '.mts',
  '.cts',
  '.tsx',
])
const EXTENSIONS = new Set([...SCRIPT_EXTENSIONS, '.vue'])
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'coverage'])

function walk(target, visited = new Set()) {
  if (fs.lstatSync(target).isSymbolicLink()) return []
  const resolved = fs.realpathSync(target)
  if (visited.has(resolved)) return []
  visited.add(resolved)
  if (fs.statSync(resolved).isFile()) {
    return EXTENSIONS.has(path.extname(target)) ? [target] : []
  }
  return fs.readdirSync(resolved, { withFileTypes: true }).flatMap((entry) => {
    if (SKIP_DIRS.has(entry.name)) return []
    return walk(path.join(target, entry.name), visited)
  })
}

function lineAt(source, offset) {
  return source.slice(0, offset).split('\n').length
}

function scriptKindFor(filename) {
  const extension = path.extname(filename)
  if (extension === '.tsx' || extension === '.jsx') return ts.ScriptKind.TSX
  return ts.ScriptKind.TS
}

/**
 * Names the frappe-ui plugin is bound to in this chunk.
 *
 * `FrappeUI` is a named export, so `import { FrappeUI }` and
 * `import { FrappeUI as Plugin }` are the two direct forms. A namespace
 * import is matched through its `.FrappeUI` property access instead.
 */
function pluginBindings(sourceFile) {
  const direct = new Set()
  const namespaces = new Set()
  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement)) continue
    if (!ts.isStringLiteral(statement.moduleSpecifier)) continue
    if (statement.moduleSpecifier.text !== 'frappe-ui') continue
    const bindings = statement.importClause?.namedBindings
    if (!bindings) continue
    if (ts.isNamespaceImport(bindings)) {
      namespaces.add(bindings.name.text)
      continue
    }
    for (const element of bindings.elements) {
      const imported = element.propertyName?.text ?? element.name.text
      if (imported === 'FrappeUI') direct.add(element.name.text)
    }
  }
  return { direct, namespaces }
}

/** Names a node declares in its own scope. Parameters included. */
function declaredNames(node) {
  const names = new Set()
  const addBindingName = (name) => {
    if (ts.isIdentifier(name)) {
      names.add(name.text)
      return
    }
    for (const element of name.elements ?? []) {
      if (ts.isOmittedExpression(element)) continue
      addBindingName(element.name)
    }
  }

  const addStatement = (statement) => {
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        addBindingName(declaration.name)
      }
    } else if (
      (ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement)) &&
      statement.name
    ) {
      names.add(statement.name.text)
    }
  }

  for (const parameter of node.parameters ?? []) addBindingName(parameter.name)
  const body = ts.isSourceFile(node) ? node : node.body
  if (body && 'statements' in body) {
    for (const statement of body.statements) addStatement(statement)
  }
  if (ts.isForStatement(node) && node.initializer) {
    if (ts.isVariableDeclarationList(node.initializer)) {
      for (const declaration of node.initializer.declarations) {
        addBindingName(declaration.name)
      }
    }
  }
  return names
}

function opensScope(node) {
  return (
    ts.isSourceFile(node) ||
    ts.isFunctionDeclaration(node) ||
    ts.isFunctionExpression(node) ||
    ts.isArrowFunction(node) ||
    ts.isMethodDeclaration(node) ||
    ts.isConstructorDeclaration(node) ||
    ts.isGetAccessorDeclaration(node) ||
    ts.isSetAccessorDeclaration(node) ||
    ts.isBlock(node) ||
    ts.isForStatement(node) ||
    ts.isForOfStatement(node) ||
    ts.isForInStatement(node) ||
    ts.isCatchClause(node)
  )
}

function propertyName(property) {
  const name = property.name
  if (!name) return undefined
  if (ts.isIdentifier(name)) return name.text
  if (ts.isStringLiteral(name)) return name.text
  return undefined
}

/**
 * Rewrites one script chunk. `offset` maps chunk positions back onto the
 * original file so refusal line numbers and edits line up in `.vue` files.
 */
function migrateChunk(text, offset, filename, source) {
  const sourceFile = ts.createSourceFile(
    filename,
    text,
    ts.ScriptTarget.Latest,
    true,
    scriptKindFor(filename),
  )
  const { direct, namespaces } = pluginBindings(sourceFile)
  if (!direct.size && !namespaces.size) return { edits: [], refusals: [] }

  const edits = []
  const refusals = []
  const refuse = (node, message) => {
    refusals.push({ line: lineAt(source, offset + node.getStart(sourceFile)), message })
  }

  /** True when `name` resolves to something other than the frappe-ui import. */
  const isShadowed = (name, scopes) => {
    for (let index = scopes.length - 1; index > 0; index--) {
      if (scopes[index].has(name)) return true
    }
    return false
  }

  const isPluginArgument = (argument, scopes) => {
    if (ts.isIdentifier(argument)) {
      return direct.has(argument.text) && !isShadowed(argument.text, scopes)
    }
    if (
      ts.isPropertyAccessExpression(argument) &&
      ts.isIdentifier(argument.expression) &&
      argument.name.text === 'FrappeUI'
    ) {
      return (
        namespaces.has(argument.expression.text) &&
        !isShadowed(argument.expression.text, scopes)
      )
    }
    return false
  }

  const visitCall = (node, scopes) => {
    if (!ts.isPropertyAccessExpression(node.expression)) return
    if (node.expression.name.text !== 'use') return
    const [plugin, options] = node.arguments
    if (!plugin || !isPluginArgument(plugin, scopes)) return
    if (!options) return

    if (!ts.isObjectLiteralExpression(options)) {
      refuse(
        options,
        'app.use(FrappeUI, …) receives options this codemod cannot read. Set `resources` to true or false by hand if the value is an object.',
      )
      return
    }

    for (const property of options.properties) {
      if (ts.isSpreadAssignment(property)) {
        refuse(
          property,
          'the FrappeUI options object spreads another value that may carry `resources`. Narrow it to a boolean by hand.',
        )
        continue
      }
      if (
        ts.isPropertyAssignment(property) &&
        property.name &&
        ts.isComputedPropertyName(property.name)
      ) {
        refuse(
          property,
          'the FrappeUI options object uses a computed key that may be `resources`. Narrow it to a boolean by hand.',
        )
        continue
      }
      if (propertyName(property) !== 'resources') continue

      if (ts.isShorthandPropertyAssignment(property)) {
        refuse(
          property,
          '`resources` is bound to a variable. Pass true or false instead.',
        )
        continue
      }
      if (!ts.isPropertyAssignment(property)) continue

      const value = property.initializer
      if (
        value.kind === ts.SyntaxKind.TrueKeyword ||
        value.kind === ts.SyntaxKind.FalseKeyword
      ) {
        continue
      }
      if (!ts.isObjectLiteralExpression(value)) {
        refuse(
          value,
          '`resources` is set to a value this codemod cannot read. Pass true or false instead.',
        )
        continue
      }
      edits.push({
        start: offset + value.getStart(sourceFile),
        end: offset + value.getEnd(),
        text: 'true',
      })
    }
  }

  const visit = (node, scopes) => {
    const nextScopes = opensScope(node)
      ? [...scopes, declaredNames(node)]
      : scopes
    if (ts.isCallExpression(node)) visitCall(node, nextScopes)
    ts.forEachChild(node, (child) => visit(child, nextScopes))
  }

  visit(sourceFile, [declaredNames(sourceFile)])
  return { edits, refusals }
}

export function migrateData(source, filename = 'source.ts') {
  const chunks = []
  if (path.extname(filename) === '.vue') {
    const parsed = parseSfc(source, { filename })
    if (parsed.errors.length) {
      return {
        migrated: source,
        changes: [],
        refusals: [
          {
            line: 1,
            message: `could not be parsed as a Vue single-file component (${parsed.errors[0].message}). This file is unchanged.`,
          },
        ],
      }
    }
    const { script, scriptSetup } = parsed.descriptor
    for (const block of [script, scriptSetup]) {
      if (!block) continue
      const lang = block.lang === 'tsx' || block.lang === 'jsx' ? 'tsx' : 'ts'
      chunks.push({
        text: block.content,
        offset: block.loc.start.offset,
        name: `${filename}.${lang}`,
      })
    }
  } else {
    chunks.push({ text: source, offset: 0, name: filename })
  }

  const edits = []
  const refusals = []
  for (const chunk of chunks) {
    const result = migrateChunk(chunk.text, chunk.offset, chunk.name, source)
    edits.push(...result.edits)
    refusals.push(...result.refusals)
  }

  if (refusals.length) return { migrated: source, changes: [], refusals }
  const migrated = [...edits]
    .sort((a, b) => b.start - a.start)
    .reduce(
      (text, edit) => text.slice(0, edit.start) + edit.text + text.slice(edit.end),
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
    const result = migrateData(source, file)
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
    console.error(
      `\nNot converted — ${refusals.length} sites need a decision; affected files were left unchanged:`,
    )
    for (const refusal of refusals)
      console.error(`  ${refusal.file}:L${refusal.line} ${refusal.message}`)
    process.exit(1)
  }
}

const scriptPath = fileURLToPath(import.meta.url)
const invokedPath = process.argv[1]
if (invokedPath && fs.realpathSync(invokedPath) === fs.realpathSync(scriptPath))
  main()
