import { defineComponent, h } from 'vue'
import { toast, ToastProvider } from '../../index'
import FrappeUIProvider from '../FrappeUIProvider/FrappeUIProvider.vue'

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

  it('ToastProvider is exported as the styled <Toaster> escape hatch', () => {
    expect(ToastProvider).to.not.be.undefined
  })

  it('the legacy shims are gone (create / remove / removeAll)', () => {
    expect((toast as any).create).to.equal(undefined)
    expect((toast as any).remove).to.equal(undefined)
    expect((toast as any).removeAll).to.equal(undefined)
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
    let toastId: string | number
    cy.then(() => {
      toastId = toast.info('Will be dismissed', { duration: 60000 })
    })
    cy.get('[data-sonner-toast]').should('exist')
    cy.contains('Will be dismissed').should('exist')
    cy.then(() => toast.dismiss(toastId))
    cy.get('[data-sonner-toast]').should('not.exist')
  })

  it('toast.message renders without type icon', () => {
    cy.mount(FrappeUIProvider)
    cy.then(() => {
      toast.message('Plain message')
    })
    cy.contains('Plain message').should('exist')
  })

  // ---- toasts fired while the app subtree is still mounting ------------------

  // <Toaster> only receives toasts published after it subscribes, so a toast
  // fired from a slot child's setup() is dropped unless ToastProvider renders
  // ahead of the slot. Regression test for frappe/frappe-ui#963.
  it('keeps a toast fired from slot content during setup', () => {
    const Child = defineComponent({
      setup() {
        toast.success('Toasted from setup')
        return () => h('div', 'child')
      },
    })

    cy.mount(FrappeUIProvider, { slots: { default: () => h(Child) } })
    cy.contains('Toasted from setup').should('exist')
  })
})
