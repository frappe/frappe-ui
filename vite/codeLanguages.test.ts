/**
 * The plugin's whole job is a build that used to fail, so every case here runs
 * a real Vite build over a throwaway project. The project sits in a temp
 * directory on purpose: this repo installs all ten language packages, and the
 * bug only exists where they are absent.
 */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { readFileSync, readdirSync } from 'node:fs'
import { build, optimizeDeps, resolveConfig, type RollupOutput } from 'vite'
import { afterAll, describe, expect, it } from 'vitest'
import { codeLanguages, OPTIONAL_LANGUAGES } from './codeLanguages.js'

const roots: string[] = []

afterAll(() => {
  for (const root of roots) rmSync(root, { recursive: true, force: true })
})

function project(files: Record<string, string>) {
  const root = mkdtempSync(join(tmpdir(), 'frappeui-code-languages-'))
  roots.push(root)
  for (const [name, content] of Object.entries(files)) {
    const file = join(root, name)
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, content)
  }
  return root
}

/** `languages.ts`'s shape: a literal dynamic import Rollup resolves at build. */
const LANGUAGES = `
export async function loadLanguage(key) {
  switch (key) {
    case 'json': return (await import('@codemirror/lang-json')).json()
    default: return null
  }
}
`

/**
 * A stand-in for the installed package. The plugin resolves
 * `frappe-ui/code-editor` to find the module it stubs for, so the fixture has
 * to carry the same subpath export the real package does.
 */
const FRAPPE_UI = {
  'node_modules/frappe-ui/package.json': JSON.stringify({
    name: 'frappe-ui',
    version: '0.0.0',
    type: 'module',
    exports: { './code-editor': './src/molecules/code-editor/index.js' },
  }),
  'node_modules/frappe-ui/src/molecules/code-editor/index.js':
    "export { loadLanguage } from './languages.js'",
  'node_modules/frappe-ui/src/molecules/code-editor/languages.js': LANGUAGES,
}

const MAIN = `
import { loadLanguage } from 'frappe-ui/code-editor'
window.load = loadLanguage
`

async function bundle(root: string, plugins = [codeLanguages()]) {
  const result = (await build({
    root,
    configFile: false,
    logLevel: 'silent',
    plugins,
    build: {
      write: false,
      minify: false,
      lib: { entry: join(root, 'src/main.js'), formats: ['es'] },
    },
  })) as RollupOutput | RollupOutput[]
  // `build()` hands back one bundle per output config, as an array once there
  // is more than one. Flatten both shapes and read every chunk.
  const outputs = Array.isArray(result) ? result : [result]
  return outputs
    .flatMap((output) => output.output)
    .map((chunk) => (chunk.type === 'chunk' ? chunk.code : ''))
    .join('\n')
}

describe('codeLanguages', () => {
  it('builds when the language package is absent', async () => {
    const root = project({ 'src/main.js': MAIN, ...FRAPPE_UI })

    const code = await bundle(root)

    expect(code).toContain("Cannot find module '@codemirror/lang-json'")
  })

  it('is the reason that build works', async () => {
    // Without the plugin the same project is the bug this fixes: Rollup
    // resolves the arm of the switch and ends the build.
    const root = project({ 'src/main.js': MAIN, ...FRAPPE_UI })

    await expect(bundle(root, [])).rejects.toThrow(
      /failed to resolve import "@codemirror\/lang-json"/i,
    )
  })

  it('leaves an installed package alone', async () => {
    const root = project({
      'src/main.js': MAIN,
      ...FRAPPE_UI,
      'node_modules/@codemirror/lang-json/package.json': JSON.stringify({
        name: '@codemirror/lang-json',
        version: '0.0.0',
        type: 'module',
        main: 'index.js',
      }),
      'node_modules/@codemirror/lang-json/index.js':
        "export const json = () => 'the real parser'",
    })

    const code = await bundle(root)

    expect(code).toContain('the real parser')
    expect(code).not.toContain('Cannot find module')
  })

  it("does not stub an app's own import", async () => {
    // Nothing catches that one, so a build failure is the honest answer.
    const root = project({
      'src/main.js': "import '@codemirror/lang-json'",
      ...FRAPPE_UI,
    })

    await expect(bundle(root)).rejects.toThrow(
      /failed to resolve import "@codemirror\/lang-json"/i,
    )
  })

  it("does not stub an app's own file of the same name", async () => {
    // An app is free to keep its own `src/code-editor/languages.js`. Stubbing
    // a package that file needs would hide a dependency it must install.
    const root = project({
      'src/main.js': "import './code-editor/languages.js'",
      'src/code-editor/languages.js': LANGUAGES,
      ...FRAPPE_UI,
    })

    await expect(bundle(root)).rejects.toThrow(
      /failed to resolve import "@codemirror\/lang-json"/i,
    )
  })

  it('does nothing when frappe-ui is not installed', async () => {
    const root = project({
      'src/main.js': "import './code-editor/languages.js'",
      'src/code-editor/languages.js': LANGUAGES,
    })

    await expect(bundle(root)).rejects.toThrow(
      /failed to resolve import "@codemirror\/lang-json"/i,
    )
  })

  it('does not stub a package loadLanguage cannot reach', async () => {
    const root = project({
      'src/main.js': MAIN,
      ...FRAPPE_UI,
      'node_modules/frappe-ui/src/molecules/code-editor/languages.js':
        LANGUAGES.replace('lang-json', 'lang-rust'),
    })

    await expect(bundle(root)).rejects.toThrow(
      /failed to resolve import "@codemirror\/lang-rust"/i,
    )
  })

  it('throws the missing-module error when the stub runs', async () => {
    // `loadLanguage`'s catch turns this into the install hint, so the wording
    // has to read as a package that is not there.
    const stub = codeLanguages().load(
      '\0frappe-ui:absent-language:@codemirror/lang-sql',
    )

    expect(() => new Function(stub!)()).toThrow(
      "Cannot find module '@codemirror/lang-sql'",
    )
  })

  it('ignores an id it did not create', () => {
    expect(codeLanguages().load('/app/src/main.js')).toBeNull()
  })

  it('covers every package languages.ts imports', () => {
    // Two hardcoded lists have to agree. An eleventh language in `languages.ts`
    // and not in the set would leave a consumer with the raw Rollup failure
    // this plugin exists to prevent, and this repo would stay green: it carries
    // all ten as devDependencies.
    const source = readFileSync(
      join(import.meta.dirname, '../src/molecules/code-editor/languages.ts'),
      'utf8',
    )
    const imported = new Set(
      [...source.matchAll(/'(@codemirror\/lang-[a-z]+)'/g)].map(
        (match) => match[1],
      ),
    )

    expect(imported.size).toBe(10)
    expect([...imported].sort()).toEqual([...OPTIONAL_LANGUAGES].sort())
  })
})

/**
 * Vite pre-bundles bare specifiers with esbuild, and that step runs no Rollup
 * plugin hooks. `frappe-ui/code-editor` is a bare specifier, so the optimizer
 * reaches `languages.ts` on its own, and an absent package there kills the dev
 * server instead of degrading. The plugin's esbuild twin covers it.
 */
describe('codeLanguages in dependency pre-bundling', () => {
  async function optimize(root: string, plugins = [codeLanguages()]) {
    const config = await resolveConfig(
      {
        root,
        configFile: false,
        logLevel: 'silent',
        plugins,
        optimizeDeps: {
          include: ['frappe-ui/code-editor'],
          // esbuild prints its own errors, and the failing case expects one.
          esbuildOptions: { logLevel: 'silent' },
        },
      },
      'serve',
    )
    return optimizeDeps(config, true)
  }

  /**
   * Every chunk the optimizer wrote, concatenated. The directory comes off the
   * metadata rather than from the root: a project without a `package.json`
   * caches in `.vite`, not in `node_modules/.vite`.
   */
  function optimized(metadata: Awaited<ReturnType<typeof optimizeDeps>>) {
    const dir = dirname(metadata.optimized['frappe-ui/code-editor'].file)
    return readdirSync(dir)
      .filter((name) => name.endsWith('.js'))
      .map((name) => readFileSync(join(dir, name), 'utf8'))
      .join('\n')
  }

  it('pre-bundles when the language package is absent', async () => {
    const root = project(FRAPPE_UI)

    const metadata = await optimize(root)

    expect(Object.keys(metadata.optimized)).toContain('frappe-ui/code-editor')
    expect(optimized(metadata)).toContain(
      "Cannot find module '@codemirror/lang-json'",
    )
  }, 30000)

  it('is the reason dev works', async () => {
    // Without the twin, esbuild ends the optimize step and `vite dev` exits.
    const root = project(FRAPPE_UI)

    await expect(optimize(root, [])).rejects.toThrow(
      /Could not resolve "@codemirror\/lang-json"/,
    )
  }, 30000)

  it('leaves an installed package alone', async () => {
    const root = project({
      ...FRAPPE_UI,
      'node_modules/@codemirror/lang-json/package.json': JSON.stringify({
        name: '@codemirror/lang-json',
        version: '0.0.0',
        type: 'module',
        main: 'index.js',
      }),
      'node_modules/@codemirror/lang-json/index.js':
        "export const json = () => 'the real parser'",
    })

    const metadata = await optimize(root)

    expect(optimized(metadata)).toContain('the real parser')
    expect(optimized(metadata)).not.toContain(
      "Cannot find module '@codemirror/lang-json'",
    )
  }, 30000)

  it("does not stub another package's loader", async () => {
    // The importer gate holds in the optimizer too: only frappe-ui's own
    // module is stubbed, whatever a package names its files.
    const root = project({
      ...FRAPPE_UI,
      'node_modules/other-ui/package.json': JSON.stringify({
        name: 'other-ui',
        version: '0.0.0',
        type: 'module',
        exports: { './code-editor': './src/molecules/code-editor/index.js' },
      }),
      'node_modules/other-ui/src/molecules/code-editor/index.js':
        "export { loadLanguage } from './languages.js'",
      'node_modules/other-ui/src/molecules/code-editor/languages.js': LANGUAGES,
    })

    const config = await resolveConfig(
      {
        root,
        configFile: false,
        logLevel: 'silent',
        plugins: [codeLanguages()],
        optimizeDeps: {
          include: ['other-ui/code-editor'],
          esbuildOptions: { logLevel: 'silent' },
        },
      },
      'serve',
    )

    await expect(optimizeDeps(config, true)).rejects.toThrow(
      /Could not resolve "@codemirror\/lang-json"/,
    )
  }, 30000)
})
