import { h, type FunctionalComponent } from 'vue'

/**
 * Wrap a `lucide-<name>` class icon in the component shape this family expects.
 *
 * The v0 toolbars and slash-command lists store an icon COMPONENT on each
 * command object and render it with `<component :is>`. frappe-ui draws icons
 * from class names instead: the Tailwind plugin generates a `lucide-<name>`
 * class for every lucide icon and paints it as a CSS mask in `currentColor`.
 * This adapter keeps those call sites unchanged while removing the last
 * `~icons/lucide/*` imports, which needed the `lucideIcons` Vite plugin.
 *
 * Every caller passes the class name as a literal, which is what Tailwind's
 * scanner needs in order to emit the class. `experimental/TextEditor` is in
 * the `content` globs exported from `frappe-ui/tailwind`.
 */
export function classIcon(name: string): FunctionalComponent {
  // Vue merges a `class` passed at the call site onto this span, so
  // `<component :is="icon" class="h-4 w-4" />` still works.
  return () => h('span', { class: name })
}
