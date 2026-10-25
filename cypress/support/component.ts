// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import './setup'

import { mount } from 'cypress/vue'

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

Cypress.Commands.add('mount', mount)

// Example use:
// cy.mount(MyComponent)

// With COVERAGE=true, vite-plugin-istanbul instruments src/ into
// window.__coverage__. All tests in a spec share one window, so the counters
// cover the whole spec. Save them once, after the last test.
after(() => {
  const { __coverage__: coverage } = window as { __coverage__?: object }
  if (coverage) {
    cy.task(
      'saveCoverage',
      { spec: Cypress.spec.relative, coverage },
      { log: false },
    )
  }
})
