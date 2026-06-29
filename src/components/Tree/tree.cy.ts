import Tree from './Tree.vue'
import { h, ref } from 'vue'
import type { DropInfo, TreeNode } from './types'

// Fresh data per test — the tree mutates `node.expanded`, so a shared const
// would leak expansion state between tests.
function makeNodes(): TreeNode[] {
  return [
    {
      id: 'root',
      label: 'Root',
      children: [
        {
          id: 'a',
          label: 'Node A',
          children: [{ id: 'a-1', label: 'Node A-1' }],
        },
        { id: 'b', label: 'Node B' },
      ],
    },
  ]
}

describe('Tree', () => {
  it('renders nodes expanded by default', () => {
    cy.mount(Tree, { props: { nodes: makeNodes(), nodeKey: 'id' } })
    cy.contains('Node A').should('exist')
    cy.contains('Node A-1').should('exist')
  })

  it('starts a node collapsed when flagged expanded: false', () => {
    const nodes = makeNodes()
    nodes[0].expanded = false
    cy.mount(Tree, { props: { nodes, nodeKey: 'id' } })
    cy.contains('Root').should('exist')
    cy.contains('Node A').should('not.exist')
  })

  it('expands all via the v-model:expanded switch', () => {
    const nodes = makeNodes()
    nodes[0].expanded = false // start collapsed; the switch should override it
    cy.mount(Tree, { props: { nodes, nodeKey: 'id', expanded: true } })
    cy.contains('Node A').should('exist')
    cy.contains('Node A-1').should('exist')
    cy.contains('Node B').should('exist')
  })

  it('expands late-arriving nodes while the switch is on', () => {
    const data = ref<TreeNode[]>([])
    cy.mount({
      render: () =>
        h(Tree, { nodes: data.value, nodeKey: 'id', expanded: true }),
    })
    cy.contains('Node A').should('not.exist')
    cy.then(() => {
      data.value = makeNodes()
    })
    cy.contains('Node A').should('exist')
    cy.contains('Node A-1').should('exist')
  })

  it('reflects the switch back to the model when a row toggles', () => {
    const onUpdate = cy.stub().as('update')
    cy.mount(Tree, {
      props: {
        nodes: makeNodes(),
        nodeKey: 'id',
        expanded: true,
        'onUpdate:expanded': onUpdate,
      },
    })
    // Collapsing one node means "not all expanded" → switch flips to false.
    cy.contains('[data-slot="row"]', 'Node A').click()
    cy.get('@update').should('have.been.calledWith', false)
  })

  it('toggles via the chevron', () => {
    cy.mount(Tree, { props: { nodes: makeNodes(), nodeKey: 'id' } })
    cy.contains('Node A').should('exist')
    cy.get('[data-slot="toggle"]').first().click()
    cy.contains('Node A').should('not.exist')
    cy.get('[data-slot="toggle"]').first().click()
    cy.contains('Node A').should('exist')
  })

  it('toggles expansion by clicking the row', () => {
    cy.mount(Tree, { props: { nodes: makeNodes(), nodeKey: 'id' } })
    cy.contains('Node A').should('exist')
    cy.contains('[data-slot="row"]', 'Root').click()
    cy.contains('Node A').should('not.exist')
    cy.contains('[data-slot="row"]', 'Root').click()
    cy.contains('Node A').should('exist')
  })

  it('exposes ARIA tree semantics', () => {
    cy.mount(Tree, {
      props: { nodes: makeNodes(), nodeKey: 'id', expanded: true },
    })
    cy.get('[role="tree"]').should('exist')
    cy.get('[role="treeitem"]').should('have.length', 4)
    cy.contains('[role="treeitem"]', 'Root')
      .should('have.attr', 'aria-expanded', 'true')
      .and('have.attr', 'aria-level', '1')
    cy.contains('[role="treeitem"]', 'Node A-1').should(
      'have.attr',
      'aria-level',
      '3',
    )
  })

  it('navigates with the keyboard', () => {
    cy.mount(Tree, { props: { nodes: makeNodes(), nodeKey: 'id' } })
    // Root is the only tabbable item initially.
    cy.get('[role="treeitem"]').first().focus()
    cy.focused().should('contain', 'Root')
    // Tree starts expanded; Down steps into the first child.
    cy.focused().trigger('keydown', { key: 'ArrowDown' })
    cy.focused().should('contain', 'Node A')
    // Left collapses the expanded node, Left again steps to the parent.
    cy.focused().trigger('keydown', { key: 'ArrowLeft' }) // collapse A
    cy.focused().trigger('keydown', { key: 'ArrowLeft' }) // -> Root
    cy.focused().should('contain', 'Root')
  })

  it('toggles expansion with Enter/Space', () => {
    cy.mount(Tree, { props: { nodes: makeNodes(), nodeKey: 'id' } })
    cy.get('[role="treeitem"]').first().focus()
    cy.focused().should('contain', 'Root')
    cy.focused().trigger('keydown', { key: 'Enter' })
    cy.contains('Node A').should('not.exist')
    cy.focused().trigger('keydown', { key: 'Enter' })
    cy.contains('Node A').should('exist')
  })

  it('renders custom item-label and item-prefix/item-suffix slots', () => {
    cy.mount(Tree, {
      props: { nodes: makeNodes(), nodeKey: 'id', expanded: true },
      slots: {
        'item-label': ({ node }: any) =>
          h('span', { 'data-cy': `label-${node.id}` }, `label-${node.label}`),
        'item-suffix': ({ node }: any) =>
          h('span', { 'data-cy': `suffix-${node.id}` }, '★'),
      },
    })
    cy.get('[data-cy="label-root"]').should('exist')
    cy.get('[data-cy="suffix-a"]').should('exist')
  })

  it('forwards class and style to the tree element', () => {
    cy.mount(Tree, {
      props: {
        nodes: makeNodes(),
        nodeKey: 'id',
        class: 'my-tree',
        style: '--tree-indent: 40px',
      },
    })
    cy.get('[role="tree"]')
      .should('have.class', 'my-tree')
      .and('have.css', 'padding', '0px')
    cy.get('[role="tree"]').then(($el) => {
      expect($el[0].style.getPropertyValue('--tree-indent')).to.eq('40px')
    })
  })

  it('indents nested groups', () => {
    cy.mount(Tree, {
      props: { nodes: makeNodes(), nodeKey: 'id', expanded: true },
    })
    cy.get('[role="group"]')
      .first()
      .should(($ul) => {
        expect(parseFloat($ul.css('padding-left'))).to.be.greaterThan(0)
      })
  })

  it('renders connector guides', () => {
    cy.mount(Tree, {
      props: {
        nodes: makeNodes(),
        nodeKey: 'id',
        expanded: true,
        guides: 'connectors',
      },
    })
    cy.get('[role="tree"]').should('have.attr', 'data-guides', 'connectors')
    cy.get('[role="group"]').should('exist')
  })

  describe('drag and drop', () => {
    function dndProps(onDragEnd: (info: DropInfo | null) => void, extra = {}) {
      return {
        nodes: makeNodes(),
        nodeKey: 'id',
        expanded: true,
        draggable: true,
        onDragEnd,
        ...extra,
      }
    }

    // Drag `sourceLabel` onto a `zone` of `targetLabel` and release.
    function dragOnto(
      sourceLabel: string,
      targetLabel: string,
      zone: 'before' | 'inside' | 'after',
    ) {
      const dataTransfer = new DataTransfer()
      cy.contains('[data-slot="row"]', sourceLabel).trigger('dragstart', {
        dataTransfer,
      })
      cy.contains('[data-slot="row"]', targetLabel).then(($el) => {
        const rect = $el[0].getBoundingClientRect()
        const clientY =
          zone === 'before'
            ? rect.top + 1
            : zone === 'after'
              ? rect.bottom - 1
              : rect.top + rect.height / 2
        cy.wrap($el).trigger('dragover', { dataTransfer, clientY })
        cy.wrap($el).trigger('drop', { dataTransfer })
      })
      cy.contains('[data-slot="row"]', sourceLabel).trigger('dragend', {
        dataTransfer,
      })
    }

    it('emits drag-end with DropInfo on a valid reparent', () => {
      const onDragEnd = cy.stub().as('dragEnd')
      cy.mount(Tree, { props: dndProps(onDragEnd) })
      dragOnto('Node B', 'Node A', 'inside')
      cy.get('@dragEnd').should('have.been.calledOnce')
      cy.get('@dragEnd').then((stub: any) => {
        const info: DropInfo = stub.firstCall.args[0]
        expect(info.node.id).to.eq('b')
        expect(info.to).to.eq('a')
        expect(info.position).to.eq('inside')
      })
    })

    it('emits drag-end with null when dropping into a descendant', () => {
      const onDragEnd = cy.stub().as('dragEnd')
      cy.mount(Tree, { props: dndProps(onDragEnd) })
      dragOnto('Node A', 'Node A-1', 'inside')
      cy.get('@dragEnd').should('have.been.calledOnceWith', null)
    })

    it('respects the move predicate', () => {
      const onDragEnd = cy.stub().as('dragEnd')
      cy.mount(Tree, {
        props: dndProps(onDragEnd, { move: () => false }),
      })
      dragOnto('Node B', 'Node A', 'inside')
      cy.get('@dragEnd').should('have.been.calledOnceWith', null)
    })

    it('reports the final post-removal index when reordering down', () => {
      const onDragEnd = cy.stub().as('dragEnd')
      cy.mount(Tree, { props: dndProps(onDragEnd) })
      // Drag Node A (index 0) to AFTER Node B (index 1) within the same parent.
      dragOnto('Node A', 'Node B', 'after')
      cy.get('@dragEnd').then((stub: any) => {
        const info: DropInfo = stub.firstCall.args[0]
        expect(info.node.id).to.eq('a')
        expect(info.position).to.eq('after')
        expect(info.oldIndex).to.eq(0)
        // Source was before the target, so the final index is 1, not 2.
        expect(info.newIndex).to.eq(1)
      })
    })
  })
})
