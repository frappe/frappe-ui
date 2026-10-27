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
import { build, type RollupOutput } from 'vite'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { benchFiles } from './benchFiles.js'

let root: string

beforeEach(() => {
  vi.stubEnv('FRAPPE_BENCH_PATH', '')
  root = realpathSync(mkdtempSync(join(tmpdir(), 'frappeui-bench-files-')))
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
  rmSync(root, { recursive: true, force: true })
})

describe('benchFiles', () => {
  it('resolves sites/ imports of a linked app in the bench', async () => {
    const bench = join(root, 'bench')
    const frontend = join(root, 'projects', 'gameplan', 'frontend')
    mkdirSync(join(bench, 'apps'), { recursive: true })
    mkdirSync(join(bench, 'sites'))
    mkdirSync(join(frontend, 'src'), { recursive: true })
    symlinkSync(
      join(root, 'projects', 'gameplan'),
      join(bench, 'apps', 'gameplan'),
    )
    writeFileSync(
      join(bench, 'sites', 'common_site_config.json'),
      '{"socketio_port": 9123}',
    )
    writeFileSync(join(bench, 'sites', 'apps.json'), '["linked-app"]')
    writeFileSync(
      join(frontend, 'src', 'main.js'),
      `import config from '../../../../sites/common_site_config.json?raw'
import apps from '../../../../sites/apps'
window.bench = { config, apps }`,
    )
    vi.stubEnv('FRAPPE_BENCH_PATH', bench)
    vi.spyOn(process, 'cwd').mockReturnValue(frontend)

    const output = (await build({
      root: frontend,
      configFile: false,
      logLevel: 'silent',
      plugins: [benchFiles()],
      build: {
        write: false,
        minify: false,
        lib: { entry: join(frontend, 'src', 'main.js'), formats: ['es'] },
      },
    })) as RollupOutput[]
    const code = output[0].output[0].code

    // ?raw keeps the file as a string; the extensionless import finds apps.json.
    // Rollup and Rolldown quote that string differently.
    expect(code).toMatch(/socketio_port\\?": 9123/)
    expect(code).toContain('"linked-app"')
  })
})
