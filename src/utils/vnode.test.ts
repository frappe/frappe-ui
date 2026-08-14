import { describe, expect, it } from 'vitest'
import { Comment, Fragment, Text, createVNode, h } from 'vue'
import { getFirstRenderableElement, hasRenderableContent } from './vnode'

// These helpers decide whether a menu item's prefix, label and suffix render
// at all, and they take `VNodeChild` — menu slots are declared as
// `(props) => VNodeChild`, so a render function may hand back a bare string,
// a number, `null`, or a nested array.

const text = (value: string) => createVNode(Text, null, value)
const comment = () => createVNode(Comment)
const fragment = (children: unknown) => createVNode(Fragment, null, children)

describe('hasRenderableContent', () => {
  it('is false for nothing at all', () => {
    expect(hasRenderableContent()).toBe(false)
    expect(hasRenderableContent(null)).toBe(false)
    expect(hasRenderableContent(undefined)).toBe(false)
    expect(hasRenderableContent(false)).toBe(false)
    expect(hasRenderableContent([])).toBe(false)
  })

  it('treats a bare string as content only when it is not blank', () => {
    expect(hasRenderableContent('label')).toBe(true)
    expect(hasRenderableContent('   ')).toBe(false)
    expect(hasRenderableContent('')).toBe(false)
  })

  it('treats a bare number as content, zero included', () => {
    expect(hasRenderableContent(42)).toBe(true)
    expect(hasRenderableContent(0)).toBe(true)
  })

  it('looks inside a nested array', () => {
    expect(hasRenderableContent([[null, ['  ']]])).toBe(false)
    expect(hasRenderableContent([[null, ['ok']]])).toBe(true)
  })

  it('ignores comment vnodes and blank text vnodes', () => {
    expect(hasRenderableContent(comment())).toBe(false)
    expect(hasRenderableContent(text('  '))).toBe(false)
    expect(hasRenderableContent(text('ok'))).toBe(true)
    expect(hasRenderableContent([comment(), text('ok')])).toBe(true)
  })

  it('reads a fragment whose children are a string, not only an array', () => {
    expect(hasRenderableContent(fragment('ok'))).toBe(true)
    expect(hasRenderableContent(fragment('   '))).toBe(false)
    expect(hasRenderableContent(fragment([comment()]))).toBe(false)
    expect(hasRenderableContent(fragment([text('ok')]))).toBe(true)
  })

  it('is true for any element vnode', () => {
    expect(hasRenderableContent(h('span'))).toBe(true)
  })
})

describe('getFirstRenderableElement', () => {
  it('is null when there is nothing to clone onto', () => {
    expect(getFirstRenderableElement()).toBeNull()
    expect(getFirstRenderableElement(null)).toBeNull()
    expect(getFirstRenderableElement([comment(), comment()])).toBeNull()
  })

  it('skips strings and numbers, which carry no element', () => {
    expect(getFirstRenderableElement('label')).toBeNull()
    expect(getFirstRenderableElement(42)).toBeNull()
  })

  it('returns the first element past the comments', () => {
    const span = h('span')
    expect(getFirstRenderableElement([comment(), span, h('div')])).toBe(span)
  })

  it('returns a non-blank text vnode but skips a blank one', () => {
    const blank = text('  ')
    const filled = text('ok')
    expect(getFirstRenderableElement([blank, filled])).toBe(filled)
  })

  it('descends into fragments and nested arrays', () => {
    const span = h('span')
    expect(getFirstRenderableElement(fragment([comment(), span]))).toBe(span)
    expect(getFirstRenderableElement([[comment(), [span]]])).toBe(span)
  })
})
