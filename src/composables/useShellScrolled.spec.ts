// @vitest-environment jsdom
/**
 * Unit tests for src/composables/useShellScrolled.ts
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createApp,
  defineComponent,
  nextTick,
  onMounted,
  ref,
  watch,
  type ComputedRef,
} from 'vue'
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

/**
 * Mount a shell whose slot holds a page calling `useShellScrolled`, so the
 * child-before-parent mount order is the real one. `setup` is the shell's own.
 */
function mountShell(setup: () => void) {
  const Page = defineComponent({
    setup() {
      useShellScrolled()
    },
    template: '<div/>',
  })
  const Shell = defineComponent({
    components: { Page },
    setup,
    template: '<div><Page /></div>',
  })
  const host = document.createElement('div')
  document.body.appendChild(host)
  const app = createApp(Shell)
  app.mount(host)
  return app
}

/**
 * Past the point the deferred no-shell check runs. It waits on a timeout, so a
 * macrotask is what clears it; ticks alone are not enough.
 */
async function settle() {
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve))
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

  it('stays false and warns once when no shell is mounted', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const first = mountScrolled()
    const second = mountScrolled()
    await settle()

    expect(first.scrolled().value).toBe(false)
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toMatch(/found no app shell/)

    first.unmount()
    second.unmount()
    warn.mockRestore()
  })

  it('does not warn when a shell is registered', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    register(makeScroller())

    const { unmount } = mountScrolled()
    await settle()

    expect(warn).not.toHaveBeenCalled()
    unmount()
    warn.mockRestore()
  })

  // A routed page renders into the shell's `<slot />`, so it is a child
  // component: its `mounted` runs before the shell's. The two shells register
  // at different moments after that, and neither may warn.
  it("does not warn for a page inside a shell that registers in its own 'mounted'", async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const el = makeScroller()

    // MobileShell's pattern.
    const app = mountShell(() => {
      onMounted(() => register(el))
    })
    await settle()

    expect(warn).not.toHaveBeenCalled()

    app.unmount()
    warn.mockRestore()
  })

  it('does not warn for a page inside a shell that registers from a ref watcher', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const el = makeScroller()

    // DesktopShell's pattern: an immediate watcher on a template ref that only
    // resolves once its child component has mounted, so it registers later
    // still than MobileShell does.
    const app = mountShell(() => {
      const viewport = ref<HTMLElement | null>(null)
      watch(viewport, (value) => value && register(value), { immediate: true })
      onMounted(() => {
        viewport.value = el
      })
    })
    await settle()

    expect(warn).not.toHaveBeenCalled()

    app.unmount()
    warn.mockRestore()
  })
})
