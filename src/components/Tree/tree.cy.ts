import { h } from 'vue'

import Tree from './Tree.vue'
import type { TreeNode } from './types'

const data: TreeNode = {
  id: 'root',
  label: 'Root',
  children: [
    {
      id: 'a',
      label: 'Node A',
      children: [
        {
          id: 'a-1',
          label: 'Node A-1',
          children: [],
        },
      ],
    },
    {
      id: 'b',
      label: 'Node B',
      children: [],
    },
  ],
}

describe('Tree', () => {
  it('renders root node', () => {
    cy.mount(Tree, {
      props: {
        node: data,
        nodeKey: 'id',
      },
    })

    cy.contains('Root').should('exist')
    cy.contains('Node A').should('not.exist')
  })

  it('expand / collapse', () => {
    cy.mount(Tree, {
      props: {
        node: data,
        nodeKey: 'id',
        options: {
          defaultCollapsed: true,
        },
      },
    })

    // collapse nodes
    cy.contains('Node A').should('not.exist')

    cy.contains('Root').click()
    cy.contains('Node A').should('exist')
    cy.contains('Node B').should('exist')

    cy.contains('Node A').click()
    cy.contains('Node A-1').should('exist')

    cy.contains('Node A').click()
    cy.contains('Node A-1').should('not.exist')
  })

  it('renders recursively', () => {
    cy.mount(Tree, {
      props: {
        node: data,
        nodeKey: 'id',
        options: {
          defaultCollapsed: false,
        },
      },
    })

    cy.contains('Root').should('exist')
    cy.contains('Node A').should('exist')
    cy.contains('Node A-1').should('exist')
    cy.contains('Node B').should('exist')
  })

  it('options: rowHeight & indentation guides', () => {
    cy.mount(Tree, {
      props: {
        node: data,
        nodeKey: 'id',
        options: {
          rowHeight: '40px',
          showIndentationGuides: true,
          defaultCollapsed: false,
        },
      },
    })

    cy.contains('Root').parent().should('have.css', 'height', '40px')

    // indentation line
    cy.get('.border-r').should('exist')
  })

  it('slots', () => {
    cy.mount(Tree, {
      props: {
        node: data,
        nodeKey: 'id',
        options: { defaultCollapsed: false },
      },
      slots: {
        label: ({ node }: any) =>
          h(
            'span',
            {
              'data-cy': `label-${node.id}`,
            },
            `label-${node.label}`,
          ),

        icon: () => h('span', { 'data-cy': 'icon' }, 'icon'),
      },
    })

    cy.get('[data-cy="label-root"]').should('exist')
    cy.get('[data-cy="label-a"]').should('exist')
    cy.get('[data-cy="label-b"]').should('exist')
    cy.get('[data-cy="icon"]').should('exist')
  })

  it('does not toggle when node has no children', () => {
    cy.mount(Tree, {
      props: {
        node: data,
        nodeKey: 'id',
        options: { defaultCollapsed: false },
      },
    })

    cy.contains('Node B').click()
    cy.contains('Node B').should('exist')
  })
})
