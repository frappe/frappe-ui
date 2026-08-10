import { h, type FunctionalComponent } from 'vue'

// Native elements rendered through these functional wrappers rather than
// bare 'button'/'a' tag strings. A string `:is` binding runs through Vue's
// component resolver, which capitalizes the name and matches a globally
// registered component — so in apps that do `app.component('Button', ...)`
// (e.g. Gameplan), `<component :is="'button'">` resolves to that Button
// component instead of a native <button>. Binding a component value skips
// the resolver. `inheritAttrs: false` keeps merged attrs from being applied
// twice.
export const NativeButton: FunctionalComponent = (_props, { attrs, slots }) =>
  h('button', attrs, slots.default?.())
NativeButton.inheritAttrs = false

export const NativeAnchor: FunctionalComponent = (_props, { attrs, slots }) =>
  h('a', attrs, slots.default?.())
NativeAnchor.inheritAttrs = false
