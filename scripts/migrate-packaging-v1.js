#!/usr/bin/env node
/**
 * Packaging v1 migration codemod.
 *
 * Two rewrites:
 *
 * 1. The Tailwind preset moves to its exported subpath. The old deep path is
 *    blocked by the package `exports` map and the shim behind it is deleted:
 *
 *      require('frappe-ui/src/utils/tailwind.config')  ->  require('frappe-ui/tailwind')
 *
 * 2. `lucideIcons` defaults to `false` on the frappe-ui Vite plugin. An app
 *    that imports `~icons/lucide/*` or writes `<LucideX />` tags has to ask
 *    for it:
 *
 *      frappeui({ frontendRoute: '/g' })
 *      ->  frappeui({ lucideIcons: true, frontendRoute: '/g' })
 *
 *    The option is added only when the run actually sees one of those two
 *    forms. Point the codemod at the project root so it can see both the Vite
 *    config and the source that uses icons; when it finds a plugin call and no
 *    icon use, it says so instead of guessing.
 *
 * A value the codemod cannot read (a variable, a spread) is reported and the
 * file is left unchanged.
 *
 * Usage: packaging-v1 [--dry-run] <dir-or-file...>
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { parse as parseSfc } from '@vue/compiler-sfc'

const USAGE = `Usage: packaging-v1 [--dry-run] <dir-or-file...>

Rewrites the Tailwind preset import:
  frappe-ui/src/utils/tailwind.config -> frappe-ui/tailwind
Adds lucideIcons: true to the frappe-ui Vite plugin when the run sees
~icons/lucide/* imports or <LucideX /> tags.`

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

/** The removed deep path, with and without its extension. */
const OLD_PRESET_PATHS = new Set([
  'frappe-ui/src/utils/tailwind.config',
  'frappe-ui/src/utils/tailwind.config.js',
])
const NEW_PRESET_PATH = 'frappe-ui/tailwind'
const VITE_PLUGIN_MODULE = 'frappe-ui/vite'

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
      (ts.isFunctionDeclaration(statement) ||
        ts.isClassDeclaration(statement)) &&
      statement.name
    ) {
      names.add(statement.name.text)
    }
  }

  for (const parameter of node.parameters ?? []) addBindingName(parameter.name)
  // `catch (error)` binds its parameter through `variableDeclaration`, not
  // `parameters`.
  if (ts.isCatchClause(node) && node.variableDeclaration) {
    addBindingName(node.variableDeclaration.name)
  }
  // A source file and a bare block hold their own statements. Everything else
  // that opens a scope keeps them under `body`, which is undefined for a
  // block, so read the node itself in those two cases.
  const body = ts.isSourceFile(node) || ts.isBlock(node) ? node : node.body
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

function isRequireCall(node) {
  return (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.text === 'require' &&
    node.arguments.length === 1 &&
    ts.isStringLiteral(node.arguments[0])
  )
}

/** Local names bound to the default export of `frappe-ui/vite`. */
function vitePluginBindings(sourceFile) {
  const names = new Set()
  for (const statement of sourceFile.statements) {
    if (
      ts.isImportDeclaration(statement) &&
      ts.isStringLiteral(statement.moduleSpecifier) &&
      statement.moduleSpecifier.text === VITE_PLUGIN_MODULE &&
      statement.importClause?.name
    ) {
      names.add(statement.importClause.name.text)
    }
    if (!ts.isVariableStatement(statement)) continue
    for (const declaration of statement.declarationList.declarations) {
      if (!declaration.initializer || !ts.isIdentifier(declaration.name)) continue
      if (!isRequireCall(declaration.initializer)) continue
      if (declaration.initializer.arguments[0].text !== VITE_PLUGIN_MODULE)
        continue
      names.add(declaration.name.text)
    }
  }
  return names
}

/**
 * Rewrites one script chunk. `offset` maps chunk positions back onto the
 * original file so refusal line numbers and edits line up in `.vue` files.
 */
function migrateChunk(text, offset, filename, source, addLucideIcons) {
  const sourceFile = ts.createSourceFile(
    filename,
    text,
    ts.ScriptTarget.Latest,
    true,
    scriptKindFor(filename),
  )

  const edits = []
  const refusals = []
  const notes = []
  const refuse = (node, message) => {
    refusals.push({
      line: lineAt(source, offset + node.getStart(sourceFile)),
      message,
    })
  }

  // --- 1. the Tailwind preset path ----------------------------------------
  const rewritePresetPath = (literal) => {
    if (!OLD_PRESET_PATHS.has(literal.text)) return
    const quote = text[literal.getStart(sourceFile)]
    edits.push({
      start: offset + literal.getStart(sourceFile),
      end: offset + literal.getEnd(),
      text: `${quote}${NEW_PRESET_PATH}${quote}`,
    })
  }

  // --- 2. lucideIcons on the Vite plugin ----------------------------------
  const pluginNames = vitePluginBindings(sourceFile)

  const isShadowed = (name, scopes) => {
    for (let index = scopes.length - 1; index > 0; index--) {
      if (scopes[index].has(name)) return true
    }
    return false
  }

  const visitPluginCall = (node, scopes) => {
    if (!ts.isIdentifier(node.expression)) return
    if (!pluginNames.has(node.expression.text)) return
    if (isShadowed(node.expression.text, scopes)) return

    const line = lineAt(source, offset + node.getStart(sourceFile))
    const [options] = node.arguments

    if (options && !ts.isObjectLiteralExpression(options)) {
      refuse(
        options,
        'the frappe-ui Vite plugin receives options this codemod cannot read. Set `lucideIcons` by hand.',
      )
      return
    }
    if (options) {
      for (const property of options.properties) {
        if (ts.isSpreadAssignment(property)) {
          refuse(
            property,
            'the frappe-ui Vite plugin options spread another value that may already set `lucideIcons`. Set it by hand.',
          )
          return
        }
        if (property.name && ts.isComputedPropertyName(property.name)) {
          refuse(
            property,
            'the frappe-ui Vite plugin options use a computed key that may be `lucideIcons`. Set it by hand.',
          )
          return
        }
        // Already answered, either way. A second run changes nothing.
        if (propertyName(property) === 'lucideIcons') return
      }
    }

    if (!addLucideIcons) {
      notes.push({
        line,
        message:
          "the frappe-ui Vite plugin is configured here. `lucideIcons` now defaults to false, and this run saw no `~icons/lucide/*` import and no `<LucideX />` tag. Add `lucideIcons: true` yourself if the app uses either form outside the paths you passed.",
      })
      return
    }

    if (!options) {
      // `frappeui()` with no options. Insert a whole object.
      const insertAt = node.getEnd() - 1
      edits.push({
        start: offset + insertAt,
        end: offset + insertAt,
        text: '{ lucideIcons: true }',
      })
      return
    }

    const openBrace = options.getStart(sourceFile)
    if (!options.properties.length) {
      edits.push({
        start: offset + openBrace + 1,
        end: offset + openBrace + 1,
        text: ' lucideIcons: true ',
      })
      return
    }
    // Reuse whatever sits between `{` and the first property (a space, or a
    // newline plus indentation) so the inserted line matches the file.
    const first = options.properties[0].getStart(sourceFile)
    const separator = text.slice(openBrace + 1, first)
    edits.push({
      start: offset + first,
      end: offset + first,
      text: `lucideIcons: true,${separator}`,
    })
  }

  const visit = (node, scopes) => {
    const nextScopes = opensScope(node)
      ? [...scopes, declaredNames(node)]
      : scopes
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier))
      rewritePresetPath(node.moduleSpecifier)
    if (
      ts.isExportDeclaration(node) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    )
      rewritePresetPath(node.moduleSpecifier)
    if (isRequireCall(node)) rewritePresetPath(node.arguments[0])
    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length === 1 &&
      ts.isStringLiteral(node.arguments[0])
    )
      rewritePresetPath(node.arguments[0])
    if (ts.isCallExpression(node)) visitPluginCall(node, nextScopes)
    ts.forEachChild(node, (child) => visit(child, nextScopes))
  }

  visit(sourceFile, [])
  return { edits, refusals, notes }
}

/**
 * True when this file shows that the app needs the lucide Vite plugin: an
 * `~icons/lucide/*` specifier anywhere, or a `<LucideName />` tag in a
 * template.
 */
export function usesLucidePlugin(source, filename = 'source.ts') {
  if (source.includes('~icons/lucide/')) return true
  if (path.extname(filename) !== '.vue') return false
  const parsed = parseSfc(source, { filename })
  if (parsed.errors.length) return false
  const template = parsed.descriptor.template?.content ?? ''
  return /<Lucide[A-Z][A-Za-z0-9]*[\s/>]/.test(template)
}

export function migratePackaging(source, filename = 'source.ts', options = {}) {
  const addLucideIcons = options.addLucideIcons ?? false
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
        notes: [],
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
  const notes = []
  for (const chunk of chunks) {
    const result = migrateChunk(
      chunk.text,
      chunk.offset,
      chunk.name,
      source,
      addLucideIcons,
    )
    edits.push(...result.edits)
    refusals.push(...result.refusals)
    notes.push(...result.notes)
  }

  if (refusals.length) return { migrated: source, changes: [], refusals, notes }
  const migrated = [...edits]
    .sort((a, b) => b.start - a.start)
    .reduce(
      (text, edit) =>
        text.slice(0, edit.start) + edit.text + text.slice(edit.end),
      source,
    )
  return { migrated, changes: edits, refusals, notes }
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
    // `walk` never follows a symlink, so a symlinked target reads nothing and
    // the run would otherwise end in a bare "Updated 0 files".
    if (fs.lstatSync(target).isSymbolicLink()) {
      console.error(
        `Skipped ${target}: it is a symlink, and this codemod does not follow symlinks. Pass the real path.`,
      )
    }
  }

  const dryRun = args.includes('--dry-run')
  const files = [...new Set(targets.flatMap((target) => walk(target)))]
  const sources = new Map(
    files.map((file) => [file, fs.readFileSync(file, 'utf8')]),
  )

  // First pass: does anything here still need the lucide Vite plugin?
  const addLucideIcons = [...sources].some(([file, source]) =>
    usesLucidePlugin(source, file),
  )

  let changed = 0
  const refusals = []
  const notes = []
  for (const [file, source] of sources) {
    const result = migratePackaging(source, file, { addLucideIcons })
    for (const note of result.notes) notes.push({ file, ...note })
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
  if (notes.length) {
    console.log(`\nCheck by hand — ${notes.length} sites:`)
    for (const note of notes)
      console.log(`  ${note.file}:L${note.line} ${note.message}`)
  }
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
