// @vitest-environment jsdom
/**
 * Unit tests for src/composables/useColorScheme.ts
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  _resetColorScheme,
  getResolvedColorScheme,
  useColorScheme,
  useResolvedColorScheme,
} from './useColorScheme'

/**
 * jsdom has no `matchMedia`. Install one that reports a fixed OS preference and
 * records the change listeners the composable attaches.
 */
function stubSystemScheme(prefersDark: boolean) {
  const listeners: Array<() => void> = []
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches: prefersDark,
      addEventListener: (_: string, fn: () => void) => listeners.push(fn),
      removeEventListener: () => {},
    })),
  )
  return listeners
}

/** Advance one animation frame, so the double-rAF restore can be stepped. */
function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve))
}

beforeEach(() => {
  _resetColorScheme()
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  stubSystemScheme(false)
})

describe('useColorScheme', () => {
  it('falls back to system on the first call, with no stored value', () => {
    const { colorScheme } = useColorScheme()
    expect(colorScheme.value).toBe('system')
  })

  it('resolves system against the OS preference when applying data-theme', () => {
    stubSystemScheme(true)
    useColorScheme()
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('restores the stored preference', () => {
    localStorage.setItem('theme', 'dark')
    const { colorScheme } = useColorScheme()
    expect(colorScheme.value).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('ignores a stored value that is not a scheme', () => {
    localStorage.setItem('theme', 'chartreuse')
    const { colorScheme } = useColorScheme()
    expect(colorScheme.value).toBe('system')
  })

  it('setColorScheme moves the ref, the attribute and storage together', () => {
    const { colorScheme, setColorScheme } = useColorScheme()

    setColorScheme('dark')

    expect(colorScheme.value).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('toggleColorScheme flips between light and dark', () => {
    const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme()

    setColorScheme('dark')
    toggleColorScheme()
    expect(colorScheme.value).toBe('light')

    toggleColorScheme()
    expect(colorScheme.value).toBe('dark')
  })

  // SHELL-Q12: the old toggle read the *preference*, so under `system` on a dark
  // OS it wrote `dark` and the page did not move.
  it('toggleColorScheme leaves system for the opposite of what is painted', () => {
    stubSystemScheme(true)
    const { colorScheme, resolvedColorScheme, toggleColorScheme } =
      useColorScheme()
    expect(colorScheme.value).toBe('system')
    expect(resolvedColorScheme.value).toBe('dark')

    toggleColorScheme()

    expect(colorScheme.value).toBe('light')
    expect(resolvedColorScheme.value).toBe('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('toggleColorScheme from system on a light OS goes dark', () => {
    stubSystemScheme(false)
    const { colorScheme, toggleColorScheme } = useColorScheme()

    toggleColorScheme()

    expect(colorScheme.value).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  // SHELL-Q11.
  describe('resolvedColorScheme', () => {
    it('reports what the page is painted in, not the preference', () => {
      stubSystemScheme(true)
      const { colorScheme, resolvedColorScheme } = useColorScheme()

      expect(colorScheme.value).toBe('system')
      expect(resolvedColorScheme.value).toBe('dark')
    })

    it('follows setColorScheme', () => {
      const { resolvedColorScheme, setColorScheme } = useColorScheme()
      expect(resolvedColorScheme.value).toBe('light')

      setColorScheme('dark')

      expect(resolvedColorScheme.value).toBe('dark')
    })

    it('follows an OS flip while the preference stays system', () => {
      const listeners = stubSystemScheme(false)
      const { colorScheme, resolvedColorScheme } = useColorScheme()
      expect(resolvedColorScheme.value).toBe('light')

      stubSystemScheme(true)
      listeners.forEach((fn) => fn())

      expect(resolvedColorScheme.value).toBe('dark')
      expect(colorScheme.value).toBe('system')
    })

    it('stays put when the OS flips under an explicit preference', () => {
      const listeners = stubSystemScheme(false)
      const { resolvedColorScheme, setColorScheme } = useColorScheme()
      setColorScheme('light')

      stubSystemScheme(true)
      listeners.forEach((fn) => fn())

      expect(resolvedColorScheme.value).toBe('light')
    })

    it('is read-only, like colorScheme', () => {
      const { resolvedColorScheme } = useColorScheme()
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      // @ts-expect-error assigning is the mistake this guards against
      resolvedColorScheme.value = 'dark'

      expect(resolvedColorScheme.value).toBe('light')
      warn.mockRestore()
    })

    it('one caller sees another caller\'s change', () => {
      const first = useColorScheme()
      const second = useColorScheme()

      first.setColorScheme('dark')

      expect(second.resolvedColorScheme.value).toBe('dark')
    })
  })

  // The internal getter charts use. It reads the document, so it is right even
  // in an app that never calls the composable.
  describe('getResolvedColorScheme', () => {
    it('reads the data-theme attribute first', () => {
      stubSystemScheme(true)
      document.documentElement.setAttribute('data-theme', 'light')

      expect(getResolvedColorScheme()).toBe('light')
    })

    it('falls back to the dark class', () => {
      stubSystemScheme(false)
      document.documentElement.classList.add('dark')

      expect(getResolvedColorScheme()).toBe('dark')

      document.documentElement.classList.remove('dark')
    })

    it('falls back to the OS setting', () => {
      stubSystemScheme(true)

      expect(getResolvedColorScheme()).toBe('dark')
    })

    it('does not initialize the shared state', () => {
      getResolvedColorScheme()

      expect(localStorage.getItem('theme')).toBeNull()
      expect(document.documentElement.getAttribute('data-theme')).toBeNull()
    })
  })

  it('shares one state across callers', () => {
    const first = useColorScheme()
    const second = useColorScheme()

    first.setColorScheme('dark')

    expect(second.colorScheme.value).toBe('dark')
  })

  it('exposes colorScheme as read-only, so the three cannot desync', () => {
    const { colorScheme } = useColorScheme()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    // @ts-expect-error assigning is the mistake this guards against
    colorScheme.value = 'dark'

    expect(colorScheme.value).toBe('system')
    expect(localStorage.getItem('theme')).not.toBe('dark')
    warn.mockRestore()
  })

  it('re-applies data-theme when the OS flips and the scheme is system', () => {
    const listeners = stubSystemScheme(false)
    useColorScheme()
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')

    stubSystemScheme(true)
    listeners.forEach((fn) => fn())

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('leaves data-theme alone when the OS flips and the scheme is explicit', () => {
    const listeners = stubSystemScheme(false)
    const { setColorScheme } = useColorScheme()
    setColorScheme('light')

    stubSystemScheme(true)
    listeners.forEach((fn) => fn())

    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  describe('muting transitions across the swap', () => {
    it('mutes transitions in the same tick that data-theme changes', () => {
      const { setColorScheme } = useColorScheme()

      setColorScheme('dark')

      expect(document.documentElement.classList.contains('no-transition')).toBe(
        true,
      )
    })

    it('keeps them muted through the frame that paints the new theme', async () => {
      const { setColorScheme } = useColorScheme()

      setColorScheme('dark')
      await nextFrame()

      expect(document.documentElement.classList.contains('no-transition')).toBe(
        true,
      )
    })

    it('restores transitions once that paint is past', async () => {
      const { setColorScheme } = useColorScheme()

      setColorScheme('dark')
      await nextFrame()
      await nextFrame()

      expect(document.documentElement.classList.contains('no-transition')).toBe(
        false,
      )
    })

    it('a second swap mid-flight holds the mute open for its own paint', async () => {
      const { setColorScheme } = useColorScheme()

      setColorScheme('dark')
      await nextFrame()
      // Lands while the first swap's restore is one frame from firing: without
      // the cancel, that stale frame would unmute before this swap paints.
      setColorScheme('light')
      await nextFrame()

      expect(document.documentElement.classList.contains('no-transition')).toBe(
        true,
      )

      await nextFrame()
      expect(document.documentElement.classList.contains('no-transition')).toBe(
        false,
      )
    })
  })
})

// The read-only half: for a component whose host owns `data-theme`.
describe('useResolvedColorScheme', () => {
  /** MutationObserver records deliver on a microtask, so let them land. */
  const flushObserver = () => new Promise((resolve) => setTimeout(resolve, 0))

  it('reads what the document is painted in right now', () => {
    document.documentElement.setAttribute('data-theme', 'dark')

    expect(useResolvedColorScheme().value).toBe('dark')
  })

  it('follows a data-theme flip made by something else', async () => {
    const scheme = useResolvedColorScheme()
    expect(scheme.value).toBe('light')

    document.documentElement.setAttribute('data-theme', 'dark')
    await flushObserver()

    expect(scheme.value).toBe('dark')

    document.documentElement.setAttribute('data-theme', 'light')
    await flushObserver()

    expect(scheme.value).toBe('light')
  })

  it('follows the dark class too', async () => {
    const scheme = useResolvedColorScheme()

    document.documentElement.classList.add('dark')
    await flushObserver()
    expect(scheme.value).toBe('dark')

    document.documentElement.classList.remove('dark')
    await flushObserver()
    expect(scheme.value).toBe('light')
  })

  it('writes nothing and does not start the writer', () => {
    stubSystemScheme(true)

    const scheme = useResolvedColorScheme()

    expect(scheme.value).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBeNull()
    expect(localStorage.getItem('theme')).toBeNull()
    // The writing composable's own state is untouched, so a later
    // `useColorScheme()` still restores the stored preference itself.
    localStorage.setItem('theme', 'light')
    expect(useColorScheme().colorScheme.value).toBe('light')
  })

  it('is read-only', () => {
    const scheme = useResolvedColorScheme()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    // @ts-expect-error assigning is the mistake this guards against
    scheme.value = 'dark'

    expect(scheme.value).toBe('light')
    warn.mockRestore()
  })

  it('shares one ref across callers', async () => {
    const first = useResolvedColorScheme()
    const second = useResolvedColorScheme()

    document.documentElement.setAttribute('data-theme', 'dark')
    await flushObserver()

    expect(first.value).toBe('dark')
    expect(second.value).toBe('dark')
  })

  it('sees the attribute useColorScheme writes', async () => {
    const scheme = useResolvedColorScheme()
    const { setColorScheme } = useColorScheme()

    setColorScheme('dark')
    await flushObserver()

    expect(scheme.value).toBe('dark')
  })

  it('returns light and installs no observer without a document', () => {
    const realDocument = globalThis.document
    const observe = vi.spyOn(MutationObserver.prototype, 'observe')
    vi.stubGlobal('document', undefined)

    try {
      expect(useResolvedColorScheme().value).toBe('light')
      expect(observe).not.toHaveBeenCalled()
    } finally {
      vi.stubGlobal('document', realDocument)
      observe.mockRestore()
    }
  })
})
