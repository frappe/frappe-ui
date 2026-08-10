import fs from 'fs'
import os from 'os'
import path from 'path'

import { describe, expect, it } from 'vitest'

import {
  findBrokenAnchorLinks,
  headingIds,
  slugify,
  type DocsRoot,
} from './anchor-links'

const repoRoot = path.resolve(__dirname, '../..')

/**
 * The same roots `docs/.vitepress/config.ts` serves: the hand-written tree,
 * then the four colocated ones it proxies in.
 */
const ROOTS: DocsRoot[] = [
  { dir: path.join(repoRoot, 'docs/content/docs'), route: '/docs' },
  {
    dir: path.join(repoRoot, 'src/components'),
    route: '/docs/components',
    flatten: true,
  },
  {
    dir: path.join(repoRoot, 'src/molecules'),
    route: '/docs/molecules',
    flatten: true,
  },
  {
    dir: path.join(repoRoot, 'experimental'),
    route: '/docs/experimental',
    flatten: true,
  },
  {
    dir: path.join(repoRoot, 'src/charts'),
    route: '/docs/charts',
    flatten: true,
  },
]

describe('slugify', () => {
  it('collapses the hyphens that a separator run produces', () => {
    // GitHub gives this heading `datepicker--timepicker-family`. VitePress
    // does not, so a hand-copied GitHub anchor breaks on the site.
    expect(slugify('DatePicker / TimePicker family')).toBe(
      'datepicker-timepicker-family',
    )
  })

  it('keeps an em dash, because it is not a separator', () => {
    expect(slugify('pageMetaPlugin — removed')).toBe('pagemetaplugin-—-removed')
  })
})

describe('headingIds', () => {
  it('prefers an explicit id over the slug', () => {
    expect(
      headingIds('## pageMetaPlugin — removed {#pagemetaplugin-removed}'),
    ).toContain('pagemetaplugin-removed')
  })

  it('numbers a repeated heading', () => {
    const ids = headingIds('## Props\n\n## Props\n')
    expect([...ids]).toEqual(['props', 'props-1'])
  })

  it('ignores a heading inside a fenced block', () => {
    expect([...headingIds('```md\n## Not a heading\n```\n')]).toEqual([])
  })
})

describe('docs anchor links', () => {
  it('every #fragment link resolves to a heading', () => {
    expect(findBrokenAnchorLinks(ROOTS)).toEqual([])
  })

  it('resolves a relative link, and a flattened colocated route', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'anchor-links-'))
    const content = path.join(dir, 'content')
    const source = path.join(dir, 'src')
    fs.mkdirSync(path.join(content, 'guides'), { recursive: true })
    fs.mkdirSync(path.join(source, 'Button'), { recursive: true })

    fs.writeFileSync(
      path.join(content, 'guides/start.md'),
      [
        '# Start',
        '[up](../index#welcome)',
        '[sibling](./next.md#step-two)',
        '[component](/docs/components/button#props)',
        '[gone](../index#missing)',
      ].join('\n\n'),
    )
    fs.writeFileSync(path.join(content, 'index.md'), '# Welcome')
    fs.writeFileSync(path.join(content, 'guides/next.md'), '## Step two')
    fs.writeFileSync(
      path.join(source, 'Button/Button.md'),
      '<!-- @include: ./Button.api.md -->',
    )
    // The heading a component page inherits from its generated table.
    fs.writeFileSync(path.join(source, 'Button/Button.api.md'), '## Props')

    const broken = findBrokenAnchorLinks([
      { dir: content, route: '/docs' },
      { dir: source, route: '/docs/components', flatten: true },
    ])

    fs.rmSync(dir, { recursive: true, force: true })
    expect(broken.map((b) => b.href)).toEqual(['../index#missing'])
  })
})
