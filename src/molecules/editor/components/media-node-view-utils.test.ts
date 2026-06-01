import { describe, it, expect } from 'vitest'
import {
  wrapperClasses,
  containerClasses,
  alignIcon,
  aspectRatioFrom,
  heightOverWidth,
} from './media-node-view-utils'

describe('wrapperClasses', () => {
  it('uses default block margin when not floating', () => {
    expect(wrapperClasses(null)).toEqual(['my-2'])
    expect(wrapperClasses(undefined)).toEqual(['my-2'])
  })

  it('floats left/right with content width', () => {
    expect(wrapperClasses('left')).toEqual(['w-fit m-2', 'float-left mr-5'])
    expect(wrapperClasses('right')).toEqual(['w-fit m-2', 'float-right ml-5'])
  })
})

describe('containerClasses', () => {
  it('centers by default and toggles the selected ring', () => {
    const classes = containerClasses({ align: null }, true)
    expect(classes).toContainEqual({
      'ring-2 ring-outline-gray-3 ring-offset-2': true,
    })
    expect(classes).toContain('mx-auto')
  })

  it('right-aligns and drops block when floating', () => {
    const classes = containerClasses({ align: 'right', float: 'left' }, false)
    expect(classes).toContain('ml-auto mr-0')
    expect(classes).not.toContain('block max-w-full')
  })
})

describe('alignIcon', () => {
  it('maps known alignments', () => {
    expect(alignIcon('center')).toBe('lucide-align-center')
    expect(alignIcon('right')).toBe('lucide-align-right')
  })

  it('defaults to left', () => {
    expect(alignIcon(null)).toBe('lucide-align-left')
    expect(alignIcon(undefined)).toBe('lucide-align-left')
  })
})

describe('aspectRatioFrom', () => {
  it('builds a CSS aspect-ratio when both dims present', () => {
    expect(aspectRatioFrom(640, 480)).toBe('640 / 480')
  })

  it('returns undefined when a dimension is missing', () => {
    expect(aspectRatioFrom(640, null)).toBeUndefined()
    expect(aspectRatioFrom(null, 480)).toBeUndefined()
    expect(aspectRatioFrom(0, 480)).toBeUndefined()
  })
})

describe('heightOverWidth', () => {
  it('returns height / width', () => {
    expect(heightOverWidth(200, 100)).toBe(0.5)
  })

  it('falls back to 1 on missing/zero dims', () => {
    expect(heightOverWidth(null, 100)).toBe(1)
    expect(heightOverWidth(200, 0)).toBe(1)
  })
})
