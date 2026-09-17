#!/usr/bin/env node
/**
 * Token drift audit for the Espresso v2 migration.
 *
 * Reads the committed tokens (tailwind/tokens/colors.json) and, when a raw
 * Figma export is present in .figma-export/, the Figma style set too. The
 * export is no longer committed, so section 3 is skipped without one.
 * Compares the resolved values of every themed token (surface/ink/outline)
 * against a baseline git ref, and against the Figma token set, then reports:
 *
 *   1. BUILD-BREAKING — a token whose color ref no longer resolves (missing shade).
 *   2. SILENT DRIFT   — token kept, but its resolved hex changed baseline -> HEAD.
 *                       Catches BOTH mapping drift (ref points elsewhere) and
 *                       primitive drift (same ref, shade hex moved, e.g. the
 *                       surface-white / gray-900 #0f0f0f -> #1f1f1f case).
 *   3. LEGACY         — token present in code but absent from the Figma export.
 *                       Deprecation candidate; we suggest a replacement by
 *                       matching resolved hex against live Figma tokens.
 *
 * Usage:  node scripts/audit-token-drift.cjs [baselineRef]
 *         baselineRef defaults to v0.1.278
 */
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const BASELINE = process.argv[2] || 'v0.1.278'
const GROUPS = ['surface', 'ink', 'outline']
const MODES = ['light', 'dark']

// colors.json moved twice: tailwind/colors.json -> tailwind/generated/ ->
// tailwind/tokens/. A baseline ref predates the current path, so try each.
const COLORS_PATHS = [
  'tailwind/tokens/colors.json',
  'tailwind/generated/colors.json',
  'tailwind/colors.json',
]

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'))
}
function loadColors() {
  for (const p of COLORS_PATHS) {
    if (fs.existsSync(path.join(ROOT, p))) return loadJSON(p)
  }
  throw new Error(`no colors.json found; looked in ${COLORS_PATHS.join(', ')}`)
}
function loadFromRef(ref, paths) {
  for (const p of paths) {
    try {
      return JSON.parse(
        execSync(`git show ${ref}:${p}`, { cwd: ROOT, stdio: ['pipe', 'pipe', 'ignore'] }).toString(),
      )
    } catch (e) {
      continue
    }
  }
  return null
}

// Resolve a color ref like "lightMode/gray/900" or "neutral/white" to a hex.
// Returns { hex } on success or { missing: ref } when the shade is absent.
function resolveRef(ref, palette) {
  if (typeof ref !== 'string') return { hex: null }
  const parts = ref.split('/')
  let node = palette
  for (const part of parts) {
    if (node && typeof node === 'object' && part in node) node = node[part]
    else return { missing: ref }
  }
  if (typeof node === 'string') return { hex: node.toLowerCase() }
  return { missing: ref }
}

// All themed tokens resolved to hex for a given colors.json object.
function resolveAll(colors) {
  const out = {}
  for (const mode of MODES) {
    for (const group of GROUPS) {
      const map = colors?.themedVariables?.[mode]?.[group] || {}
      for (const key of Object.keys(map)) {
        const id = `${mode}.${group}.${key}`
        out[id] = { ref: map[key], ...resolveRef(map[key], colors) }
      }
    }
  }
  return out
}

// Figma semantic token keys per group (union of Light + Dark styles).
// Returns null when there is no export to read: the raw export is an input,
// not a committed record, so a checkout without one is the normal case.
const FIGMA_DIR = '.figma-export'

function figmaKeySet() {
  const light = path.join(FIGMA_DIR, 'Styles.Light.tokens.json')
  const dark = path.join(FIGMA_DIR, 'Styles.Dark.tokens.json')
  const present = [light, dark].every((p) => fs.existsSync(path.join(ROOT, p)))
  if (!present) return null
  const fl = loadJSON(light)
  const fd = loadJSON(dark)
  const set = {}
  for (const g of GROUPS) {
    set[g] = new Set([...Object.keys(fl[g] || {}), ...Object.keys(fd[g] || {})])
  }
  return set
}

// Count usages of a `${prefix}-${key}` token across src/ Tailwind classes.
function usageCount(group, key) {
  const prefix = { surface: 'bg-surface', ink: 'text-ink', outline: '(border|ring|outline)-outline' }[group]
  const pattern = `\\b(${prefix})-${key}\\b`
  try {
    const out = execSync(
      `grep -rhoE '${pattern}' src 2>/dev/null | wc -l`,
      { cwd: ROOT },
    ).toString().trim()
    return parseInt(out, 10) || 0
  } catch {
    return 0
  }
}

function main() {
  const headColors = loadColors()
  const baseColors = loadFromRef(BASELINE, COLORS_PATHS)
  const head = resolveAll(headColors)
  const base = baseColors ? resolveAll(baseColors) : null
  const figma = figmaKeySet()

  const broken = []
  const drift = []
  const legacy = []

  // Build a hex -> figma token index for replacement suggestions.
  const hexToFigma = {}
  for (const id of Object.keys(head)) {
    const [, group, key] = id.split('.')
    if (figma && figma[group].has(key) && head[id].hex) {
      ;(hexToFigma[head[id].hex] ||= new Set()).add(`${group}.${key}`)
    }
  }

  for (const id of Object.keys(head)) {
    const [, group, key] = id.split('.')
    const h = head[id]

    if (h.missing) broken.push({ id, ref: h.missing })

    if (base && base[id] && base[id].hex && h.hex && base[id].hex !== h.hex) {
      const sameRef = base[id].ref === h.ref
      drift.push({
        id,
        from: base[id].hex,
        to: h.hex,
        kind: sameRef ? 'primitive' : 'mapping',
        refFrom: base[id].ref,
        refTo: h.ref,
      })
    }

    if (figma && !figma[group].has(key)) {
      const suggestions = [...(hexToFigma[h.hex] || [])].filter((s) => s !== `${group}.${key}`)
      legacy.push({ id, group, key, hex: h.hex, uses: usageCount(group, key), suggestions })
    }
  }

  const seenLegacy = new Set()
  const dedupLegacy = legacy.filter((l) => {
    const k = `${l.group}.${l.key}`
    if (seenLegacy.has(k)) return false
    seenLegacy.add(k)
    return true
  })

  console.log(`# Token Drift Audit — baseline ${BASELINE} -> HEAD\n`)

  console.log(`## 1. Build-breaking (ref no longer resolves) — ${broken.length}\n`)
  if (!broken.length) console.log('_none_\n')
  for (const b of broken) console.log(`- \`${b.id}\` → missing shade \`${b.ref}\``)

  console.log(`\n## 2. Silent drift (resolved hex changed) — ${drift.length}\n`)
  if (!base) console.log(`_baseline ${BASELINE} not available_\n`)
  else if (!drift.length) console.log('_none_\n')
  else {
    console.log('| token | kind | from | to | ref change |')
    console.log('| --- | --- | --- | --- | --- |')
    for (const d of drift) {
      const refCol = d.kind === 'mapping' ? `${d.refFrom} → ${d.refTo}` : d.refTo
      console.log(`| \`${d.id}\` | ${d.kind} | ${d.from} | ${d.to} | ${refCol} |`)
    }
  }

  if (!figma) {
    console.log(
      `\n## 3. Legacy tokens (in code, absent from Figma) — skipped\n\n` +
        `_no Figma style export in \`${FIGMA_DIR}/\` (needs both ` +
        `Styles.Light.tokens.json and Styles.Dark.tokens.json); drop one there and re-run_`,
    )
    return
  }

  console.log(`\n## 3. Legacy tokens (in code, absent from Figma) — ${dedupLegacy.length}\n`)
  console.log('| token | hex | uses in src | suggested replacement (same hex) |')
  console.log('| --- | --- | --- | --- |')
  for (const l of dedupLegacy.sort((a, b) => b.uses - a.uses)) {
    console.log(
      `| \`${l.group}.${l.key}\` | ${l.hex || '?'} | ${l.uses} | ${l.suggestions.join(', ') || '—'} |`,
    )
  }
}

main()
