import { defineAsyncComponent, type App, type Component } from 'vue'

// Opt-in showcase machinery: the *Builder.vue playgrounds + ComponentPlayground.
// Import this only on sites that document frappe-ui components themselves.
//
// The builders are discovered by glob and registered as async components on
// purpose. They are registered globally so markdown can reference
// `<ButtonBuilder />` by name, but a static barrel made every page load all of
// them -- and with them CodeMirror, the charts and the editor. Markdown wraps
// each builder in <ClientOnly>, so nothing here renders during SSR and
// deferring the chunk costs no static HTML.
import ComponentPlayground from './ComponentPlayground.vue'

const modules = import.meta.glob<{ default: Component }>('./*Builder.vue')

export const builders: Record<string, Component> = Object.fromEntries(
  Object.entries(modules).map(([path, loader]) => [
    path.slice('./'.length, -'.vue'.length),
    defineAsyncComponent(loader),
  ]),
)

// Register every builder globally so markdown can reference them by name.
export function registerBuilders(app: App) {
  for (const [name, component] of Object.entries(builders)) {
    app.component(name, component)
  }
}

export { ComponentPlayground }
export type { Knob, KnobOption } from './ComponentPlayground.vue'
