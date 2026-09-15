import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import { migratePackaging, usesLucidePlugin } from './migrate-packaging-v1.js'

const SCRIPT = fileURLToPath(
  new URL('./migrate-packaging-v1.js', import.meta.url),
)
const tempDirs = []

afterEach(() => {
  for (const dir of tempDirs.splice(0))
    fs.rmSync(dir, { recursive: true, force: true })
})

function tempDir(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'packaging-v1-'))
  tempDirs.push(dir)
  for (const [name, content] of Object.entries(files)) {
    const file = path.join(dir, name)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, content)
  }
  return dir
}

/** The lucide rewrite only runs when the caller says the app needs it. */
const withIcons = { addLucideIcons: true }

describe('tailwind preset path', () => {
  it('rewrites a require of the removed deep path', () => {
    const source = `module.exports = {\n  presets: [require('frappe-ui/src/utils/tailwind.config')],\n}\n`
    const result = migratePackaging(source, 'tailwind.config.js')

    expect(result.migrated).toBe(
      `module.exports = {\n  presets: [require('frappe-ui/tailwind')],\n}\n`,
    )
    expect(result.changes).toHaveLength(1)
    expect(result.refusals).toHaveLength(0)
  })

  it('rewrites the import, dynamic import and re-export forms', () => {
    const source = [
      `import preset from 'frappe-ui/src/utils/tailwind.config'`,
      `export { x } from 'frappe-ui/src/utils/tailwind.config'`,
      `const later = () => import('frappe-ui/src/utils/tailwind.config')`,
      ``,
    ].join('\n')

    const result = migratePackaging(source, 'tailwind.config.ts')
    expect(result.changes).toHaveLength(3)
    expect(result.migrated).not.toContain('src/utils')
    expect(
      result.migrated.match(/'frappe-ui\/tailwind'/g),
    ).toHaveLength(3)
  })

  it('rewrites the path written with its .js extension and keeps the quote style', () => {
    const source = `const preset = require("frappe-ui/src/utils/tailwind.config.js")\n`
    expect(migratePackaging(source, 'tailwind.config.js').migrated).toBe(
      `const preset = require("frappe-ui/tailwind")\n`,
    )
  })

  it('leaves a look-alike path from another package alone', () => {
    const source = `import preset from 'my-ui/src/utils/tailwind.config'\nimport other from './src/utils/tailwind.config'\n`
    expect(migratePackaging(source, 'tailwind.config.js').migrated).toBe(source)
  })

  it('is idempotent', () => {
    const source = `import preset from 'frappe-ui/src/utils/tailwind.config'\n`
    const first = migratePackaging(source, 'tailwind.config.js')
    const second = migratePackaging(first.migrated, 'tailwind.config.js')

    expect(second.migrated).toBe(first.migrated)
    expect(second.changes).toHaveLength(0)
  })
})

describe('lucideIcons on the Vite plugin', () => {
  it('adds the option to an existing options object and keeps the layout', () => {
    const source = [
      `import frappeui from 'frappe-ui/vite'`,
      `export default defineConfig({`,
      `  plugins: [`,
      `    frappeui({`,
      `      frappeProxy: true,`,
      `    }),`,
      `  ],`,
      `})`,
      ``,
    ].join('\n')

    const result = migratePackaging(source, 'vite.config.ts', withIcons)
    expect(result.migrated).toBe(
      [
        `import frappeui from 'frappe-ui/vite'`,
        `export default defineConfig({`,
        `  plugins: [`,
        `    frappeui({`,
        `      lucideIcons: true,`,
        `      frappeProxy: true,`,
        `    }),`,
        `  ],`,
        `})`,
        ``,
      ].join('\n'),
    )
  })

  it('handles a call with no options and a call with an empty object', () => {
    const source = `import frappeui from 'frappe-ui/vite'\nconst a = frappeui()\nconst b = frappeui({})\n`
    expect(migratePackaging(source, 'vite.config.ts', withIcons).migrated).toBe(
      `import frappeui from 'frappe-ui/vite'\nconst a = frappeui({ lucideIcons: true })\nconst b = frappeui({ lucideIcons: true })\n`,
    )
  })

  it('follows a require of the plugin', () => {
    const source = `const frappeui = require('frappe-ui/vite')\nmodule.exports = { plugins: [frappeui({ frappeProxy: true })] }\n`
    expect(
      migratePackaging(source, 'vite.config.js', withIcons).migrated,
    ).toContain('frappeui({ lucideIcons: true, frappeProxy: true })')
  })

  it('ignores a plugin of the same name from another package', () => {
    const source = `import frappeui from './my-plugin'\nconst a = frappeui({ frappeProxy: true })\n`
    expect(migratePackaging(source, 'vite.config.ts', withIcons).migrated).toBe(
      source,
    )
  })

  it('leaves a locally shadowed binding alone', () => {
    const source = [
      `import frappeui from 'frappe-ui/vite'`,
      `function build() {`,
      `  const frappeui = otherPlugin`,
      `  return frappeui({ frappeProxy: true })`,
      `}`,
      ``,
    ].join('\n')

    expect(migratePackaging(source, 'vite.config.ts', withIcons).migrated).toBe(
      source,
    )
  })

  it('leaves a binding shadowed inside a bare block alone', () => {
    const source = [
      `import frappeui from 'frappe-ui/vite'`,
      `{`,
      `  const frappeui = otherPlugin`,
      `  frappeui({ frappeProxy: true })`,
      `}`,
      ``,
    ].join('\n')

    expect(migratePackaging(source, 'vite.config.ts', withIcons).migrated).toBe(
      source,
    )
  })

  it('leaves a binding shadowed by a catch parameter alone', () => {
    const source = [
      `import frappeui from 'frappe-ui/vite'`,
      `try {`,
      `  run()`,
      `} catch (frappeui) {`,
      `  frappeui({ frappeProxy: true })`,
      `}`,
      ``,
    ].join('\n')

    expect(migratePackaging(source, 'vite.config.ts', withIcons).migrated).toBe(
      source,
    )
  })

  it('still migrates a sibling scope that does not shadow the import', () => {
    const source = [
      `import frappeui from 'frappe-ui/vite'`,
      `function shadowed() {`,
      `  const frappeui = otherPlugin`,
      `  return frappeui({ a: 1 })`,
      `}`,
      `function plain() {`,
      `  return frappeui({ b: 2 })`,
      `}`,
      ``,
    ].join('\n')

    const result = migratePackaging(source, 'vite.config.ts', withIcons)
    expect(result.changes).toHaveLength(1)
    expect(result.migrated).toContain(`return frappeui({ a: 1 })`)
    expect(result.migrated).toContain(`return frappeui({ lucideIcons: true, b: 2 })`)
  })

  it('leaves a config that already answers the question alone', () => {
    const source = `import frappeui from 'frappe-ui/vite'\nconst a = frappeui({ lucideIcons: true })\nconst b = frappeui({ lucideIcons: false })\n`
    const result = migratePackaging(source, 'vite.config.ts', withIcons)

    expect(result.migrated).toBe(source)
    expect(result.changes).toHaveLength(0)
    expect(result.notes).toHaveLength(0)
  })

  it('is idempotent', () => {
    const source = `import frappeui from 'frappe-ui/vite'\nconst a = frappeui({ frappeProxy: true })\n`
    const first = migratePackaging(source, 'vite.config.ts', withIcons)
    const second = migratePackaging(first.migrated, 'vite.config.ts', withIcons)

    expect(second.migrated).toBe(first.migrated)
    expect(second.changes).toHaveLength(0)
  })

  it('reports the site instead of guessing when it sees no icon use', () => {
    const source = `import frappeui from 'frappe-ui/vite'\nconst a = frappeui({ frappeProxy: true })\n`
    const result = migratePackaging(source, 'vite.config.ts')

    expect(result.migrated).toBe(source)
    expect(result.notes).toHaveLength(1)
    expect(result.notes[0].line).toBe(2)
    expect(result.notes[0].message).toContain('defaults to false')
  })

  it('refuses options it cannot see into', () => {
    const spread = `import frappeui from 'frappe-ui/vite'\nfrappeui({ ...options })\n`
    expect(
      migratePackaging(spread, 'vite.config.ts', withIcons).refusals[0].message,
    ).toContain('spread another value')

    const computed = `import frappeui from 'frappe-ui/vite'\nfrappeui({ [key]: 1 })\n`
    expect(
      migratePackaging(computed, 'vite.config.ts', withIcons).refusals[0]
        .message,
    ).toContain('computed key')

    const opaque = `import frappeui from 'frappe-ui/vite'\nfrappeui(options)\n`
    const result = migratePackaging(opaque, 'vite.config.ts', withIcons)
    expect(result.refusals[0].message).toContain(
      'options this codemod cannot read',
    )
    expect(result.migrated).toBe(opaque)
  })

  it('holds back every edit in a file that has one refusal', () => {
    const source = [
      `import frappeui from 'frappe-ui/vite'`,
      `import preset from 'frappe-ui/src/utils/tailwind.config'`,
      `frappeui(options)`,
      ``,
    ].join('\n')

    const result = migratePackaging(source, 'vite.config.ts', withIcons)
    expect(result.migrated).toBe(source)
    expect(result.changes).toHaveLength(0)
    expect(result.refusals).toHaveLength(1)
  })
})

describe('icon use detection', () => {
  it('sees an ~icons import in any file type', () => {
    expect(
      usesLucidePlugin(`import Check from '~icons/lucide/check'`, 'a.ts'),
    ).toBe(true)
    expect(usesLucidePlugin(`import Check from '~icons/mdi/check'`, 'a.ts')).toBe(
      false,
    )
  })

  it('sees a <LucideX /> tag in a Vue template only', () => {
    const vue = `<template><LucideCheck class="size-4" /></template>\n`
    expect(usesLucidePlugin(vue, 'A.vue')).toBe(true)
    // The same text in a script is a string, not a tag.
    expect(usesLucidePlugin(`const x = '<LucideCheck />'`, 'a.ts')).toBe(false)
    expect(usesLucidePlugin(`<template><Lucide /></template>`, 'A.vue')).toBe(
      false,
    )
  })
})

describe('Vue files', () => {
  it('migrates inside a script setup block', () => {
    const source = `<script setup lang="ts">\nimport preset from 'frappe-ui/src/utils/tailwind.config'\n</script>\n<template><div /></template>\n`
    expect(migratePackaging(source, 'Main.vue').migrated).toContain(
      `'frappe-ui/tailwind'`,
    )
  })

  it('reports an unparsable Vue file instead of rewriting it', () => {
    const source = `<script setup>\nimport preset from 'frappe-ui/src/utils/tailwind.config'\n</script>\n<template><div></template>\n`
    const result = migratePackaging(source, 'Broken.vue')

    expect(result.migrated).toBe(source)
    expect(result.refusals[0].message).toContain('could not be parsed')
  })
})

describe('command line', () => {
  it('supports dry runs and writes normal runs', () => {
    const dir = tempDir({
      'tailwind.config.js': `module.exports = { presets: [require('frappe-ui/src/utils/tailwind.config')] }\n`,
    })

    const dry = spawnSync(process.execPath, [SCRIPT, '--dry-run', dir], {
      encoding: 'utf8',
    })
    expect(dry.status).toBe(0)
    expect(
      fs.readFileSync(path.join(dir, 'tailwind.config.js'), 'utf8'),
    ).toContain('frappe-ui/src/utils/tailwind.config')

    const write = spawnSync(process.execPath, [SCRIPT, dir], {
      encoding: 'utf8',
    })
    expect(write.status).toBe(0)
    expect(
      fs.readFileSync(path.join(dir, 'tailwind.config.js'), 'utf8'),
    ).toContain(`require('frappe-ui/tailwind')`)
  })

  it('adds lucideIcons only when the tree it is given uses icons', () => {
    const config = `import frappeui from 'frappe-ui/vite'\nexport default { plugins: [frappeui({ frappeProxy: true })] }\n`

    const plain = tempDir({ 'vite.config.ts': config })
    const quiet = spawnSync(process.execPath, [SCRIPT, plain], {
      encoding: 'utf8',
    })
    expect(quiet.status).toBe(0)
    expect(fs.readFileSync(path.join(plain, 'vite.config.ts'), 'utf8')).toBe(
      config,
    )
    expect(quiet.stdout).toContain('Check by hand')

    const withUse = tempDir({
      'vite.config.ts': config,
      'src/App.vue': `<script setup>\nimport Check from '~icons/lucide/check'\n</script>\n<template><Check /></template>\n`,
    })
    const loud = spawnSync(process.execPath, [SCRIPT, withUse], {
      encoding: 'utf8',
    })
    expect(loud.status).toBe(0)
    expect(
      fs.readFileSync(path.join(withUse, 'vite.config.ts'), 'utf8'),
    ).toContain('frappeui({ lucideIcons: true, frappeProxy: true })')
    expect(loud.stdout).not.toContain('Check by hand')
  })

  it('reports that a refused file is left unchanged', () => {
    const source = `import frappeui from 'frappe-ui/vite'\nimport Check from '~icons/lucide/check'\nfrappeui(options)\n`
    const dir = tempDir({ 'vite.config.ts': source })
    const result = spawnSync(process.execPath, [SCRIPT, dir], {
      encoding: 'utf8',
    })

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('affected files were left unchanged')
    expect(fs.readFileSync(path.join(dir, 'vite.config.ts'), 'utf8')).toBe(
      source,
    )
  })

  it('rejects an unknown option and a missing path', () => {
    const unknown = spawnSync(process.execPath, [SCRIPT, '--write', '.'], {
      encoding: 'utf8',
    })
    expect(unknown.status).toBe(1)
    expect(unknown.stderr).toContain('Unknown option')

    const missing = spawnSync(process.execPath, [SCRIPT, '/no/such/path'], {
      encoding: 'utf8',
    })
    expect(missing.status).toBe(1)
    expect(missing.stderr).toContain('Invalid path')
  })

  it('runs through an installed-style binary symlink', () => {
    const dir = tempDir({
      'tailwind.config.js': `const preset = require('frappe-ui/src/utils/tailwind.config')\n`,
    })
    const bin = path.join(dir, 'packaging-v1')
    fs.symlinkSync(SCRIPT, bin)

    const result = spawnSync(process.execPath, [bin, dir], { encoding: 'utf8' })
    expect(result.status).toBe(0)
    expect(
      fs.readFileSync(path.join(dir, 'tailwind.config.js'), 'utf8'),
    ).toContain(`require('frappe-ui/tailwind')`)
  })

  it('does not follow target symlinks', () => {
    const outside = tempDir({
      'outside.js': `const preset = require('frappe-ui/src/utils/tailwind.config')\n`,
    })
    const dir = tempDir({})
    fs.symlinkSync(outside, path.join(dir, 'linked'), 'dir')

    const result = spawnSync(process.execPath, [SCRIPT, dir], {
      encoding: 'utf8',
    })

    expect(result.status).toBe(0)
    expect(fs.readFileSync(path.join(outside, 'outside.js'), 'utf8')).toContain(
      'frappe-ui/src/utils/tailwind.config',
    )
  })

  it('says why a symlinked target reads nothing', () => {
    const outside = tempDir({
      'outside.js': `const preset = require('frappe-ui/src/utils/tailwind.config')\n`,
    })
    const dir = tempDir({})
    const link = path.join(dir, 'linked')
    fs.symlinkSync(outside, link, 'dir')

    const result = spawnSync(process.execPath, [SCRIPT, link], {
      encoding: 'utf8',
    })

    expect(result.status).toBe(0)
    expect(result.stderr).toContain('it is a symlink')
    expect(result.stdout).toContain('Updated 0 files')
    expect(fs.readFileSync(path.join(outside, 'outside.js'), 'utf8')).toContain(
      'frappe-ui/src/utils/tailwind.config',
    )
  })
})

describe('packaging', () => {
  it('runs with only the dependencies the package ships', () => {
    const declared = JSON.parse(
      fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
    )
    const imports = fs
      .readFileSync(SCRIPT, 'utf8')
      .matchAll(/^import .* from '([^']+)'$/gm)

    for (const [, specifier] of imports) {
      if (specifier.startsWith('node:') || specifier.startsWith('.')) continue
      expect(
        declared.dependencies?.[specifier] ??
          declared.peerDependencies?.[specifier],
      ).toBeDefined()
    }
    expect(declared.bin['packaging-v1']).toBe(
      './scripts/migrate-packaging-v1.js',
    )
    // A bin whose file is not published installs as a broken symlink.
    expect(declared.files).toContain('scripts/migrate-packaging-v1.js')
  })
})
