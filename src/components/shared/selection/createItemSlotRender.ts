import { defineComponent } from 'vue'

/**
 * Render-function wrapper for slot functions passed via props.
 *
 * Each Results component (MultiSelectResults, ComboboxResults) needs to
 * stamp out a per-item slot using a render function it received from its
 * parent. Defining the wrapper at module scope (or inside each Results
 * `setup`) keeps Vue's component identity stable across renders — passing
 * the slot fn inline would remount the wrapper on every tick.
 *
 * The `name` arg only sets the displayed component name in Vue devtools.
 */
export function createItemSlotRender(name: string) {
  return defineComponent({
    name,
    props: {
      render: { type: Function, required: true },
      slotProps: { type: Object, required: true },
    },
    setup(innerProps) {
      return () =>
        (innerProps.render as (p: any) => any)(innerProps.slotProps)
    },
  })
}
