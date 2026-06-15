import type { ComputedRef, InjectionKey, Ref } from 'vue'

/** A node key — the value read from `nodeKey` on each node. */
export type TreeKey = string | number

/**
 * A tree node. Carries a display `label`, nested `children`, and a unique id
 * under the field named by the `nodeKey` prop. Any extra fields are preserved
 * and passed through to slots.
 */
export type TreeNode = {
  [key: string]: unknown
  label?: string
  children?: TreeNode[]
}

/** Where a dragged node lands relative to the hovered target. */
export type DropPosition = 'inside' | 'before' | 'after'

/** Context passed to the `canDrop` validator. */
export interface DropContext {
  /** The node being dragged. */
  node: TreeNode
  /** The node currently hovered as the drop target. */
  target: TreeNode
  /** Resolved drop position relative to `target`. */
  position: DropPosition
}

/** Payload emitted on a valid drop. */
export interface MoveEvent {
  /** The moved node. */
  node: TreeNode
  /** Key of the previous parent, or `null` if it was a root. */
  from: TreeKey | null
  /** Key of the new parent, or `null` when moved to root level. */
  to: TreeKey | null
  /** Drop position relative to the target node. */
  position: DropPosition
  /** Final index of the node within its new parent's children. */
  index: number
}

export interface TreeProps {
  /**
   * Forest roots to render. Each node may contain nested children to form the
   * tree structure.
   */
  nodes: TreeNode[]

  /**
   * Name of the field that uniquely identifies each node.
   * @default 'key'
   */
  nodeKey?: string

  /**
   * Enable drag-and-drop. Each node becomes draggable and can be dropped onto
   * another node to reparent it.
   * @default false
   */
  draggable?: boolean

  /**
   * Gate every drop. Receives the drag context and returns whether the drop is
   * allowed. Built-in guards (drop-on-self, drop-into-descendant) run first.
   */
  canDrop?: (ctx: DropContext) => boolean

  /**
   * Allow dropping `before`/`after` a sibling to reorder, in addition to
   * dropping `inside` to reparent.
   * @default false
   */
  reorderable?: boolean

  /**
   * Visual style of the indentation guides.
   * @default 'connectors'
   */
  guides?: 'connectors' | 'lines' | 'none'

  /**
   * Initial expansion state of nodes when `v-model:expanded` is not bound.
   * @default false
   */
  defaultExpanded?: boolean

  /**
   * Disable all interaction — expand/collapse, selection and drag.
   * @default false
   */
  disabled?: boolean
}

/** State + callbacks shared from `Tree` down to every recursive `TreeItem`. */
export interface TreeContext {
  nodeKey: Ref<string>
  guides: Ref<'connectors' | 'lines' | 'none'>
  draggable: Ref<boolean>
  reorderable: Ref<boolean>
  disabled: Ref<boolean>

  selected: Ref<TreeKey | null>
  /** Whether `v-model:selected` is bound — selection is inert when false. */
  selectionEnabled: Ref<boolean>
  focusedKey: Ref<TreeKey | null>

  keyOf: (node: TreeNode) => TreeKey
  labelOf: (node: TreeNode) => string
  childrenOf: (node: TreeNode) => TreeNode[]
  hasChildren: (node: TreeNode) => boolean

  isExpanded: (node: TreeNode) => boolean
  toggle: (node: TreeNode) => void
  select: (node: TreeNode) => void
  focus: (key: TreeKey) => void

  registerItem: (key: TreeKey, el: HTMLElement) => void
  unregisterItem: (key: TreeKey) => void

  // Drag-and-drop
  dragSourceKey: ComputedRef<TreeKey | null>
  dropTargetKey: ComputedRef<TreeKey | null>
  dropPosition: ComputedRef<DropPosition | null>
  onDragStart: (e: DragEvent, node: TreeNode, parent: TreeNode | null) => void
  onDragOver: (e: DragEvent, node: TreeNode) => void
  onDragLeave: (node: TreeNode) => void
  onDrop: (node: TreeNode, parent: TreeNode | null) => void
  onDragEnd: () => void
}

export const TreeContextKey: InjectionKey<TreeContext> = Symbol('TreeContext')

export interface TreeNodeSlotProps {
  node: TreeNode
  level: number
  expanded: boolean
  hasChildren: boolean
  selected: boolean
  focused: boolean
  disabled: boolean
  toggle: () => void
  select: () => void
}
