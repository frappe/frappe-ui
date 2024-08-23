## Props

#### Node

An object representing the Root node of the Tree. Each node must contain the
following properties:

- **label** (string) - Name of the node.

- **children** (Node[]) - An array of nodes representing the children of the
  current node.

<br>

#### Options

- **rowHeight** (string) - Line height for the nodes passed. Defaults to `25px`.

- **indentWidth** (string) - Width for the indentation at each depth of the
  tree. Gets incremented with every nested sub-tree. Defaults to `15px`.

- **showIndentationGuides** (boolean) - Flag for displaying LHS lines. Defaults
  to `true`.

<br>

## Slots

#### 1. Custom Node

Slot to optionally override the template for the entire node. It exposes the
following slot props:

- **node** (object) - The current node containing label and children attributes.

- **hasChildren** (boolean) - Whether current node is a leaf node.

- **isCollapsed** (boolean) - Whether current node is collapsed.

- **toggleCollapsed** (function) - Function to expand or collapse the node.

Example:

    // Customising node to show needed Context Menu
    <template #node="{ node, hasChildren, isCollapsed, toggleCollapsed }">
        <div class="flex items-center" @click.right="showContextMenu(node)">
        ...
        </div>
    </template>

<br>

#### 2. Custom Label / Icon

`label` and `icon` slots to quickly add custom styles without overriding the
entire node.
