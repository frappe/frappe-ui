import Tree from './Tree.vue'
import { h, ref } from 'vue'
import type { MoveEvent, TreeNode } from './types'

const nodes: TreeNode[] = [
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

describe('Tree', () => {
  it('renders roots collapsed by default', () => {
    cy.mount(Tree, { props: { nodes, nodeKey: 'id' } })
    cy.contains('Root').should('exist')
    cy.contains('Node A').should('not.exist')
  })

  it('expands all when defaultExpanded is set', () => {
    cy.mount(Tree, { props: { nodes, nodeKey: 'id', defaultExpanded: true } })
    cy.contains('Root').should('exist')
    cy.contains('Node A').should('exist')
    cy.contains('Node A-1').should('exist')
    cy.contains('Node B').should('exist')
  })

  it('toggles via the chevron', () => {
    cy.mount(Tree, { props: { nodes, nodeKey: 'id' } })
    cy.contains('Node A').should('not.exist')
    cy.get('[data-slot="toggle"]').first().click()
    cy.contains('Node A').should('exist')
    cy.contains('Node B').should('exist')
  })

  it('drives expansion through v-model:expanded', () => {
    const expanded = ref<string[]>(['root'])
    cy.mount(Tree, {
      props: {
        nodes,
        nodeKey: 'id',
        expanded: expanded.value,
        'onUpdate:expanded': (v: string[]) => (expanded.value = v),
      },
    })
    cy.contains('Node A').should('exist')
    cy.contains('Node A-1').should('not.exist')
  })

  it('selects a node (aria-selected) and emits update:selected', () => {
    const onUpdate = cy.stub().as('select')
    cy.mount(Tree, {
      props: {
        nodes,
        nodeKey: 'id',
        defaultExpanded: true,
        'onUpdate:selected': onUpdate,
      },
    })
    cy.contains('Node A').click()
    cy.get('[role="treeitem"][aria-selected="true"]').should(
      'contain',
      'Node A',
    )
    cy.get('@select').should('have.been.calledWith', 'a')
  })

  it('does not select or highlight when v-model:selected is unbound', () => {
    cy.mount(Tree, { props: { nodes, nodeKey: 'id', defaultExpanded: true } })
    cy.contains('Node A').click()
    cy.get('[data-selected]').should('not.exist')
    cy.get('[role="treeitem"][aria-selected]').should('not.exist')
  })

  it('exposes ARIA tree semantics', () => {
    cy.mount(Tree, { props: { nodes, nodeKey: 'id', defaultExpanded: true } })
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
    cy.mount(Tree, { props: { nodes, nodeKey: 'id' } })
    // Root is the only tabbable item initially.
    cy.get('[role="treeitem"]').first().focus()
    cy.focused().should('contain', 'Root')
    // Right expands, Down moves into children.
    cy.focused().trigger('keydown', { key: 'ArrowRight' })
    cy.focused().trigger('keydown', { key: 'ArrowDown' })
    cy.focused().should('contain', 'Node A')
    // Left on a collapsed leaf-parent collapses; Left again goes to parent.
    cy.focused().trigger('keydown', { key: 'ArrowRight' }) // expand A
    cy.focused().trigger('keydown', { key: 'ArrowLeft' }) // collapse A
    cy.focused().trigger('keydown', { key: 'ArrowLeft' }) // -> Root
    cy.focused().should('contain', 'Root')
  })

  it('renders custom label and prefix/suffix slots', () => {
    cy.mount(Tree, {
      props: { nodes, nodeKey: 'id', defaultExpanded: true },
      slots: {
        label: ({ node }: any) =>
          h('span', { 'data-cy': `label-${node.id}` }, `label-${node.label}`),
        suffix: ({ node }: any) =>
          h('span', { 'data-cy': `suffix-${node.id}` }, '★'),
      },
    })
    cy.get('[data-cy="label-root"]').should('exist')
    cy.get('[data-cy="suffix-a"]').should('exist')
  })

  it('renders connector guides', () => {
    cy.mount(Tree, {
      props: {
        nodes,
        nodeKey: 'id',
        defaultExpanded: true,
        guides: 'connectors',
      },
    })
    cy.get('[role="tree"]').should('have.attr', 'data-guides', 'connectors')
    cy.get('[role="group"]').should('exist')
  })

  describe('drag and drop', () => {
    function dndProps(onMove: (m: MoveEvent) => void, extra = {}) {
      return {
        nodes,
        nodeKey: 'id',
        defaultExpanded: true,
        draggable: true,
        onMove,
        ...extra,
      }
    }

    function drag(sourceLabel: string, targetLabel: string) {
      const dataTransfer = new DataTransfer()
      cy.contains('[data-slot="row"]', sourceLabel).trigger('dragstart', {
        dataTransfer,
      })
      cy.contains('[data-slot="row"]', targetLabel).trigger('dragover', {
        dataTransfer,
        clientY: 0,
      })
      cy.contains('[data-slot="row"]', targetLabel).trigger('drop', {
        dataTransfer,
      })
    }

    it('emits move on a valid reparent', () => {
      const onMove = cy.stub().as('move')
      cy.mount(Tree, { props: dndProps(onMove) })
      drag('Node B', 'Node A')
      cy.get('@move').should('have.been.calledOnce')
      cy.get('@move').then((stub: any) => {
        const move: MoveEvent = stub.firstCall.args[0]
        expect(move.node.id).to.eq('b')
        expect(move.to).to.eq('a')
        expect(move.position).to.eq('inside')
      })
    })

    it('blocks dropping a node into its own descendant', () => {
      const onMove = cy.stub().as('move')
      cy.mount(Tree, { props: dndProps(onMove) })
      drag('Node A', 'Node A-1')
      cy.get('@move').should('not.have.been.called')
    })

    it('respects the canDrop validator', () => {
      const onMove = cy.stub().as('move')
      cy.mount(Tree, {
        props: dndProps(onMove, { canDrop: () => false }),
      })
      drag('Node B', 'Node A')
      cy.get('@move').should('not.have.been.called')
    })
  })
})
