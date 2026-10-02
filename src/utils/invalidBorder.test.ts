/**
 * @vitest-environment jsdom
 */

import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import { withInvalidBorder, INVALID_BORDER_CLASSES } from './invalidBorder'
import TextInput from '../components/TextInput/TextInput.vue'
import Textarea from '../components/Textarea/Textarea.vue'
import Select from '../components/Select/Select.vue'
import Combobox from '../components/Combobox/Combobox.vue'
import MultiSelect from '../components/MultiSelect/MultiSelect.vue'

const subtle =
  'border border-[--surface-gray-2] bg-surface-gray-2 hover:border-outline-elevation-2 focus:border-outline-gray-4'

describe('withInvalidBorder', () => {
  it('leaves a valid field untouched', () => {
    expect(withInvalidBorder(subtle, false)).toBe(subtle)
  })

  it('swaps every gray border color for red, keeping the rest', () => {
    const out = withInvalidBorder(subtle, true).split(' ')
    expect(out).toContain('border')
    expect(out).toContain('bg-surface-gray-2')
    expect(out).not.toContain('border-[--surface-gray-2]')
    expect(out).not.toContain('hover:border-outline-elevation-2')
    expect(out).not.toContain('focus:border-outline-gray-4')
    for (const cls of INVALID_BORDER_CLASSES) expect(out).toContain(cls)
  })

  it('keeps a borderless variant borderless', () => {
    const ghost = 'border-0 bg-transparent'
    expect(withInvalidBorder(ghost, true)).toBe(ghost)
    const transparent = 'border border-transparent bg-transparent'
    expect(withInvalidBorder(transparent, true)).toBe(transparent)
  })
})

describe('Inputs with an error draw a red border', () => {
  const cases: [string, any, string, Record<string, unknown>][] = [
    ['TextInput', TextInput, 'input', {}],
    ['Textarea', Textarea, 'textarea', {}],
    ['Select', Select, '[data-slot="trigger"]', { options: ['A', 'B'] }],
    ['Combobox', Combobox, '[data-slot="trigger"]', { options: ['A', 'B'] }],
    ['MultiSelect', MultiSelect, '[data-slot="trigger"]', { options: ['A'] }],
  ]

  function borderOf(
    component: any,
    selector: string,
    props: Record<string, unknown>,
  ) {
    const host = document.createElement('div')
    const app = createApp(component, props)
    app.mount(host)
    const cls = host.querySelector(selector)?.className ?? ''
    app.unmount()
    return cls
  }

  it.each(cases)('%s turns red on error', (_n, component, selector, props) => {
    expect(
      borderOf(component, selector, { ...props, error: 'Wrong' }),
    ).toContain('border-outline-red-4')
  })

  it.each(cases)(
    '%s stays gray without one',
    (_n, component, selector, props) => {
      expect(borderOf(component, selector, props)).not.toContain(
        'border-outline-red-4',
      )
    },
  )
})
