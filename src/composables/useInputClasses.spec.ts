/**
 * Unit tests for src/composables/useInputClasses.ts
 */
import { describe, expect, it } from 'vitest'
import { useInputClasses } from './useInputClasses'

function flatten(classes: Array<string | string[]>) {
  return classes.flat().join(' ')
}

describe('useInputClasses', () => {
  it('returns the size geometry and the subtle surface by default', () => {
    const { inputClasses } = useInputClasses({ size: () => 'md' })
    const classes = flatten(inputClasses.value)

    expect(classes).toContain('h-8')
    expect(classes).toContain('bg-surface-gray-2')
    expect(classes).toContain('focus:bg-surface-base')
  })

  it('moves the focus treatment onto the box for focus-within', () => {
    const { inputClasses } = useInputClasses({ focusPrefix: 'focus-within' })
    const classes = flatten(inputClasses.value)

    expect(classes).toContain('focus-within:bg-surface-base')
    expect(classes).not.toContain('focus:bg-surface-base')
  })

  it('reserves room for a prefix', () => {
    const { inputClasses } = useInputClasses({
      size: () => 'sm',
      hasPrefix: () => true,
    })

    expect(flatten(inputClasses.value)).toContain('ps-8')
  })

  it('renders the disabled surface whatever the variant says', () => {
    const { inputClasses, textColor } = useInputClasses({
      variant: () => 'outline',
      disabled: () => true,
    })

    expect(flatten(inputClasses.value)).toContain('bg-surface-gray-1')
    expect(textColor.value).toBe('text-ink-gray-5')
  })
})
