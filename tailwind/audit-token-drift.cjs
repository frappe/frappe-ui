#!/usr/bin/env node
/**
 * Token drift audit for the Espresso v2 migration.
 *
 * Source of truth = the Figma export under espresso-v2-design-tokens/.
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
 * Usage:  node tailwind/audit-token-drift.js [baselineRef]
 *         baselineRef defaults to v0.1.278
 */
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const BASELINE = process.argv[2] || 'v0.1.278'
const GROUPS = ['surface', 'ink', 'outline']
const MODES = ['light', 'dark']

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'))
}
function loadFromRef(ref, p) {
  try {
    return JSON.parse(execSync(`git show ${ref}:${p}`, { cwd: ROOT }).toString())
  } catch (e) {
    return null
  }
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
function figmaKeySet() {
  const fl = loadJSON('espresso-v2-design-tokens/Styles.Light.tokens.json')
  const fd = loadJSON('espresso-v2-design-tokens/Styles.Dark.tokens.json')
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
  const headColors = loadJSON('tailwind/colors.json')
  const baseColors = loadFromRef(BASELINE, 'tailwind/colors.json')
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
    if (figma[group].has(key) && head[id].hex) {
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

    if (!figma[group].has(key)) {
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
