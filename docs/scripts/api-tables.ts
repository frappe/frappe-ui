import ts from 'typescript'

import { normalizeUnionOrder } from './type-unions'

/**
 * Reads a generated `*.api.md` back into structured rows, and compares two of
 * them by meaning.
 *
 * `propsgen --check` uses this instead of diffing bytes. `vue-component-meta`
 * lists props, emits and union members in the order the TypeScript checker
 * happened to resolve them, and that order shifts with how much of the program
 * is loaded. `source-order` puts props and union members back, but an emit
 * `defineModel()` declares can still move, so a run over one folder and a full
 * run can produce the same API in a different order. The tables are
 * documentation and are ordered for reading, so the check has to ignore order
 * and look at the rows themselves.
 */

export type ApiTableKind = 'prop' | 'slot' | 'emit'

export type ApiEntry = {
  name: string
  fields: Record<string, string>
}

export type ApiTable = {
  component: string
  kind: ApiTableKind
  entries: ApiEntry[]
}

export type ApiDifference =
  | {
      type: 'added'
      component: string
      kind: ApiTableKind
      name: string
      fields: Record<string, string>
    }
  | { type: 'removed'; component: string; kind: ApiTableKind; name: string }
  | {
      type: 'changed'
      component: string
      kind: ApiTableKind
      name: string
      field: string
      committed: string | undefined
      current: string | undefined
    }

const KIND_ORDER: ApiTableKind[] = ['prop', 'slot', 'emit']

const KIND_BY_SUFFIX: Record<string, ApiTableKind> = {
  Props: 'prop',
  Slots: 'slot',
  Emits: 'emit',
}

// Single-component folders name their arrays `propsData`; multi-component
// folders prefix them with the camel-cased component name (`tooltipBubbleProps`).
const SINGLE_COMPONENT_NAMES: Record<string, ApiTableKind> = {
  propsData: 'prop',
  slotsData: 'slot',
  emitsData: 'emit',
}

function pascalCase(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

function tableIdOf(constName: string, folder: string) {
  const single = SINGLE_COMPONENT_NAMES[constName]
  if (single) return { component: pascalCase(folder), kind: single }

  for (const [suffix, kind] of Object.entries(KIND_BY_SUFFIX)) {
    if (constName.endsWith(suffix) && constName.length > suffix.length) {
      return {
        component: pascalCase(constName.slice(0, -suffix.length)),
        kind,
      }
    }
  }

  return null
}

function readScriptBlock(source: string) {
  const match = source.match(/<script setup>([\s\S]*?)<\/script>/)
  return match ? match[1] : ''
}

// Every value the generator writes is a scalar (see `toVueExpression`). Anything
// else is printed verbatim so an unexpected shape still compares, rather than
// silently reading as identical.
function readValue(node: ts.Expression): string {
  if (ts.isStringLiteralLike(node)) return node.text
  if (node.kind === ts.SyntaxKind.TrueKeyword) return 'true'
  if (node.kind === ts.SyntaxKind.FalseKeyword) return 'false'
  if (node.kind === ts.SyntaxKind.NullKeyword) return 'null'
  if (ts.isNumericLiteral(node)) return node.text
  return node.getText()
}

function readEntry(node: ts.ObjectLiteralExpression): ApiEntry | null {
  const fields: Record<string, string> = {}

  for (const property of node.properties) {
    if (!ts.isPropertyAssignment(property)) continue
    const key = ts.isIdentifier(property.name)
      ? property.name.text
      : ts.isStringLiteralLike(property.name)
        ? property.name.text
        : null
    if (key === null) continue
    fields[key] = readValue(property.initializer)
  }

  const name = fields.name
  if (name === undefined) return null
  delete fields.name
  return { name, fields }
}

/**
 * Parses the `<script setup>` block of a generated `*.api.md` into one table per
 * component and kind. `folder` supplies the component name for single-component
 * files, whose arrays are named `propsData` rather than after the component.
 */
export function parseApiTables(source: string, folder: string): ApiTable[] {
  const script = readScriptBlock(source)
  const sourceFile = ts.createSourceFile(
    'api.ts',
    script,
    ts.ScriptTarget.Latest,
    true,
  )

  const tables: ApiTable[] = []

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue

    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name)) continue
      if (
        !declaration.initializer ||
        !ts.isArrayLiteralExpression(declaration.initializer)
      ) {
        continue
      }

      const id = tableIdOf(declaration.name.text, folder)
      if (!id) continue

      const entries = declaration.initializer.elements
        .filter(ts.isObjectLiteralExpression)
        .map((element) => readEntry(element))
        .filter((entry): entry is ApiEntry => entry !== null)

      tables.push({ ...id, entries })
    }
  }

  return tables
}

function tableKey(component: string, kind: ApiTableKind) {
  return `${component} ${kind}`
}

function indexTables(tables: ApiTable[]) {
  const byKey = new Map<string, Map<string, ApiEntry>>()
  for (const table of tables) {
    const key = tableKey(table.component, table.kind)
    const entries = byKey.get(key) ?? new Map<string, ApiEntry>()
    for (const entry of table.entries) entries.set(entry.name, entry)
    byKey.set(key, entries)
  }
  return byKey
}

// `type` is the one field whose text can differ while the meaning does not: a
// union nested inside a type is still printed in whatever order the checker
// resolved it.
function isSameField(
  field: string,
  before: string | undefined,
  after: string | undefined,
) {
  if (before === after) return true
  if (before === undefined || after === undefined) return false
  if (field !== 'type') return false
  return normalizeUnionOrder(before) === normalizeUnionOrder(after)
}

/**
 * Compares two parsed files as unordered collections keyed by entry name.
 * Row order and union member order never show up as a difference; an added,
 * removed or altered row always does.
 */
export function diffApiTables(
  committed: ApiTable[],
  current: ApiTable[],
): ApiDifference[] {
  const committedByKey = indexTables(committed)
  const currentByKey = indexTables(current)

  const components: string[] = []
  for (const table of [...current, ...committed]) {
    if (!components.includes(table.component)) components.push(table.component)
  }
  components.sort()

  const differences: ApiDifference[] = []

  for (const component of components) {
    for (const kind of KIND_ORDER) {
      const key = tableKey(component, kind)
      const committedEntries = committedByKey.get(key) ?? new Map()
      const currentEntries = currentByKey.get(key) ?? new Map()

      const names = [
        ...new Set([...currentEntries.keys(), ...committedEntries.keys()]),
      ].sort()

      for (const name of names) {
        const before = committedEntries.get(name)
        const after = currentEntries.get(name)

        if (!before && after) {
          differences.push({
            type: 'added',
            component,
            kind,
            name,
            fields: after.fields,
          })
          continue
        }
        if (before && !after) {
          differences.push({ type: 'removed', component, kind, name })
          continue
        }
        if (!before || !after) continue

        const fields = [
          ...new Set([
            ...Object.keys(before.fields),
            ...Object.keys(after.fields),
          ]),
        ].sort()

        for (const field of fields) {
          if (isSameField(field, before.fields[field], after.fields[field])) {
            continue
          }
          differences.push({
            type: 'changed',
            component,
            kind,
            name,
            field,
            committed: before.fields[field],
            current: after.fields[field],
          })
        }
      }
    }
  }

  return differences
}

function show(value: string | undefined) {
  if (value === undefined) return '(none)'
  return JSON.stringify(value)
}

function headline(difference: ApiDifference) {
  const subject = `${difference.component} ${difference.kind} \`${difference.name}\``
  if (difference.type === 'added') {
    return `${subject} is missing from the committed table`
  }
  if (difference.type === 'removed') {
    return `${subject} is in the committed table but no longer exists`
  }
  return `${subject} has a different ${difference.field}`
}

/** One line per difference, for a CI annotation. */
export function summarizeDifference(difference: ApiDifference) {
  if (difference.type !== 'changed') return headline(difference)
  return `${headline(difference)} — committed ${show(difference.committed)}, now ${show(difference.current)}`
}

/** The human-readable report, indented under the file it belongs to. */
export function formatDifferences(differences: ApiDifference[]) {
  const lines: string[] = []

  for (const difference of differences) {
    lines.push(`  ${headline(difference)}`)

    if (difference.type === 'added') {
      for (const [field, value] of Object.entries(difference.fields)) {
        lines.push(`      ${field}: ${show(value)}`)
      }
    }
    if (difference.type === 'changed') {
      lines.push(`      committed: ${show(difference.committed)}`)
      lines.push(`      now:       ${show(difference.current)}`)
    }
  }

  return lines.join('\n')
}
