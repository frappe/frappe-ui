/**
 * The exported `content` globs are the only way a consuming app knows which
 * frappe-ui files emit Tailwind classes. One rule decides what is listed for
 * `experimental/`: every directory the `frappe-ui/experimental` barrel
 * re-exports. This test derives that set from the barrel, so adding a
 * re-export without a glob fails here instead of rendering unstyled in an app.
 */
import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { content } from './content.js'

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)

/** Directories under `experimental/` that `experimental.ts` re-exports. */
function reExportedDirectories() {
  const barrel = fs.readFileSync(
    path.join(packageRoot, 'experimental.ts'),
    'utf8',
  )
  const directories = new Set()
  for (const match of barrel.matchAll(/from '\.\/experimental\/([^/']+)/g)) {
    directories.add(match[1])
  }
  return [...directories].sort()
}

/** The leading directory of each glob, relative to the package root. */
function globbedDirectories(prefix) {
  return content
    .map((glob) => path.relative(packageRoot, glob))
    .filter((glob) => glob.startsWith(`${prefix}/`))
    .map((glob) => glob.split('/')[1])
    .sort()
}

const positive = (glob) => (glob.startsWith('!') ? glob.slice(1) : glob)

describe('content globs', () => {
  it('covers every directory the experimental barrel re-exports', () => {
    expect(globbedDirectories('experimental')).toEqual(reExportedDirectories())
  })

  it('finds something to scan behind every glob', () => {
    for (const glob of content.map(positive)) {
      const directory = glob.slice(0, glob.indexOf('/**'))
      expect(fs.existsSync(directory), directory).toBe(true)
    }
  })

  it('keeps story files out of scan', () => {
    expect(content).toContain(`!${packageRoot}/**/stories/**`)
  })

  it('resolves every glob against this package, not the consumer', () => {
    for (const glob of content.map(positive)) {
      expect(path.isAbsolute(glob), glob).toBe(true)
      expect(glob.startsWith(packageRoot), glob).toBe(true)
      // Tailwind's scanner reads a backslash as an escape, not a separator.
      expect(glob).not.toContain('\\')
    }
  })
})
