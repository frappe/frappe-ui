import { watch, type ComputedRef, type WatchStopHandle } from 'vue'
import type { TreeNode } from './types'
import type { FlatNode } from './useTreeKeyboard'
import { warnOnce } from '../../utils/warnDeprecated'

/**
 * Dev-only. The per-node `expanded` field went with the boolean model.
 * `TreeNode` has an index signature, so a beta caller keeping it gets no type
 * error — and no runtime effect either, leaving the node silently shut. Warn
 * on the data.
 *
 * `expanded` is also a plausible column name, and a node is allowed arbitrary
 * extra fields, so this reports what it found rather than telling the caller
 * what they did. No-op in production.
 */
export function useWarnLegacyExpanded(
  roots: ComputedRef<TreeNode[]>,
  flat: ComputedRef<FlatNode[]>,
  childrenOf: (node: TreeNode) => TreeNode[],
) {
  if (import.meta.env.PROD) return

  const carriesExpanded = (nodes: TreeNode[]): boolean =>
    nodes.some(
      (node) => 'expanded' in node || carriesExpanded(childrenOf(node)),
    )

  let reported = false
  let stopRoots: WatchStopHandle | undefined
  let stopFlat: WatchStopHandle | undefined

  const report = () => {
    reported = true
    warnOnce(
      'Tree.node.expanded',
      '[frappe-ui] Tree: a node in `nodes` carries an `expanded` field. ' +
        'Tree does not read it — expansion is `v-model:expanded`, an array ' +
        'of node keys. Ignore this if the field is your own data.',
    )
    // Both are `undefined` on the immediate pass; the call below covers it.
    stopRoots?.()
    stopFlat?.()
  }

  // One walk per `nodes` load, covering nodes under a closed ancestor: the
  // caller this exists for kept `expanded` on their data and bound no model,
  // so their tree is shut and only its roots render. Not deep — an in-place
  // `children =` keeps the array identity, and `flat` catches that instead at
  // no extra traversal, since it is already computed for rendering.
  stopRoots = watch(
    roots,
    (nodes) => {
      if (!reported && carriesExpanded(nodes)) report()
    },
    { immediate: true },
  )
  stopFlat = watch(flat, (rows) => {
    if (!reported && rows.some((row) => 'expanded' in row.node)) report()
  })
  if (reported) {
    stopRoots()
    stopFlat()
  }
}
