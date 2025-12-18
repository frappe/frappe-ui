export type TreeNode = {
  label: string
  children: TreeNode[]
  // added TreeNode[] due to enforcement that dynamic key types should accommodate all static key types
  [nodeKey: string]: string | number | TreeNode[]
}

export interface TreeProps {
  /**
   * Root tree node to render.
   * Can contain nested children to form the tree structure.
   */
  node: TreeNode

  /**
   * Unique key used to identify each node.
   * Usually an id-like property present on every node.
   */
  nodeKey: string

  /**
   * Optional configuration for tree layout and behavior.
   */
  options?: TreeOptions
}

export type TreeOptions = {
  /**
   * Height of each tree row (e.g. "32px").
   */
  rowHeight?: string

  /**
   * Horizontal indentation per tree level.
   */
  indentWidth?: string

  /**
   * Whether to show vertical indentation guide lines.
   */
  showIndentationGuides?: boolean

  /**
   * Whether tree nodes should be collapsed by default.
   */
  defaultCollapsed?: boolean
}
