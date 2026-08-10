// @vitest-environment jsdom
/**
 * Unit tests for src/composables/useColorScheme.ts
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { _resetColorScheme, useColorScheme } from './useColorScheme'

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
