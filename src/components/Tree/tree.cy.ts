import Tree from './Tree.vue'
import { defineComponent, h, ref } from 'vue'
import type { DropInfo, TreeNode } from './types'

// Fresh data per test. The tree never writes to these objects; a few tests
// assert exactly that.
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
  it('renders only the roots when no key is expanded', () => {
    cy.mount(Tree, { props: { nodes: makeNodes(), nodeKey: 'id' } })
    cy.contains('Root').should('exist')
    cy.contains('Node A').should('not.exist')
  })

  it('opens exactly the nodes named in v-model:expanded', () => {
    cy.mount(Tree, {
      props: { nodes: makeNodes(), nodeKey: 'id', expanded: ['root'] },
    })
    cy.contains('Node A').should('exist')
    cy.contains('Node B').should('exist')
    cy.contains('Node A-1').should('not.exist')
  })

  it('follows the model when the caller changes the keys', () => {
    const keys = ref<string[]>([])
    cy.mount({
      render: () =>
        h(Tree, { nodes: makeNodes(), nodeKey: 'id', expanded: keys.value }),
    })
    cy.contains('Node A').should('not.exist')
    cy.then(() => {
      keys.value = ['root', 'a']
    })
    cy.contains('Node A-1').should('exist')
  })

  it('opens a key whose children arrive later', () => {
    const data = ref<TreeNode[]>([])
    cy.mount({
      render: () =>
        h(Tree, { nodes: data.value, nodeKey: 'id', expanded: ['root', 'a'] }),
    })
    cy.contains('Node A').should('not.exist')
    cy.then(() => {
      data.value = makeNodes()
    })
    cy.contains('Node A').should('exist')
    cy.contains('Node A-1').should('exist')
  })

  it('emits a fresh array on toggle and leaves the nodes untouched', () => {
    const nodes = makeNodes()
    const keys = ['root']
    const onUpdate = cy.stub().as('update')
    cy.mount(Tree, {
      props: {
        nodes,
        nodeKey: 'id',
        expanded: keys,
        'onUpdate:expanded': onUpdate,
      },
    })
    cy.contains('[data-slot="row"]', 'Node A').click()
    cy.get('@update').should('have.been.calledWith', ['root', 'a'])
    cy.get('@update').then((stub: any) => {
      // A new array, so a shallow watcher on the caller's state fires.
      expect(stub.firstCall.args[0]).to.not.equal(keys)
      expect(keys).to.deep.eq(['root'])
      // And nothing was written onto the caller's node objects.
      expect(Object.keys(nodes[0])).to.deep.eq(['id', 'label', 'children'])
      expect(Object.keys((nodes[0].children as TreeNode[])[0])).to.deep.eq([
        'id',
        'label',
        'children',
      ])
    })
  })

  it('toggles via the chevron', () => {
    cy.mount(Tree, {
      props: { nodes: makeNodes(), nodeKey: 'id', expanded: ['root'] },
    })
    cy.contains('Node A').should('exist')
    cy.get('[data-slot="toggle"]').first().click()
    cy.contains('Node A').should('not.exist')
    cy.get('[data-slot="toggle"]').first().click()
    cy.contains('Node A').should('exist')
  })

  it('toggles expansion by clicking the row', () => {
    cy.mount(Tree, {
      props: { nodes: makeNodes(), nodeKey: 'id', expanded: ['root'] },
    })
    cy.contains('Node A').should('exist')
    cy.contains('[data-slot="row"]', 'Root').click()
    cy.contains('Node A').should('not.exist')
    cy.contains('[data-slot="row"]', 'Root').click()
    cy.contains('Node A').should('exist')
  })

  it('keeps every key when calls stack up under a bound v-model', () => {
    // A bound model round-trips through the parent, so the prop lags a render.
    // Consecutive calls must still accumulate rather than overwrite.
    const keys = ref<string[]>([])
    const tree = ref<any>(null)
    const Parent = defineComponent({
      setup: () => () =>
        h(Tree, {
          ref: tree,
          nodes: makeNodes(),
          nodeKey: 'id',
          expanded: keys.value,
          'onUpdate:expanded': (value: string[]) => (keys.value = value),
        }),
    })
    cy.mount(Parent)
    cy.then(() => {
      tree.value.expand('root')
      tree.value.expand('a')
    })
    cy.then(() => expect(keys.value).to.deep.eq(['root', 'a']))
    cy.contains('Node A-1').should('exist')
  })

  it('expandAll keeps keys whose children have not loaded', () => {
    const tree = ref<any>(null)
    const keys = ref<string[]>(['lazy'])
    const data = ref<TreeNode[]>([{ id: 'lazy', label: 'Lazy' }])
    cy.mount({
      render: () =>
        h(Tree, {
          ref: tree,
          nodes: data.value,
          nodeKey: 'id',
          expanded: keys.value,
          'onUpdate:expanded': (value: string[]) => (keys.value = value),
        }),
    })
    cy.then(() => tree.value.expandAll())
    // `lazy` has no children yet, so expandAll cannot see it — it must survive.
    cy.then(() => expect(keys.value).to.include('lazy'))
    cy.then(() => {
      data.value = [
        {
          id: 'lazy',
          label: 'Lazy',
          children: [{ id: 'late', label: 'Late' }],
        },
      ]
    })
    cy.contains('Late').should('exist')
  })

  it('warns instead of throwing on the removed boolean model', () => {
    cy.window().then((win) => cy.spy(win.console, 'warn').as('warn'))
    cy.mount(Tree, {
      props: { nodes: makeNodes(), nodeKey: 'id', expanded: true as any },
    })
    cy.contains('Root').should('exist')
    cy.contains('Node A').should('not.exist')
    cy.get('@warn').should(
      'have.been.calledWithMatch',
      /boolean `v-model:expanded`/,
    )
  })

  it('expands and collapses everything through the exposed methods', () => {
    const tree = ref<any>(null)
    cy.mount({
      render: () => h(Tree, { ref: tree, nodes: makeNodes(), nodeKey: 'id' }),
    })
    cy.contains('Node A').should('not.exist')
    cy.then(() => tree.value.expandAll())
    cy.contains('Node A-1').should('exist')
    cy.then(() => tree.value.collapseAll())
    cy.contains('Node A').should('not.exist')
    cy.then(() => tree.value.expand('root'))
    cy.contains('Node A').should('exist')
    cy.contains('Node A-1').should('not.exist')
    cy.then(() => tree.value.toggle('root'))
    cy.contains('Node A').should('not.exist')
  })

  it('exposes ARIA tree semantics', () => {
    cy.mount(Tree, {
      props: { nodes: makeNodes(), nodeKey: 'id', expanded: ['root', 'a'] },
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
    cy.mount(Tree, {
      props: { nodes: makeNodes(), nodeKey: 'id', expanded: ['root', 'a'] },
    })
    // Root is the only tabbable item initially.
    cy.get('[role="treeitem"]').first().focus()
    cy.focused().should('contain', 'Root')
    // Root and Node A are open; Down steps into the first child.
    cy.focused().trigger('keydown', { key: 'ArrowDown' })
    cy.focused().should('contain', 'Node A')
    // Left collapses the expanded node, Left again steps to the parent.
    cy.focused().trigger('keydown', { key: 'ArrowLeft' }) // collapse A
    cy.focused().trigger('keydown', { key: 'ArrowLeft' }) // -> Root
    cy.focused().should('contain', 'Root')
  })

  it('toggles expansion with Enter/Space', () => {
    cy.mount(Tree, {
      props: { nodes: makeNodes(), nodeKey: 'id', expanded: ['root'] },
    })
    cy.get('[role="treeitem"]').first().focus()
    cy.focused().should('contain', 'Root')
    cy.focused().trigger('keydown', { key: 'Enter' })
    cy.contains('Node A').should('not.exist')
    cy.focused().trigger('keydown', { key: 'Enter' })
    cy.contains('Node A').should('exist')
  })

  it('lets the browser keep modified arrow keys', () => {
    cy.mount(Tree, { props: { nodes: makeNodes(), nodeKey: 'id' } })
    cy.get('[role="treeitem"]').first().focus()
    cy.focused().should('contain', 'Root')
    // A modified key must not preventDefault — the tree focus must not move
    // (the browser would handle Alt/Cmd+Arrow, Ctrl+Home/End itself).
    cy.focused().trigger('keydown', { key: 'ArrowDown', altKey: true })
    cy.focused().should('contain', 'Root')
    cy.focused().trigger('keydown', { key: 'ArrowDown', metaKey: true })
    cy.focused().should('contain', 'Root')
    // Ctrl+End, not Ctrl+Home: focus starts on the first row, so an unguarded
    // Home would land back on Root and the assertion could never fail.
    cy.focused().trigger('keydown', { key: 'End', ctrlKey: true })
    cy.focused().should('contain', 'Root')
  })

  it('renders custom item-label and item-prefix/item-suffix slots', () => {
    cy.mount(Tree, {
      props: { nodes: makeNodes(), nodeKey: 'id', expanded: ['root', 'a'] },
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
      props: { nodes: makeNodes(), nodeKey: 'id', expanded: ['root', 'a'] },
    })
    cy.get('[role="group"]')
      .first()
      .should(($ul) => {
        expect(parseFloat($ul.css('padding-left'))).to.be.greaterThan(0)
      })
  })

  it('freezes expand/collapse and drag when disabled', () => {
    cy.mount(Tree, {
      props: {
        nodes: makeNodes(),
        nodeKey: 'id',
        expanded: ['root'],
        disabled: true,
        draggable: true,
      },
    })
    cy.contains('Node A').should('exist')
    cy.get('[data-slot="toggle"]').first().click()
    cy.contains('Node A').should('exist') // click had no effect
    cy.contains('[role="treeitem"]', 'Root').should(
      'have.attr',
      'data-disabled',
    )
    cy.get('[data-slot="row"]')
      .first()
      .should('have.attr', 'draggable', 'false')
  })

  it('renders connector guides', () => {
    cy.mount(Tree, {
      props: {
        nodes: makeNodes(),
        nodeKey: 'id',
        expanded: ['root', 'a'],
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
        expanded: ['root', 'a'],
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
