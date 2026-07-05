import { h } from 'vue'
import FileUploader from './FileUploader.vue'

const testFile = {
  contents: Cypress.Buffer.from('hello'),
  fileName: 'hello.txt',
  mimeType: 'text/plain',
}

describe('FileUploader', () => {
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

  it('lets uploadArgs override the private default', () => {
    cy.intercept('POST', '/api/method/upload_file', (req) => {
      expect(String(req.body)).to.include('name="is_private"')
      expect(String(req.body)).to.include('0')
      req.reply({ message: { file_url: '/files/hello.txt' } })
    }).as('upload')

    cy.mount(FileUploader, {
      props: {
        uploadArgs: { private: false },
      },
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
    cy.get('@upload.all').should('have.length', 0)
  })
})
