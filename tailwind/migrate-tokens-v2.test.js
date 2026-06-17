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
