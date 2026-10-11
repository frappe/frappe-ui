import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { benchFiles } from './benchFiles.js'
import { findAppName, findBenchPath } from './utils.js'

let root: string

beforeEach(() => {
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

  it('finds nothing outside a bench', () => {
    runIn(join(root, 'projects', 'gameplan', 'frontend'))

    expect(findBenchPath()).toBeNull()
    expect(findAppName()).toBeNull()
  })
})

describe('bench files', () => {
  const resolveIn = (resolved: string | null) =>
    benchFiles().resolveId.call(
      { resolve: async () => (resolved ? { id: resolved } : null) },
      '../../../../sites/common_site_config.json',
      '/src/socket.ts',
      {},
    )

  beforeEach(() => {
    writeFileSync(join(root, 'bench', 'sites', 'common_site_config.json'), '{}')
  })

  it('keeps an import that resolves where the app sits', async () => {
    expect(await resolveIn('/bench/sites/common_site_config.json')).toEqual({
      id: '/bench/sites/common_site_config.json',
    })
  })

  it('resolves an unreachable sites import in the bench', async () => {
    vi.stubEnv('FRAPPE_BENCH_PATH', join(root, 'bench'))

    expect(await resolveIn(null)).toBe(
      join(root, 'bench', 'sites', 'common_site_config.json'),
    )
  })
})
