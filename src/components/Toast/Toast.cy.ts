import { h } from 'vue'
import { Toaster as SonnerToaster } from 'vue-sonner'
import { toast, Toast, Toaster } from '../../index'
import FrappeUIProvider from '../Provider/FrappeUIProvider.vue'

describe('Toast v1 — vue-sonner integration', () => {
  // ---- public exports -------------------------------------------------------

  it('toast is the vue-sonner imperative namespace', () => {
    expect(typeof toast.success).to.equal('function')
    expect(typeof toast.error).to.equal('function')
    expect(typeof toast.warning).to.equal('function')
    expect(typeof toast.info).to.equal('function')
    expect(typeof toast.loading).to.equal('function')
    expect(typeof toast.message).to.equal('function')
    expect(typeof toast.promise).to.equal('function')
    expect(typeof toast.custom).to.equal('function')
    expect(typeof toast.dismiss).to.equal('function')
  })

  it('Toaster re-export resolves to the vue-sonner Toaster', () => {
    expect(Toaster).to.equal(SonnerToaster)
  })

  it('Toast back-compat export still resolves', () => {
    expect(Toast).to.not.be.undefined
  })

  it('removed APIs (toast.create / toast.remove / toast.removeAll) are not present', () => {
    expect((toast as any).create).to.be.undefined
    expect((toast as any).remove).to.be.undefined
    expect((toast as any).removeAll).to.be.undefined
  })

  // ---- FrappeUIProvider mounts a Toaster ------------------------------------

  it('FrappeUIProvider renders a [data-sonner-toaster] element', () => {
    cy.mount(FrappeUIProvider)
    cy.get('[data-sonner-toaster]').should('exist')
  })

  it('Toaster bakes in position=bottom-right', () => {
    cy.mount(FrappeUIProvider)
    cy.get('[data-sonner-toaster]')
      .should('have.attr', 'data-x-position', 'right')
      .and('have.attr', 'data-y-position', 'bottom')
  })

  it('Toaster bakes in visibleToasts=3', () => {
    cy.mount(FrappeUIProvider)
    cy.get('[data-sonner-toaster]').should(
      'have.attr',
      'data-visible-toasts',
      '3',
    )
  })

  // ---- imperative API shows toasts in the DOM -------------------------------

  it('toast.success mounts a toast node after FrappeUIProvider is rendered', () => {
    cy.mount(FrappeUIProvider)
    cy.then(() => {
      toast.success('Workspace created')
    })
    cy.get('[data-sonner-toast]').should('exist')
    cy.contains('Workspace created').should('exist')
  })

  it('toast.error renders in the DOM', () => {
    cy.mount(FrappeUIProvider)
    cy.then(() => {
      toast.error('Something went wrong')
    })
    cy.contains('Something went wrong').should('exist')
  })

  it('toast.dismiss removes the toast from the DOM', () => {
    cy.mount(FrappeUIProvider)
    cy.then(() => {
      const id = toast.info('Will be dismissed', { duration: 60000 })
      // wait for toast to appear, then dismiss
      setTimeout(() => toast.dismiss(id as string | number), 50)
    })
    cy.get('[data-sonner-toast]').should('not.exist')
  })

  it('toast.message renders without type icon', () => {
    cy.mount(FrappeUIProvider)
    cy.then(() => {
      toast.message('Plain message')
    })
    cy.contains('Plain message').should('exist')
  })
})
