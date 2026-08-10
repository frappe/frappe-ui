/**
 * Module-level state that survives a duplicated copy of this package.
 *
 * esbuild cannot parse `.vue`, so Vite's dep pre-bundler inlines frappe-ui's
 * `.ts` modules into `node_modules/.vite/deps/frappe-ui.js` while leaving all
 * ~90 SFCs as external raw-source imports. A `.ts` module imported from both
 * sides of that boundary is instantiated twice, and any state it holds splits:
 * `dialog.confirm()` pushes onto the bundled copy's `dialogs` ref while
 * `<Dialogs />` renders the raw copy's, so no dialog ever appears.
 *
 * It fails silently, which is what makes it expensive to find — the call
 * succeeds, the array grows, and nobody is watching that array. The same split
 * empties `getConfig` for any SFC that reads it.
 *
 * Keying the state off `globalThis` with `Symbol.for` hands every copy the same
 * object, so the state is correct no matter how many times the module is
 * instantiated. Rollup keeps one graph, so a production build was never
 * affected; the cost there is one symbol lookup at module init.
 *
 * Only for state that must be process-wide. Anything scoped to a component,
 * a request, or an app instance belongs in provide/inject instead — a global
 * would leak across SSR requests.
 */
export function moduleSingleton<T>(key: string, create: () => T): T {
  const symbol = Symbol.for(`frappe-ui.${key}`)
  const store = globalThis as unknown as Record<symbol, T | undefined>
  // `in` rather than a truthiness check, so a falsy value still counts as
  // initialised and `create` runs exactly once.
  if (!(symbol in store)) store[symbol] = create()
  return store[symbol] as T
}
