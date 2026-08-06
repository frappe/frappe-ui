// @vitest-environment jsdom
/**
 * Unit tests for src/composables/useShellScrolled.ts
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, nextTick, type ComputedRef } from 'vue'
import {
  _resetShellScrolledWarning,
  registerShellScrollContainer,
  scrollShellToTop,
  shellScrollContainer,
  unregisterShellScrollContainer,
  useShellScrolled,
} from './useShellScrolled'

/** A stand-in for a shell's scroll region: scrollTop is writable in jsdom. */
function makeScroller() {
  const el = document.createElement('div')
  el.scrollTo = vi.fn()
  document.body.appendChild(el)
  return el
}

function setScrollTop(el: HTMLElement, top: number) {
  el.scrollTop = top
  el.dispatchEvent(new Event('scroll'))
}

/** Mount a component that calls `useShellScrolled` and hand back its result. */
function mountScrolled(options?: { threshold?: number }) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  let scrolled!: ComputedRef<boolean>
  const app = createApp(
    defineComponent({
      setup() {
        scrolled = useShellScrolled(options)
      },
      template: '<div/>',
    }),
  )
  app.mount(host)
  return { scrolled: () => scrolled, unmount: () => app.unmount() }
}

const registered: HTMLElement[] = []
function register(el: HTMLElement) {
  registerShellScrollContainer(el)
  registered.push(el)
}

beforeEach(() => {
  _resetShellScrolledWarning()
})

afterEach(() => {
  registered.splice(0).forEach(unregisterShellScrollContainer)
  document.body.innerHTML = ''
})

describe('shellScrollContainer', () => {
  it('is null when no shell is mounted', () => {
    expect(shellScrollContainer.value).toBeNull()
  })

  it('resolves the registered element', () => {
    const el = makeScroller()
    register(el)
    expect(shellScrollContainer.value).toBe(el)
  })

  it('is a stack, so a layout swap hands over in either mount order', () => {
    const desktop = makeScroller()
    const mobile = makeScroller()

    register(desktop)
    register(mobile) // new shell mounts before the old one tears down
    expect(shellScrollContainer.value).toBe(mobile)

    unregisterShellScrollContainer(desktop)
    registered.splice(registered.indexOf(desktop), 1)
    expect(shellScrollContainer.value).toBe(mobile)
  })
})

describe('scrollShellToTop', () => {
  it('smooth-scrolls the registered container', () => {
    const el = makeScroller()
    register(el)

    scrollShellToTop()

    expect(el.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('is a no-op with no shell', () => {
    expect(() => scrollShellToTop()).not.toThrow()
  })
})

describe('useShellScrolled', () => {
  it('flips once the container passes the threshold', async () => {
    const el = makeScroller()
    register(el)
    const { scrolled, unmount } = mountScrolled({ threshold: 100 })

    expect(scrolled().value).toBe(false)

    setScrollTop(el, 150)
    await nextTick()
    expect(scrolled().value).toBe(true)

    setScrollTop(el, 50)
    await nextTick()
    expect(scrolled().value).toBe(false)

    unmount()
  })

  it('defaults the threshold to 200', async () => {
    const el = makeScroller()
    register(el)
    const { scrolled, unmount } = mountScrolled()

    setScrollTop(el, 199)
    await nextTick()
    expect(scrolled().value).toBe(false)

    setScrollTop(el, 201)
    await nextTick()
    expect(scrolled().value).toBe(true)

    unmount()
  })

  it('re-binds to the new container across a layout swap', async () => {
    const desktop = makeScroller()
    register(desktop)
    const { scrolled, unmount } = mountScrolled({ threshold: 100 })

    setScrollTop(desktop, 300)
    await nextTick()
    expect(scrolled().value).toBe(true)

    const mobile = makeScroller()
    register(mobile) // mobile shell takes over, scrolled to the top
    await nextTick()
    expect(scrolled().value).toBe(false)

    setScrollTop(mobile, 300)
    await nextTick()
    expect(scrolled().value).toBe(true)

    unmount()
  })

  it('stays false and warns once when no shell is mounted', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const first = mountScrolled()
    const second = mountScrolled()

    expect(first.scrolled().value).toBe(false)
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toMatch(/found no app shell/)

    first.unmount()
    second.unmount()
    warn.mockRestore()
  })

  it('does not warn when a shell is registered', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    register(makeScroller())

    const { unmount } = mountScrolled()

    expect(warn).not.toHaveBeenCalled()
    unmount()
    warn.mockRestore()
  })
})
