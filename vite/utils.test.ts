import { beforeEach, describe, expect, it, vi } from 'vitest'
import { findAppName, findAppsFolder, findBenchPath } from './utils.js'

const state = vi.hoisted(() => ({
  flavor: 'posix' as 'posix' | 'win32',
  cwd: '/',
  directories: new Set<string>(),
  checks: 0,
  steps: 0,
}))

vi.mock('path', async (importOriginal) => {
  const actual = await importOriginal<typeof import('path')>()
  return {
    default: {
      resolve: (...parts: string[]) =>
        actual[state.flavor].resolve(state.cwd, ...parts),
      dirname: (value: string) => {
        if (++state.steps > 100)
          throw new Error('Directory walk did not terminate')
        return actual[state.flavor].dirname(value)
      },
      join: (...parts: string[]) => actual[state.flavor].join(...parts),
      basename: (value: string) => actual[state.flavor].basename(value),
    },
  }
})

vi.mock('fs', () => ({
  default: {
    existsSync: (value: string) => {
      // Fail deterministically instead of hanging the test on an endless walk.
      if (++state.checks > 40)
        throw new Error('Directory walk did not terminate')
      return state.directories.has(value)
    },
  },
}))

const path = await vi.importActual<typeof import('path')>('path')

const roots = [
  { name: 'POSIX', flavor: 'posix' as const, root: '/' },
  { name: 'Windows drive', flavor: 'win32' as const, root: 'C:\\' },
  {
    name: 'Windows UNC',
    flavor: 'win32' as const,
    root: '\\\\server\\share\\',
  },
]

describe.each(roots)('$name directory lookup', ({ flavor, root }) => {
  const paths = path[flavor]
  const bench = paths.join(root, 'work', 'bench')
  const app = paths.join(bench, 'apps', 'crm')
  const addBench = (directory = bench) => {
    state.directories.add(paths.join(directory, 'sites'))
    state.directories.add(paths.join(directory, 'apps'))
  }

  beforeEach(() => {
    state.flavor = flavor
    state.cwd = paths.join(app, 'frontend')
    state.directories.clear()
    state.checks = 0
    state.steps = 0
  })

  it('returns null outside a Bench', () => {
    expect(findBenchPath()).toBeNull()
    expect(findAppsFolder()).toBeNull()
    expect(findAppName()).toBeNull()
  })

  it('finds a Bench and app from a nested frontend', () => {
    addBench()
    expect(findBenchPath()).toBe(bench)
    expect(findAppsFolder()).toBe(paths.join(bench, 'apps'))
    expect(findAppName()).toBe('crm')
  })

  it('returns null for a Bench directory outside apps', () => {
    addBench()
    state.cwd = paths.join(bench, 'sites', 'example.test')
    expect(findAppName()).toBeNull()
  })

  it('checks a Bench located at the filesystem root', () => {
    addBench(root)
    expect(findBenchPath()).toBe(root)
  })
})
