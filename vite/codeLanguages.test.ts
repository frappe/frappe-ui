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
import { build, type Plugin } from 'vite'
import type { RollupOutput } from 'rollup'
import * as vite7 from 'vite'
import * as vite8 from '@test/vite8'
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

async function bundle(
  root: string,
  plugins: Plugin[] = [codeLanguages() as Plugin],
) {
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
      // `[a-z0-9-]` rather than `[a-z]`: a package name with a digit is the
      // silent miss this test exists to catch.
      [...source.matchAll(/'(@codemirror\/lang-[a-z0-9-]+)'/g)].map(
        (match) => match[1],
      ),
    )

    expect(imported.size).toBe(10)
    expect([...imported].sort()).toEqual([...OPTIONAL_LANGUAGES].sort())
  })
})

// Exercise both optimizer APIs so the Rolldown path runs in the normal test suite.
describe.each([
  ['Vite 7 (esbuild)', false],
  ['Vite 8 (Rolldown)', true],
])('codeLanguages in dependency pre-bundling: %s', (_, usesRolldown) => {
  async function optimize(
    root: string,
    plugins = [codeLanguages()],
    dependency = 'frappe-ui/code-editor',
  ) {
    const options = {
      root,
      configFile: false as const,
      logLevel: 'silent' as const,
      plugins: plugins as (vite7.Plugin & vite8.Plugin)[],
      optimizeDeps: { include: [dependency] },
    }
    if (usesRolldown) {
      const config = await vite8.resolveConfig(options, 'serve')
      return vite8.optimizeDeps(config, true)
    }
    const config = await vite7.resolveConfig(
      {
        ...options,
        optimizeDeps: {
          ...options.optimizeDeps,
          esbuildOptions: { logLevel: 'silent' },
        },
      },
      'serve',
    )
    return vite7.optimizeDeps(config, true)
  }

  /**
   * Every chunk the optimizer wrote, concatenated. The directory comes off the
   * metadata rather than from the root: a project without a `package.json`
   * caches in `.vite`, not in `node_modules/.vite`.
   */
  function optimized(
    metadata: Awaited<ReturnType<typeof optimize>>,
    dependency = 'frappe-ui/code-editor',
  ) {
    const dir = dirname(metadata.optimized[dependency].file)
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

  it('does not add a language stub without the plugin', async () => {
    const root = project(FRAPPE_UI)

    if (!usesRolldown) {
      await expect(optimize(root, [])).rejects.toThrow(
        /Could not resolve "@codemirror\/lang-json"/,
      )
    } else {
      // Rolldown leaves unresolved dynamic imports for the browser to load.
      const code = optimized(await optimize(root, []))
      expect(code).toContain('import("@codemirror/lang-json")')
      expect(code).not.toContain('Cannot find module')
    }
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

    const result = optimize(root, [codeLanguages()], 'other-ui/code-editor')

    if (!usesRolldown) {
      await expect(result).rejects.toThrow(
        /Could not resolve "@codemirror\/lang-json"/,
      )
    } else {
      const code = optimized(await result, 'other-ui/code-editor')
      expect(code).toContain('import("@codemirror/lang-json")')
      expect(code).not.toContain('Cannot find module')
    }
  }, 30000)
})
