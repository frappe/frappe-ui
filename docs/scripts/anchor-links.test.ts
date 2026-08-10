import path from 'path'

import { describe, expect, it } from 'vitest'

import { findBrokenAnchorLinks, headingIds, slugify } from './anchor-links'

const CONTENT = path.resolve(__dirname, '../content/docs')

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
    expect(findBrokenAnchorLinks(CONTENT)).toEqual([])
  })
})
