import fs from 'fs'
import path from 'path'

/**
 * VitePress' dead-link check validates paths, not `#fragments`. A link to a
 * heading that no longer exists still builds, and lands the reader at the top
 * of the page. This module resolves every heading id the way VitePress does,
 * so a test can check the fragments too.
 *
 * The slug rules mirror `@mdit-vue/shared`, which VitePress bundles. They are
 * not GitHub's rules: GitHub keeps repeated hyphens (`a--b`), VitePress
 * collapses them (`a-b`), and neither treats an em dash the same way.
 */

const rControl = /[\u0000-\u001f]/g
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g
const rCombining = /[\u0300-\u036f]/g

export function slugify(text: string): string {
  return text
    .normalize('NFKD')
    .replace(rCombining, '')
    .replace(rControl, '')
    .replace(rSpecial, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^(\d)/, '_$1')
    .toLowerCase()
}

/** Strip the inline markdown that the renderer drops before it slugs. */
function headingText(raw: string): string {
  return raw
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*?([^*]*)\*\*?/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
}

/** Every heading id on one page, including VitePress' `-1` de-duplication. */
export function headingIds(source: string): Set<string> {
  const ids = new Set<string>()
  const seen = new Map<string, number>()
  let inFence = false

  for (const line of source.replace(/^---\n[\s\S]*?\n---\n/, '').split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const heading = /^#{1,6}\s+(.*?)\s*$/.exec(line)
    if (!heading) continue

    const explicit = /\{#([^}]+)\}\s*$/.exec(heading[1])
    const id = explicit ? explicit[1] : slugify(headingText(heading[1]))

    const count = seen.get(id) ?? 0
    seen.set(id, count + 1)
    ids.add(count === 0 ? id : `${id}-${count}`)
  }

  return ids
}

export interface BrokenLink {
  file: string
  href: string
}

/** Walk `root` and report every `#fragment` link with no matching heading. */
export function findBrokenAnchorLinks(root: string): BrokenLink[] {
  const files: string[] = []
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const child = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(child)
      else if (entry.name.endsWith('.md')) files.push(child)
    }
  }
  walk(root)

  const routeOf = (file: string) =>
    '/docs/' + path.relative(root, file).replace(/\.md$/, '')

  const ids = new Map(
    files.map((file) => [
      routeOf(file),
      headingIds(fs.readFileSync(file, 'utf8')),
    ]),
  )

  const broken: BrokenLink[] = []
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8')
    for (const [, href] of source.matchAll(
      /\]\((\/[^)\s]*#[^)\s]+|#[^)\s]+)\)/g,
    )) {
      const [page, fragment] = href.split('#')
      // An external page is out of scope: only routes this site owns resolve.
      const route = page === '' ? routeOf(file) : page
      const pageIds = ids.get(route)
      if (!pageIds) continue
      if (!pageIds.has(fragment)) broken.push({ file, href })
    }
  }

  return broken
}
