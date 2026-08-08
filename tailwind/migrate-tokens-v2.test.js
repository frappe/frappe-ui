import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import {
  detectMigrationState,
  getMigrationMode,
  migrateTokens,
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

  it('selects typography-only mode when v2 sentinels are present', () => {
    const file = writeTempFile(
      '<div class="bg-surface-base bg-surface-white text-xl"></div>',
    )
    const state = detectMigrationState([file])

    expect(state).toEqual({ pre: 1, post: 1, likelyMigrated: true })
    expect(getMigrationMode(state)).toBe('migrated-typography')
    expect(getMigrationMode(state, { force: true })).toBe('full')
  })
})

function writeTempFile(content) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tokens-v2-'))
  tempDirs.push(dir)
  const file = path.join(dir, 'fixture.vue')
  fs.writeFileSync(file, content)
  return file
}
