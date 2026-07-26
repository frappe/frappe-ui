import { getCurrentInstance } from 'vue'

/**
 * Reports whether the consumer bound a given `defineModel` prop — i.e. whether
 * `v-model:<name>` (or a one-way `:<name>`) was passed from the outside.
 *
 * `defineModel` deliberately hides this: with a `default`, an absent prop and a
 * prop bound to that same default look identical from `props`. Vue answers the
 * question internally by reading the raw vnode props (`useModel` uses exactly
 * this to decide between local and controlled mode), so we read them too. The
 * lookup is deferred to call time because Vue reassigns `instance.vnode` on
 * every parent re-render — a consumer that starts binding later is picked up.
 *
 * Used by the selection family to decide who owns the search query: a bound
 * `query` belongs to the consumer and is never reset by the component.
 *
 * @param name model name, e.g. `'query'`
 * @returns a getter, `true` when the model is externally bound
 */
export function useIsModelBound(name: string): () => boolean {
  const instance = getCurrentInstance()
  const updateKey = `onUpdate:${name}`

  return () => {
    const rawProps = instance?.vnode.props
    if (!rawProps) return false
    return name in rawProps || updateKey in rawProps
  }
}
