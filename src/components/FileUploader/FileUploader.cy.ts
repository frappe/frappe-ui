import { h } from 'vue'
import FileUploader from './FileUploader.vue'

const testFile = {
  contents: Cypress.Buffer.from('hello'),
  fileName: 'hello.txt',
  mimeType: 'text/plain',
}

describe('FileUploader', () => {
  it('renders the default trigger button', () => {
    cy.mount(FileUploader)
    cy.get('button').should('contain.text', 'Upload File')
    cy.get('input[type=file]').should('exist').and('have.class', 'hidden')
  })

  it('uploads selected files as private by default', () => {
    cy.intercept('POST', '/api/method/upload_file', (req) => {
      expect(String(req.body)).to.include('name="is_private"')
      expect(String(req.body)).to.include('1')
      req.reply({ message: { file_url: '/files/hello.txt' } })
    }).as('upload')

    cy.mount(FileUploader, {
      props: {
        onSuccess: cy.spy().as('onSuccess'),
      },
    })

    cy.get('input[type=file]').selectFile(testFile, { force: true })
    cy.wait('@upload')
    cy.get('@onSuccess').should('have.been.calledOnce')
  })

  it('lets the private prop override the default', () => {
    cy.intercept('POST', '/api/method/upload_file', (req) => {
      expect(String(req.body)).to.include('name="is_private"')
      expect(String(req.body)).to.include('0')
      req.reply({ message: { file_url: '/files/hello.txt' } })
    }).as('upload')

    cy.mount(FileUploader, {
      props: { private: false },
    })

    cy.get('input[type=file]').selectFile(testFile, { force: true })
    cy.wait('@upload')
  })

  it('passes flat props through to the upload request', () => {
    cy.intercept('POST', '/api/method/upload_file', (req) => {
      const body = String(req.body)
      expect(body).to.include('name="folder"')
      expect(body).to.include('Attachments')
      expect(body).to.include('name="doctype"')
      expect(body).to.include('ToDo')
      req.reply({ message: { file_url: '/files/hello.txt' } })
    }).as('upload')

    cy.mount(FileUploader, {
      props: { folder: 'Attachments', doctype: 'ToDo', docname: 'TODO-001' },
    })

    cy.get('input[type=file]').selectFile(testFile, { force: true })
    cy.wait('@upload')
  })

  it('blocks upload when validation returns an error message', () => {
    cy.intercept('POST', '/api/method/upload_file').as('upload')

    cy.mount(FileUploader, {
      props: {
        validateFile: () => 'Only PDFs are allowed',
      },
    })

    cy.get('input[type=file]').selectFile(testFile, { force: true })
    cy.contains('Only PDFs are allowed').should('exist')
    cy.get('@upload.all').should('have.length', 0)
  })

  it('emits failure when validateFile rejects the file', () => {
    cy.intercept('POST', '/api/method/upload_file').as('upload')

    cy.mount(FileUploader, {
      props: {
        validateFile: () => 'Only PDFs are allowed',
        onFailure: cy.spy().as('onFailure'),
      },
    })

    cy.get('input[type=file]').selectFile(testFile, { force: true })
    cy.get('@upload.all').should('have.length', 0)
    cy.get('@onFailure')
      .should('have.been.calledOnce')
      .and('have.been.calledWith', 'Only PDFs are allowed')
  })

  it('renders the error via the custom slot when provided', () => {
    cy.mount(FileUploader, {
      props: {
        validateFile: () => 'Only PDFs are allowed',
      },
      slots: {
        default: ({ error, openFileSelector }: any) =>
          h('div', [
            h('button', { onClick: openFileSelector }, 'Upload'),
            error ? h('p', { 'data-cy': 'error' }, String(error)) : null,
          ]),
      },
    })

    cy.get('input[type=file]').selectFile(testFile, { force: true })
    cy.get('[data-cy=error]').should('have.text', 'Only PDFs are allowed')
  })

  it('flips data-state through the upload lifecycle', () => {
    cy.intercept('POST', '/api/method/upload_file', (req) => {
      req.reply({ message: { file_url: '/files/hello.txt' } })
    }).as('upload')

    cy.mount(FileUploader)
    cy.get('[data-slot=root]').should('have.attr', 'data-state', 'idle')
    cy.get('input[type=file]').selectFile(testFile, { force: true })
    cy.wait('@upload')
    cy.get('[data-slot=root]').should('have.attr', 'data-state', 'success')
  })

  it('sets data-state to error on a failed upload', () => {
    cy.intercept('POST', '/api/method/upload_file', {
      statusCode: 500,
      body: {},
    }).as('upload')

    cy.mount(FileUploader)
    cy.get('input[type=file]').selectFile(testFile, { force: true })
    cy.wait('@upload')
    cy.get('[data-slot=root]').should('have.attr', 'data-state', 'error')
  })

  it('the default trigger is a real button, reachable by keyboard', () => {
    cy.mount(FileUploader)
    cy.get('button').should('not.have.attr', 'tabindex')
    cy.get('button').focus().should('have.focus')
  })
})
