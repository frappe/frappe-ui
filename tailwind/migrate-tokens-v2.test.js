import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import {
  detectMigrationState,
  findInkShiftMarker,
  findInkShiftMarkerBelow,
  getMigrationMode,
  INK_SHIFT_MARKER,
  migrateTokens,
  writeInkShiftMarker,
} from './migrate-tokens-v2.js'

const tempDirs = []

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

describe('tokens v2 migration', () => {
  it('runs the full migration for unmigrated content', () => {
    const result = migrateTokens('<div class="bg-surface-white text-xl font-medium"></div>')

    expect(result.migrated).toBe('<div class="bg-surface-base text-2xl-medium"></div>')
  })

  it('runs typography-only correction for already migrated content', () => {
    const result = migrateTokens(
      '<div class="bg-surface-base text-lg text-xl text-2xl-medium"></div>',
      { mode: 'migrated-typography' },
    )

    expect(result.migrated).toBe(
      '<div class="bg-surface-base text-md text-lg text-xl-medium"></div>',
    )
  })

  it('leaves an old-scale size with no live v2 destination untouched and flags it (#940)', () => {
    // Old-scale `12xl` used to shift onto v2 `13xl`, dropped in #940 — must
    // not be rewritten to a class that ships no CSS.
    const result = migrateTokens('<div class="text-12xl"></div>')

    expect(result.migrated).toBe('<div class="text-12xl"></div>')
    expect(result.flagged).toEqual([{ token: 'text-12xl', line: 1 }])
  })

  it('leaves a migrated-temp-scale size with no live v2 destination untouched and flags it (#940)', () => {
    // Temp-scale `17xl` used to correct onto v2 `16xl`, dropped in #940.
    const result = migrateTokens('<div class="text-17xl"></div>', {
      mode: 'migrated-typography',
    })

    expect(result.migrated).toBe('<div class="text-17xl"></div>')
    expect(result.flagged).toEqual([{ token: 'text-17xl', line: 1 }])
  })

  it('flags text-tiny and dropped xl sizes in every mode without rewriting them (#940)', () => {
    const full = migrateTokens('<div class="text-tiny text-14xl-bold"></div>')
    expect(full.migrated).toBe('<div class="text-tiny text-14xl-bold"></div>')
    expect(full.flagged.map((f) => f.token)).toEqual(['text-tiny', 'text-14xl-bold'])

    const migrated = migrateTokens('<div class="text-tiny text-14xl-bold"></div>', {
      mode: 'migrated-typography',
    })
    expect(migrated.migrated).toBe('<div class="text-tiny text-14xl-bold"></div>')
    expect(migrated.flagged.map((f) => f.token)).toEqual(['text-tiny', 'text-14xl-bold'])
  })

  it('still corrects temp-scale text-12xl to text-11xl in migrated-typography mode, unflagged', () => {
    // `12xl` survives in v2, so this correction is unaffected by #940 — only
    // the destinations dropped in #940 (14xl-17xl) got capped.
    const result = migrateTokens('<div class="text-12xl"></div>', {
      mode: 'migrated-typography',
    })

    expect(result.migrated).toBe('<div class="text-11xl"></div>')
    expect(result.flagged).toEqual([])
  })

  it('renames radius aliases to numbered tokens (ADR-0006)', () => {
    const result = migrateTokens(
      '<div class="rounded rounded-sm rounded-md rounded-lg rounded-xl rounded-2xl"></div>',
    )

    expect(result.migrated).toBe(
      '<div class="rounded-4 rounded-1 rounded-5 rounded-6 rounded-7 rounded-8"></div>',
    )
    expect(result.flagged).toEqual([])
  })

  it('renames directional and variant-prefixed radius aliases', () => {
    const result = migrateTokens(
      '<div class="rounded-t rounded-t-lg rounded-tl-sm hover:rounded-2xl rounded-ss-md"></div>',
    )

    expect(result.migrated).toBe(
      '<div class="rounded-t-4 rounded-t-6 rounded-tl-1 hover:rounded-8 rounded-ss-5"></div>',
    )
  })

  it('keeps rounded-none, rounded-full, numbered tokens, and arbitrary radii', () => {
    const input = '<div class="rounded-none rounded-full rounded-5 rounded-[3px]"></div>'
    const result = migrateTokens(input)

    expect(result.migrated).toBe(input)
  })

  it('renames radius aliases in migrated-typography mode too', () => {
    const result = migrateTokens('<div class="rounded rounded-md text-lg"></div>', {
      mode: 'migrated-typography',
    })

    expect(result.migrated).toBe('<div class="rounded-4 rounded-5 text-md"></div>')
  })

  it('rewrites bare `rounded` in class contexts and @apply, not in prose', () => {
    const input = [
      "const cls = 'px-2 rounded border'",
      '// line-heights are rounded to px',
      'The shell (rounded/bg/shadow) is owned by the parent.',
      '.btn { @apply rounded border; }',
      'Values are rounded up, per the `rounded` utility docs.',
    ].join('\n')

    const result = migrateTokens(input)

    expect(result.migrated).toBe(
      [
        "const cls = 'px-2 rounded-4 border'",
        '// line-heights are rounded to px',
        'The shell (rounded/bg/shadow) is owned by the parent.',
        '.btn { @apply rounded-4 border; }',
        'Values are rounded up, per the `rounded-4` utility docs.',
      ].join('\n'),
    )
  })

  it('does not treat apostrophes in prose as string delimiters', () => {
    const input = [
      "// the row's corners are rounded when it's hovered",
      "const cls = 'rounded' // it's the default",
    ].join('\n')

    const result = migrateTokens(input)

    expect(result.migrated).toBe(
      [
        "// the row's corners are rounded when it's hovered",
        "const cls = 'rounded-4' // it's the default",
      ].join('\n'),
    )
  })

  it('flags text-*-black instead of renaming it (#998)', () => {
    const result = migrateTokens('<div class="text-base-black text-p-xl-black"></div>')

    expect(result.migrated).toBe('<div class="text-base-black text-p-xl-black"></div>')
    expect(result.flagged.map((f) => f.token)).toEqual([
      'text-base-black',
      'text-p-xl-black',
    ])
  })

  it('flags a size + font-extrabold/font-black pair instead of merging (#998)', () => {
    const result = migrateTokens('<div class="text-xl font-extrabold"></div>')

    // The size still shifts (xl → 2xl); the weight is not merged onto the
    // removed black style.
    expect(result.migrated).toBe('<div class="text-2xl font-extrabold"></div>')
    expect(result.merges).toEqual([])
    expect(result.flagged.map((f) => f.token)).toEqual(['text-2xl + font-extrabold'])

    const black = migrateTokens('<div class="text-sm font-black"></div>')
    expect(black.migrated).toBe('<div class="text-sm font-black"></div>')
    expect(black.flagged.map((f) => f.token)).toEqual(['text-sm + font-black'])
  })

  it('selects typography-only mode when v2 sentinels are present', () => {
    const file = writeTempFile(
      '<div class="bg-surface-base bg-surface-white text-xl"></div>',
    )
    const state = detectMigrationState([file])

    expect(state).toEqual({ pre: 1, post: 1, likelyMigrated: true })
    expect(getMigrationMode(state)).toBe('migrated-typography')
    expect(getMigrationMode(state, { force: true })).toBe('full')
    expect(getMigrationMode(state, { radiusOnly: true })).toBe('radius-only')
  })

  it('ink-shift mode shifts chromatic ink scales down one level (#1016)', () => {
    const result = migrateTokens(
      '<div class="text-ink-red-2 bg-ink-blue-5 text-ink-pink-10"></div>',
      { mode: 'ink-shift' },
    )

    expect(result.migrated).toBe(
      '<div class="text-ink-red-1 bg-ink-blue-4 text-ink-pink-9"></div>',
    )
    expect(result.flagged).toEqual([])
  })

  it('ink-shift is single-pass: ink-red-3 lands on ink-red-2, not ink-red-1', () => {
    const result = migrateTokens('<div class="text-ink-red-3 text-ink-red-2"></div>', {
      mode: 'ink-shift',
    })

    expect(result.migrated).toBe('<div class="text-ink-red-2 text-ink-red-1"></div>')
  })

  it('ink-shift maps the old -10 top step onto the new -9 end of scale', () => {
    const result = migrateTokens('var(--ink-red-10)', { mode: 'ink-shift' })

    expect(result.migrated).toBe('var(--ink-red-9)')
  })

  it('ink-shift leaves ink-gray untouched', () => {
    const input = '<div class="text-ink-gray-2 text-ink-gray-5 bg-ink-gray-9"></div>'
    const result = migrateTokens(input, { mode: 'ink-shift' })

    expect(result.migrated).toBe(input)
    expect(result.flagged).toEqual([])
  })

  it('ink-shift never touches stale non-v2 numerics like ink-blue-600', () => {
    const input = '<div class="text-ink-blue-600"></div>'
    const result = migrateTokens(input, { mode: 'ink-shift' })

    expect(result.migrated).toBe(input)
    expect(result.replacements).toEqual([])
    expect(result.flagged).toEqual([])
  })

  it('ink-shift flags ink-<family>-1 (old white step) instead of rewriting it', () => {
    const input = '<div class="text-ink-red-1">var(--ink-blue-1)</div>'
    const result = migrateTokens(input, { mode: 'ink-shift' })

    expect(result.migrated).toBe(input)
    expect(result.flagged.map((f) => f.token)).toEqual(['ink-red-1', 'ink-blue-1'])
  })

  it('ink-shift runs nothing else: colors, typography, radii, merges all untouched', () => {
    const input =
      '<div class="bg-surface-white text-xl font-medium rounded rounded-md text-base-black"></div>'
    const result = migrateTokens(input, { mode: 'ink-shift' })

    expect(result.migrated).toBe(input)
    expect(result.merges).toEqual([])
    expect(result.flagged).toEqual([])
  })

  it('ink-shift marker round-trips: absent, written, found', () => {
    // realpath: the search resolves symlinks, and os.tmpdir() is one on macOS.
    const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'tokens-v2-')))
    tempDirs.push(dir)

    expect(findInkShiftMarker(dir)).toBe(null)
    writeInkShiftMarker(dir)
    expect(findInkShiftMarker(dir)).toBe(path.join(dir, INK_SHIFT_MARKER))
  })

  it('ink-shift marker is found in both directions: ancestor and subtree', () => {
    // realpath: os.tmpdir() is a symlink on macOS, and path.resolve does not
    // follow symlinks.
    const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'tokens-v2-')))
    tempDirs.push(root)
    const sub = path.join(root, 'src')
    fs.mkdirSync(sub)

    // A marker written at the root is found from the subdirectory (ancestor
    // search), and a marker written in the subdirectory is found from the
    // root (subtree search) — but not by the ancestor search alone.
    writeInkShiftMarker(root)
    expect(findInkShiftMarker(sub)).toBe(path.join(root, INK_SHIFT_MARKER))
    fs.rmSync(path.join(root, INK_SHIFT_MARKER))
    writeInkShiftMarker(sub)
    expect(findInkShiftMarkerBelow(root)).toBe(path.join(sub, INK_SHIFT_MARKER))

    // node_modules is skipped like the file walk skips it.
    fs.rmSync(path.join(sub, INK_SHIFT_MARKER))
    const nm = path.join(root, 'node_modules')
    fs.mkdirSync(nm)
    writeInkShiftMarker(nm)
    expect(findInkShiftMarkerBelow(root)).toBe(null)
  })

  it('marker search ignores this run own markers but still finds a rival', () => {
    const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'tokens-v2-')))
    tempDirs.push(root)
    const sub = path.join(root, 'src')
    fs.mkdirSync(sub)
    // This is what claim-then-verify does: our own claim must not look like a
    // rival, or every run would abort itself.
    writeInkShiftMarker(root)
    const ours = new Set([path.join(root, INK_SHIFT_MARKER)])
    expect(findInkShiftMarker(root, { ignore: ours })).toBe(null)
    expect(findInkShiftMarkerBelow(root, { ignore: ours })).toBe(null)

    // A concurrent run claiming a nested target is still found.
    writeInkShiftMarker(sub)
    expect(findInkShiftMarkerBelow(root, { ignore: ours })).toBe(
      path.join(sub, INK_SHIFT_MARKER),
    )
    expect(findInkShiftMarker(sub, { ignore: new Set([path.join(sub, INK_SHIFT_MARKER)]) })).toBe(
      path.join(root, INK_SHIFT_MARKER),
    )
  })

  it('ink-shift CLI guard: real run writes the marker, a second real run refuses, --dry-run previews', () => {
    const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'tokens-v2-')))
    tempDirs.push(root)
    const fixture = path.join(root, 'a.vue')
    fs.writeFileSync(fixture, '<i class="text-ink-red-3"></i>')
    const script = fileURLToPath(new URL('./migrate-tokens-v2.js', import.meta.url))
    const run = (...cliArgs) =>
      spawnSync(process.execPath, [script, ...cliArgs], { encoding: 'utf8' })

    const first = run('--ink-shift', root)
    expect(first.status).toBe(0)
    expect(fs.readFileSync(fixture, 'utf8')).toContain('ink-red-2')
    expect(fs.existsSync(path.join(root, INK_SHIFT_MARKER))).toBe(true)

    const second = run('--ink-shift', root)
    expect(second.status).toBe(1)
    expect(second.stderr).toContain('already ran')
    expect(fs.readFileSync(fixture, 'utf8')).toContain('ink-red-2')

    const dry = run('--ink-shift', '--dry-run', root)
    expect(dry.status).toBe(0)
    expect(dry.stderr).toContain('already ran')
    expect(fs.readFileSync(fixture, 'utf8')).toContain('ink-red-2')

    // A file target is rejected — its marker would over-claim the directory.
    const fileRun = run('--ink-shift', fixture)
    expect(fileRun.status).toBe(1)
    expect(fileRun.stderr).toContain('directory targets only')
  })

  it('writeInkShiftMarker claims the directory: a second write throws EEXIST', () => {
    const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'tokens-v2-')))
    tempDirs.push(dir)
    writeInkShiftMarker(dir)
    // Exclusive create, so the claim is atomic: a concurrent run cannot pass
    // the guard and write over the winner.
    expect(() => writeInkShiftMarker(dir)).toThrow(/EEXIST/)
  })

  // chmod 0o444 does not stop root, so the simulated interrupt never happens there.
  it.skipIf(process.getuid?.() === 0)(
    'ink-shift CLI fails closed when interrupted: marker lands before rewrites, retry refuses',
    () => {
      const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'tokens-v2-')))
      tempDirs.push(root)
      // Unwritable file: the run crashes mid-loop after the marker is written.
      const blocked = path.join(root, 'a.vue')
      fs.writeFileSync(blocked, '<i class="text-ink-red-3"></i>')
      fs.chmodSync(blocked, 0o444)
      const script = fileURLToPath(new URL('./migrate-tokens-v2.js', import.meta.url))
      const run = () =>
        spawnSync(process.execPath, [script, '--ink-shift', root], { encoding: 'utf8' })

      const interrupted = run()
      expect(interrupted.status).not.toBe(0)
      expect(fs.existsSync(path.join(root, INK_SHIFT_MARKER))).toBe(true)
      expect(fs.readFileSync(blocked, 'utf8')).toContain('ink-red-3')

      // The retry refuses instead of double-shifting whatever was rewritten.
      const retry = run()
      expect(retry.status).toBe(1)
      expect(retry.stderr).toContain('already ran')
    },
  )

  // A read-only directory does not stop root, so the write never fails there.
  it.skipIf(process.getuid?.() === 0)(
    'ink-shift CLI rolls back earlier markers when a marker write fails',
    () => {
      const base = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'tokens-v2-')))
      tempDirs.push(base)
      const ok = path.join(base, 'ok')
      const blocked = path.join(base, 'blocked')
      fs.mkdirSync(ok)
      fs.mkdirSync(blocked)
      const fixture = path.join(ok, 'a.vue')
      fs.writeFileSync(fixture, '<i class="text-ink-red-3"></i>')
      // The second target cannot take a marker, so the run must undo the first.
      fs.chmodSync(blocked, 0o555)
      const script = fileURLToPath(new URL('./migrate-tokens-v2.js', import.meta.url))

      const result = spawnSync(process.execPath, [script, '--ink-shift', ok, blocked], {
        encoding: 'utf8',
      })
      fs.chmodSync(blocked, 0o755)
      expect(result.status).toBe(1)
      // No rewrite happened, so no marker may survive to refuse the retry.
      expect(fs.existsSync(path.join(ok, INK_SHIFT_MARKER))).toBe(false)
      expect(fs.readFileSync(fixture, 'utf8')).toContain('ink-red-3')

      // The retry runs and shifts exactly once.
      const retry = spawnSync(process.execPath, [script, '--ink-shift', ok], { encoding: 'utf8' })
      expect(retry.status).toBe(0)
      expect(fs.readFileSync(fixture, 'utf8')).toContain('ink-red-2')
    },
  )

  it('ink-shift CLI shifts a file once when targets overlap', () => {
    const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'tokens-v2-')))
    tempDirs.push(root)
    const sub = path.join(root, 'src')
    fs.mkdirSync(sub)
    const fixture = path.join(sub, 'a.vue')
    fs.writeFileSync(fixture, '<i class="text-ink-red-3"></i>')
    const script = fileURLToPath(new URL('./migrate-tokens-v2.js', import.meta.url))

    // A symlink alias of the subdirectory is the same target, not a third one.
    const alias = path.join(root, 'src-alias')
    fs.symlinkSync(sub, alias)

    const result = spawnSync(
      process.execPath,
      [script, '--ink-shift', root, sub, alias],
      { encoding: 'utf8' },
    )
    expect(result.status).toBe(0)
    // One shift (-3 → -2), not one per overlapping target (-3 → -1).
    expect(fs.readFileSync(fixture, 'utf8')).toContain('ink-red-2')

    // The marker is also found through the alias, so a retry via the symlink refuses.
    const retry = spawnSync(process.execPath, [script, '--ink-shift', alias], {
      encoding: 'utf8',
    })
    expect(retry.status).toBe(1)
    expect(retry.stderr).toContain('already ran')
  })

  it('ink-shift CLI follows internal symlinks, reports external ones, survives a cycle', () => {
    const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'tokens-v2-')))
    tempDirs.push(root)
    // Internal: a symlink to a sibling directory inside the target.
    const pkg = path.join(root, 'pkg')
    fs.mkdirSync(pkg)
    const internalFixture = path.join(pkg, 'a.vue')
    fs.writeFileSync(internalFixture, '<i class="text-ink-red-3"></i>')
    fs.symlinkSync(pkg, path.join(root, 'pkg-link'))
    // A cycle: an internal link back to the root itself.
    fs.symlinkSync(root, path.join(pkg, 'back'))
    // External: a shared package outside the target, linked under it.
    const shared = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'tokens-v2-shared-')))
    tempDirs.push(shared)
    const externalFixture = path.join(shared, 'b.vue')
    fs.writeFileSync(externalFixture, '<i class="text-ink-red-3"></i>')
    fs.symlinkSync(shared, path.join(root, 'linked-pkg'))
    // External file link: same break through a narrower entry point.
    const externalFile = path.join(shared, 'theme.css')
    fs.writeFileSync(externalFile, '.a { @apply text-ink-red-3; }')
    fs.symlinkSync(externalFile, path.join(root, 'theme.css'))
    const script = fileURLToPath(new URL('./migrate-tokens-v2.js', import.meta.url))

    const result = spawnSync(process.execPath, [script, '--ink-shift', root], {
      encoding: 'utf8',
      timeout: 30_000,
    })
    expect(result.status).toBe(0)
    // Internal content is shifted exactly once, through both the dir and its link.
    expect(fs.readFileSync(internalFixture, 'utf8')).toContain('ink-red-2')
    // The external package is untouched — it has no marker of its own, so a
    // rewrite here would set up a double-shift on a later direct run.
    expect(fs.readFileSync(externalFixture, 'utf8')).toContain('ink-red-3')
    // A symlinked file out of the target is skipped and reported too.
    expect(fs.readFileSync(externalFile, 'utf8')).toContain('ink-red-3')
    expect(result.stdout).toContain('NOT migrated')
    expect(result.stdout).toContain('linked-pkg')
    expect(result.stdout).toContain('theme.css')
  })

  it('ink-shift CLI ignores a marker inside an external linked package', () => {
    const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'tokens-v2-')))
    tempDirs.push(root)
    const fixture = path.join(root, 'a.vue')
    fs.writeFileSync(fixture, '<i class="text-ink-red-3"></i>')
    // An external package that already shifted on its own, linked under a
    // target that has not. The run never rewrites it, so its marker must not
    // block the target.
    const shared = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'tokens-v2-shared-')))
    tempDirs.push(shared)
    writeInkShiftMarker(shared)
    fs.symlinkSync(shared, path.join(root, 'linked-pkg'))

    expect(findInkShiftMarkerBelow(root)).toBe(null)

    const script = fileURLToPath(new URL('./migrate-tokens-v2.js', import.meta.url))
    const result = spawnSync(process.execPath, [script, '--ink-shift', root], {
      encoding: 'utf8',
      timeout: 30_000,
    })
    expect(result.status).toBe(0)
    expect(fs.readFileSync(fixture, 'utf8')).toContain('ink-red-2')
  })

  it('getMigrationMode selects ink-shift regardless of migration state', () => {
    expect(getMigrationMode({ likelyMigrated: true }, { inkShift: true })).toBe('ink-shift')
    expect(getMigrationMode({ likelyMigrated: false }, { inkShift: true })).toBe('ink-shift')
  })

  it('radius-only mode renames radii and touches nothing else', () => {
    const result = migrateTokens(
      '<div class="rounded rounded-md text-lg bg-surface-white text-base-black"></div>',
      { mode: 'radius-only' },
    )

    expect(result.migrated).toBe(
      '<div class="rounded-4 rounded-5 text-lg bg-surface-white text-base-black"></div>',
    )
    expect(result.flagged.map((f) => f.token)).toEqual(['text-base-black'])
  })
})

function writeTempFile(content) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tokens-v2-'))
  tempDirs.push(dir)
  const file = path.join(dir, 'fixture.vue')
  fs.writeFileSync(file, content)
  return file
}
