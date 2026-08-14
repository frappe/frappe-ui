/**
 * @vitest-environment jsdom
 */

import spritePlugin, { LEGACY_ICON_ALIASES } from './spritePlugin'

describe('spritePlugin', () => {
  afterEach(() => {
    document.getElementById('lucide-sprite')?.remove()
  })

  it('includes new icons and preserves removed sprite names as aliases', () => {
    spritePlugin.install({} as never)

    const container = document.getElementById('lucide-sprite')
    expect(container?.querySelector('#user-shield')).not.toBeNull()

    for (const [legacyName, replacementName] of Object.entries(
      LEGACY_ICON_ALIASES,
    )) {
      const legacy = container?.querySelector(`#${legacyName}`)
      const replacement = container?.querySelector(`#${replacementName}`)
      expect(legacy, legacyName).not.toBeNull()
      expect(legacy?.innerHTML, legacyName).toBe(replacement?.innerHTML)
    }
  })
})
