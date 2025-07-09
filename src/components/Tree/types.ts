export type TreeNode = {
  label: string
  children: TreeNode[]
  // added TreeNode[] due to enforcement that dynamic key types should accommodate all static key types
  [nodeKey: string]: string | number | TreeNode[]
}

export type TreeOptions = {
  rowHeight?: string
  indentWidth?: string
  showIndentationGuides?: boolean
}

export interface TreeProps {
  node: TreeNode
  nodeKey: string
  options?: TreeOptions
}
