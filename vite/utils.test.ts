import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  symlinkSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { findAppName, findBenchPath } from './utils.js'

let root: string

beforeEach(() => {
  vi.stubEnv('FRAPPE_BENCH_PATH', '')
  root = realpathSync(mkdtempSync(join(tmpdir(), 'frappe-ui-bench-')))
  mkdirSync(join(root, 'bench', 'sites'), { recursive: true })
  mkdirSync(join(root, 'bench', 'apps', 'helpdesk', 'frontend'), {
    recursive: true,
  })
  mkdirSync(join(root, 'projects', 'gameplan', 'frontend'), { recursive: true })
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
  rmSync(root, { recursive: true, force: true })
})

function runIn(dir: string) {
  vi.spyOn(process, 'cwd').mockReturnValue(dir)
}

describe('bench lookup', () => {
  it('finds an app that lives inside the bench', () => {
    runIn(join(root, 'bench', 'apps', 'helpdesk', 'frontend'))

    expect(findBenchPath()).toBe(join(root, 'bench'))
    expect(findAppName()).toBe('helpdesk')
  })

  it('finds an app linked into the bench from outside it', () => {
    symlinkSync(
      join(root, 'projects', 'gameplan'),
      join(root, 'bench', 'apps', 'gameplan'),
    )
    vi.stubEnv('FRAPPE_BENCH_PATH', join(root, 'bench'))
    runIn(join(root, 'projects', 'gameplan', 'frontend'))

    expect(findBenchPath()).toBe(join(root, 'bench'))
    expect(findAppName()).toBe('gameplan')
  })

  it('prefers the bench above the app to FRAPPE_BENCH_PATH', () => {
    mkdirSync(join(root, 'other-bench', 'apps', 'helpdesk'), {
      recursive: true,
    })
    mkdirSync(join(root, 'other-bench', 'sites'))
    vi.stubEnv('FRAPPE_BENCH_PATH', join(root, 'other-bench'))
    runIn(join(root, 'bench', 'apps', 'helpdesk', 'frontend'))

    expect(findBenchPath()).toBe(join(root, 'bench'))
    expect(findAppName()).toBe('helpdesk')
  })

  it('warns once and finds no app when FRAPPE_BENCH_PATH is not a bench', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.stubEnv('FRAPPE_BENCH_PATH', join(root, 'projects'))
    runIn(join(root, 'projects', 'gameplan', 'frontend'))

    expect(findBenchPath()).toBe(join(root, 'projects'))
    expect(findAppName()).toBeNull()
    expect(warn).toHaveBeenCalledTimes(1)
  })

  it('finds nothing outside a bench', () => {
    runIn(join(root, 'projects', 'gameplan', 'frontend'))

    expect(findBenchPath()).toBeNull()
    expect(findAppName()).toBeNull()
  })
})
