import CodeEditor from './CodeEditor.vue'

// CodeMirror lazy-loads in `onMounted` (dynamic imports) and renders into a
// `.cm-editor` with a contenteditable `.cm-content`. Cypress retries `cy.get`
// until that async mount settles, so no explicit wait is needed.

describe('CodeEditor', () => {
  it('mounts the editor with the initial document', () => {
    cy.mount(CodeEditor, { props: { modelValue: 'const a = 1' } })
    cy.get('.cm-editor').should('exist')
    cy.get('.cm-content').should('contain.text', 'const a = 1')
  })

  it('emits update:modelValue live while typing', () => {
    cy.mount(CodeEditor, {
      props: {
        modelValue: '',
        'onUpdate:modelValue': cy.stub().as('update'),
      },
    })
    cy.get('.cm-content').type('hello')
    cy.get('@update').should('have.been.called')
    // The last emit carries the full document.
    cy.get('@update')
      .its('lastCall.args.0')
      .should('eq', 'hello')
  })

  it('emits change only on blur (commit), not on every keystroke', () => {
    cy.mount(CodeEditor, {
      props: {
        modelValue: '',
        onChange: cy.stub().as('change'),
      },
    })
    cy.get('.cm-content').type('draft')
    // No commit while focused.
    cy.get('@change').should('not.have.been.called')
    cy.get('.cm-content').blur()
    cy.get('@change').should('have.been.calledOnceWith', 'draft')
  })

  it('Escape blurs the editor so the keyboard trap has an exit (commits)', () => {
    cy.mount(CodeEditor, {
      props: { modelValue: '', onChange: cy.stub().as('change') },
    })
    cy.get('.cm-content').type('x')
    cy.get('.cm-content').trigger('keydown', { key: 'Escape' })
    cy.get('@change').should('have.been.calledOnceWith', 'x')
  })

  it('does not emit update:modelValue when synced from the prop', () => {
    // Updating modelValue externally must not echo back out as fresh input.
    cy.mount(CodeEditor, {
      props: {
        modelValue: 'one',
        'onUpdate:modelValue': cy.stub().as('update'),
      },
    }).then(({ wrapper }) => {
      wrapper.setProps({ modelValue: 'one two three' })
      cy.get('.cm-content').should('contain.text', 'one two three')
      cy.get('@update').should('not.have.been.called')
    })
  })

  it('is not editable when readonly', () => {
    cy.mount(CodeEditor, {
      props: { modelValue: 'frozen', readonly: true },
    })
    cy.get('.cm-content').should('have.attr', 'contenteditable', 'false')
    cy.get('.code-editor').should('have.attr', 'data-disabled', 'true')
  })

  it('swaps readonly at runtime without recreating the view', () => {
    cy.mount(CodeEditor, {
      props: { modelValue: 'frozen', readonly: true },
    }).then(({ wrapper }) => {
      cy.get('.cm-content').should('have.attr', 'contenteditable', 'false')
      wrapper.setProps({ readonly: false })
      cy.get('.cm-content').should('have.attr', 'contenteditable', 'true')
    })
  })

  it('reflects variant and size on the data-* hooks', () => {
    cy.mount(CodeEditor, {
      props: { modelValue: '', variant: 'outline', size: 'lg' },
    })
    cy.get('.code-editor').should('have.attr', 'data-variant', 'outline')
    cy.get('.code-editor').should('have.attr', 'data-size', 'lg')
  })

  describe('labeling contract', () => {
    it('renders the label and wires aria onto the contentDOM', () => {
      cy.mount(CodeEditor, {
        props: {
          modelValue: '',
          label: 'Config',
          description: 'JSON config',
        },
      })
      cy.contains('label', 'Config').should('exist')
      cy.get('.cm-content').then(($el) => {
        const describedBy = $el.attr('aria-describedby')
        expect(describedBy).to.be.ok
        cy.get(`#${describedBy}`).should('contain.text', 'JSON config')
      })
    })

    it('marks the contentDOM invalid and shows the error', () => {
      cy.mount(CodeEditor, {
        props: { modelValue: '', error: 'Invalid JSON' },
      })
      cy.get('.cm-content').should('have.attr', 'aria-invalid', 'true')
      cy.get('.code-editor').should('have.attr', 'data-state', 'invalid')
      cy.contains('Invalid JSON').should('exist')
    })

    it('forwards required onto aria-required', () => {
      cy.mount(CodeEditor, {
        props: { modelValue: '', label: 'Body', required: true },
      })
      cy.get('.cm-content').should('have.attr', 'aria-required', 'true')
    })
  })

  describe('overflow', () => {
    const longDoc = Array.from({ length: 40 }, (_, i) => `line ${i}`).join('\n')

    it('emits overflow=true when content exceeds maxHeight', () => {
      cy.mount(CodeEditor, {
        props: {
          modelValue: longDoc,
          maxHeight: '6rem',
          onOverflow: cy.stub().as('overflow'),
        },
      })
      cy.get('@overflow').should('have.been.calledWith', true)
    })

    it('does not emit overflow when content fits', () => {
      cy.mount(CodeEditor, {
        props: {
          modelValue: 'short',
          maxHeight: '20rem',
          onOverflow: cy.stub().as('overflow'),
        },
      })
      // Give the ResizeObserver/mount a beat, then assert it stayed quiet.
      cy.get('.cm-editor').should('exist')
      cy.get('@overflow').should('not.have.been.calledWith', true)
    })
  })
})
