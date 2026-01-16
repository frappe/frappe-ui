import TextEditor from './TextEditor.vue'

describe('<TextEditor />', () => {
  it('renders with initial content', () => {
    cy.mount(TextEditor, {
      props: {
        content: '<p>Hello World</p>',
      },
    })

    // Tiptap renders content inside a contenteditable div
    cy.get('.ProseMirror').should('contain.html', 'Hello World')
    cy.get('.ProseMirror').should('contain.text', 'Hello World')
  })

  it('emits change event on update', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy')

    cy.mount(TextEditor, {
      props: {
        content: '<p>Initial</p>',
        onChange: onChangeSpy,
      },
    })

    // Simulate typing: clear and type
    cy.get('.ProseMirror').clear().type('Updated')

    // Check if spy was called
    cy.get('@onChangeSpy').should('have.been.called')
    // Verify payload (might be partial or final depending on when spy was called, but at least one call should have expected HTML)
    cy.get('@onChangeSpy').should((spy) => {
      expect(spy.lastCall.args[0]).to.include('Updated')
    })
  })

  it('renders placeholder when empty', () => {
    cy.mount(TextEditor, {
      props: {
        content: '',
        placeholder: 'Enter text...',
      },
    })

    // Tiptap placeholder extension usually adds a data-placeholder attribute or a specific class
    cy.get('.ProseMirror p.is-editor-empty').should(
      'have.attr',
      'data-placeholder',
      'Enter text...',
    )
  })

  it('respects editable prop', () => {
    cy.mount(TextEditor, {
      props: {
        content: 'Read only',
        editable: false,
      },
    })

    cy.get('.ProseMirror').should('have.attr', 'contenteditable', 'false')
  })

  it('renders slots', () => {
    cy.mount(TextEditor, {
      slots: {
        top: '<div>Top Slot</div>',
        bottom: '<div>Bottom Slot</div>',
      },
    })

    cy.contains('Top Slot').should('exist')
    cy.contains('Bottom Slot').should('exist')
  })

  it('renders fixed menu when enabled', () => {
    cy.mount(TextEditor, {
      props: {
        fixedMenu: true,
      },
    })

    // The fixed menu component in TextEditor.vue has these specific classes
    cy.get('.rounded-t-lg.border.border-outline-gray-modals').should('exist')
    // Should contain some default buttons like Bold
    cy.get('button[title="Bold"]').should('exist')
  })

  it('supports mentions', () => {
    const users = [
      { id: '1', label: 'John Doe' },
      { id: '2', label: 'Jane Smith' },
    ]

    cy.mount(TextEditor, {
      props: {
        mentions: users,
      },
    })

    // Type @ to trigger mention list
    cy.get('.ProseMirror').type('Hi @')

    // Verify suggestion list is visible
    cy.get('button').contains('John Doe').should('be.visible')
    cy.get('button').contains('Jane Smith').should('be.visible')

    // Filter
    cy.get('.ProseMirror').type('Jo')
    cy.get('button').contains('John Doe').should('be.visible')
    cy.get('button').contains('Jane Smith').should('not.exist')

    // Select via Enter
    cy.get('.ProseMirror').type('{enter}')

    // Check insertion
    cy.get('.ProseMirror span.mention').should(
      'have.attr',
      'data-label',
      'John Doe',
    )
    cy.get('.ProseMirror').should('contain.text', '@John Doe')

    // Verify suggestion list is hidden
    cy.get('button:contains("John Doe")').should('not.exist')
  })
  it('supports tags via #', () => {
    const tags = [{ label: 'Bug' }, { label: 'Feature' }]

    cy.mount(TextEditor, {
      props: { tags },
    })

    // Type #
    cy.get('.ProseMirror').type('#')

    // Check existing tags
    cy.get('button').contains('Bug').should('be.visible')

    // Type new tag
    cy.get('.ProseMirror').type('NewTag')
    cy.get('button').contains('New tag: "NewTag"').should('be.visible')

    // Select
    cy.get('.ProseMirror').type('{enter}')

    // Verify insertion
    cy.get('.ProseMirror span.tag-item').should(
      'have.attr',
      'data-tag-label',
      'NewTag',
    )
    cy.get('.ProseMirror').should('contain.text', '#NewTag')

    // Verify list is hidden
    cy.get('button:contains("New tag")').should('not.exist')
  })

  it('supports slash commands via /', () => {
    cy.mount(TextEditor)

    // Type /
    cy.get('.ProseMirror').type('/')

    // Check menu
    cy.get('button').contains('Heading 2').should('be.visible')
    cy.get('button').contains('Bullet List').should('be.visible')

    // Filter
    cy.get('.ProseMirror').type('Head')
    cy.get('button').contains('Heading 2').should('be.visible')
    // should not contain Bullet List anymore (filtered out)
    cy.get('button').contains('Bullet List').should('not.exist')

    // Select Heading 2
    cy.get('.ProseMirror').type('{enter}')

    // Verify format change (p -> h2)
    cy.get('.ProseMirror h2').should('exist')
  })
})
