import { describe, expectTypeOf, it } from 'vitest'
import type { ComboboxEmits } from '../Combobox/types'
import type { MultiSelectEmits } from '../MultiSelect/types'
import type { SelectEmits } from './types'

// `defineModel` declares the model events, so the emit interfaces must not
// name them again. A wrapper passing one of these to `defineEmits` and
// re-binding the model listener used to fail to compile, because the declared
// payload disagreed with the generated one.
// @ts-expect-error `update:modelValue` belongs to `defineModel`.
type SelectModelEmit = SelectEmits['update:modelValue']
// @ts-expect-error Same for Combobox.
type ComboboxModelEmit = ComboboxEmits['update:modelValue']
// @ts-expect-error Same for MultiSelect.
type MultiSelectModelEmit = MultiSelectEmits['update:modelValue']

type Unused = SelectModelEmit | ComboboxModelEmit | MultiSelectModelEmit

describe('selection emit interfaces', () => {
  it('keeps the events no model declares', () => {
    expectTypeOf<SelectEmits['update:open']>().toEqualTypeOf<[value: boolean]>()
    expectTypeOf<ComboboxEmits>().toHaveProperty('update:selectedOption')
    expectTypeOf<MultiSelectEmits>().toHaveProperty('update:selectedOptions')
  })
})
