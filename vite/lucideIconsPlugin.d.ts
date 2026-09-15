import type { Plugin } from 'vite'

/**
 * Resolve `~icons/lucide/<name>` to an inline-SVG Vue component built from
 * `lucide-static`. `frappeui({ lucideIcons: true })` adds this plugin; import
 * it directly to add only the resolver, without the auto-import and
 * auto-component plugins.
 */
export declare function lucideIconsPlugin(
  icons?: Record<string, string>,
): Plugin

/** Every lucide icon name mapped to its raw SVG source. */
export declare function getIcons(): Record<string, string>
