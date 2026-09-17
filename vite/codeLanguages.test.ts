/**
 * The plugin's whole job is a build that used to fail, so every case here runs
 * a real Vite build over a throwaway project. The project sits in a temp
 * directory on purpose: this repo installs all ten language packages, and the
 * bug only exists where they are absent.
 */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { build, type RollupOutput } from 'vite'
import { afterAll, describe, expect, it } from 'vitest'
import { codeLanguages } from './codeLanguages.js'

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
})
