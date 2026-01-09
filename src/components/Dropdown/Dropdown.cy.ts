import Dropdown from './Dropdown.vue'
import Button from '../Button/Button.vue'
import { h } from 'vue'

describe('<Dropdown />', () => {
  it('renders default dropdown with Options button', () => {
    cy.mount(Dropdown, {
      props: {
        options: [
          { label: 'Edit', icon: 'edit', onClick: () => {} },
          { label: 'Delete', icon: 'trash-2', onClick: () => {} },
        ],
      },
    })
    
    // Check that default button is rendered
    cy.get('button').should('contain.text', 'Options')
  })

  it('renders dropdown with custom button trigger', () => {
    cy.mount(Dropdown, {
      props: {
        options: [
          { label: 'Edit', icon: 'edit', onClick: () => {} },
        ],
      },
      slots: {
        default: () => h(Button, { label: 'Custom Trigger' }),
      },
    })
    
    cy.get('button').should('contain.text', 'Custom Trigger')
  })

  it('opens dropdown menu on click', () => {
    cy.mount(Dropdown, {
      props: {
        options: [
          { label: 'Edit', icon: 'edit', onClick: () => {} },
          { label: 'Delete', icon: 'trash-2', onClick: () => {} },
        ],
      },
    })
    
    // Click the trigger button
    cy.get('button').click()
    
    // Check that menu items are visible
    cy.contains('Edit').should('be.visible')
    cy.contains('Delete').should('be.visible')
  })

  it('handles item clicks', () => {
    const onEditSpy = cy.spy().as('onEditSpy')
    const onDeleteSpy = cy.spy().as('onDeleteSpy')
    
    cy.mount(Dropdown, {
      props: {
        options: [
          { label: 'Edit', icon: 'edit', onClick: onEditSpy },
          { label: 'Delete', icon: 'trash-2', onClick: onDeleteSpy },
        ],
      },
    })
    
    // Open dropdown
    cy.get('button').click()
    
    // Click Edit item
    cy.contains('Edit').click()
    cy.get('@onEditSpy').should('have.been.called')
  })

  it('renders grouped options', () => {
    cy.mount(Dropdown, {
      props: {
        options: [
          {
            group: 'Actions',
            items: [
              { label: 'Edit', icon: 'edit', onClick: () => {} },
              { label: 'Duplicate', icon: 'copy', onClick: () => {} },
            ],
          },
          {
            group: 'Danger',
            items: [
              { label: 'Delete', icon: 'trash-2', theme: 'red', onClick: () => {} },
            ],
          },
        ],
      },
    })
    
    // Open dropdown
    cy.get('button').click()
    
    // Check group labels
    cy.contains('Actions').should('be.visible')
    cy.contains('Danger').should('be.visible')
    
    // Check items
    cy.contains('Edit').should('be.visible')
    cy.contains('Duplicate').should('be.visible')
    cy.contains('Delete').should('be.visible')
  })

  it('renders items with icons', () => {
    cy.mount(Dropdown, {
      props: {
        options: [
          { label: 'Edit', icon: 'edit', onClick: () => {} },
          { label: 'Delete', icon: 'trash-2', onClick: () => {} },
        ],
      },
    })
    
    // Open dropdown
    cy.get('button').click()
    
    // Check that icons are rendered (FeatherIcon components)
    cy.get('svg').should('exist')
  })

  it('applies red theme to items', () => {
    cy.mount(Dropdown, {
      props: {
        options: [
          { label: 'Edit', icon: 'edit', onClick: () => {} },
          { label: 'Delete', icon: 'trash-2', theme: 'red', onClick: () => {} },
        ],
      },
    })
    
    // Open dropdown
    cy.get('button').click()
    
    // Check that Delete item has red theme class
    cy.contains('Delete').parent().should('have.class', 'text-ink-red-3')
  })

  it('handles disabled items', () => {
    const onClickSpy = cy.spy().as('onClickSpy')
    
    cy.mount(Dropdown, {
      props: {
        options: [
          { label: 'Disabled Item', icon: 'edit', disabled: true, onClick: onClickSpy },
        ],
      },
    })
    
    // Open dropdown
    cy.get('button').click()
    
    // Check that disabled item has appropriate styles
    cy.contains('Disabled Item').parent().should('have.class', 'text-ink-gray-4')
    
    // Try to click disabled item
    cy.contains('Disabled Item').click({ force: true })
    
    // Verify onClick was not called (disabled items shouldn't trigger onClick)
    cy.get('@onClickSpy').should('not.have.been.called')
  })

  it('renders switch items', () => {
    const onSwitchSpy = cy.spy().as('onSwitchSpy')
    
    cy.mount(Dropdown, {
      props: {
        options: [
          { label: 'Lock', icon: 'lock', switch: true, switchValue: true, onClick: onSwitchSpy },
          { label: 'Collaborate', icon: 'users', switch: true, switchValue: false, onClick: onSwitchSpy },
        ],
      },
    })
    
    // Open dropdown
    cy.get('button').click()
    
    // Check that switch items are rendered
    cy.contains('Lock').should('be.visible')
    cy.contains('Collaborate').should('be.visible')
    
    // Check that switches exist
    cy.get('.toggle-switch').should('have.length', 2)
  })

  it('supports different placements', () => {
    // Test left placement (default)
    cy.mount(Dropdown, {
      props: {
        placement: 'left',
        options: [
          { label: 'Edit', icon: 'edit', onClick: () => {} },
        ],
      },
    })
    
    cy.get('button').click()
    cy.get('.dropdown-content').should('have.class', 'origin-top-left')
    
    // Test right placement
    cy.mount(Dropdown, {
      props: {
        placement: 'right',
        options: [
          { label: 'Edit', icon: 'edit', onClick: () => {} },
        ],
      },
    })
    
    cy.get('button').click()
    cy.get('.dropdown-content').should('have.class', 'origin-top-right')
    
    // Test center placement
    cy.mount(Dropdown, {
      props: {
        placement: 'center',
        options: [
          { label: 'Edit', icon: 'edit', onClick: () => {} },
        ],
      },
    })
    
    cy.get('button').click()
    cy.get('.dropdown-content').should('have.class', 'origin-top')
  })

  it('renders submenus', () => {
    cy.mount(Dropdown, {
      props: {
        options: [
          {
            label: 'More Actions',
            icon: 'more-horizontal',
            submenu: [
              { label: 'Archive', icon: 'archive', onClick: () => {} },
              { label: 'Export', icon: 'download', onClick: () => {} },
            ],
          },
        ],
      },
    })
    
    // Open dropdown
    cy.get('button').click()
    
    // Check that submenu trigger exists
    cy.contains('More Actions').should('be.visible')
    
    // Hover over submenu trigger to open submenu
    cy.contains('More Actions').trigger('mouseenter')
    
    // Check submenu items appear
    cy.contains('Archive').should('be.visible')
    cy.contains('Export').should('be.visible')
  })

  it('renders nested submenus with groups', () => {
    cy.mount(Dropdown, {
      props: {
        options: [
          {
            label: 'New',
            icon: 'plus',
            submenu: [
              {
                group: 'Documents',
                items: [
                  { label: 'New Document', icon: 'file-plus', onClick: () => {} },
                  { label: 'New Template', icon: 'file-text', onClick: () => {} },
                ],
              },
              {
                group: 'Organization',
                items: [
                  { label: 'New Folder', icon: 'folder-plus', onClick: () => {} },
                ],
              },
            ],
          },
        ],
      },
    })
    
    // Open dropdown
    cy.get('button').click()
    
    // Hover over submenu trigger
    cy.contains('New').trigger('mouseenter')
    
    // Check submenu groups and items
    cy.contains('Documents').should('be.visible')
    cy.contains('Organization').should('be.visible')
    cy.contains('New Document').should('be.visible')
    cy.contains('New Folder').should('be.visible')
  })

  it('filters options based on condition', () => {
    cy.mount(Dropdown, {
      props: {
        options: [
          { label: 'Always Visible', icon: 'edit', onClick: () => {} },
          { label: 'Conditionally Hidden', icon: 'trash-2', condition: () => false, onClick: () => {} },
          { label: 'Conditionally Visible', icon: 'copy', condition: () => true, onClick: () => {} },
        ],
      },
    })
    
    // Open dropdown
    cy.get('button').click()
    
    // Check visible items
    cy.contains('Always Visible').should('be.visible')
    cy.contains('Conditionally Visible').should('be.visible')
    
    // Check hidden item is not present
    cy.contains('Conditionally Hidden').should('not.exist')
  })

  it('renders with custom button props', () => {
    cy.mount(Dropdown, {
      props: {
        button: {
          label: 'Custom Label',
          theme: 'blue',
          variant: 'solid',
        },
        options: [
          { label: 'Edit', icon: 'edit', onClick: () => {} },
        ],
      },
    })
    
    // Check that button has custom label
    cy.get('button').should('contain.text', 'Custom Label')
    
    // Check that button has theme classes
    cy.get('button').should('have.class', 'bg-blue-500')
  })

  it('supports side and offset props', () => {
    cy.mount(Dropdown, {
      props: {
        side: 'top',
        offset: 8,
        options: [
          { label: 'Edit', icon: 'edit', onClick: () => {} },
        ],
      },
    })
    
    // Open dropdown
    cy.get('button').click()
    
    // Menu should be visible (specific positioning is handled by reka-ui)
    cy.get('.dropdown-content').should('be.visible')
  })

  it('closes dropdown after clicking an item', () => {
    cy.mount(Dropdown, {
      props: {
        options: [
          { label: 'Edit', icon: 'edit', onClick: () => {} },
        ],
      },
    })
    
    // Open dropdown
    cy.get('button').click()
    cy.contains('Edit').should('be.visible')
    
    // Click item
    cy.contains('Edit').click()
    
    // Dropdown should close
    cy.contains('Edit').should('not.exist')
  })

  it('handles items without icons when other items have icons', () => {
    cy.mount(Dropdown, {
      props: {
        options: [
          {
            group: 'Mixed',
            items: [
              { label: 'With Icon', icon: 'edit', onClick: () => {} },
              { label: 'Without Icon', onClick: () => {} },
            ],
          },
        ],
      },
    })
    
    // Open dropdown
    cy.get('button').click()
    
    // Both items should be visible
    cy.contains('With Icon').should('be.visible')
    cy.contains('Without Icon').should('be.visible')
    
    // Item without icon should have icon placeholder for alignment
    cy.contains('Without Icon').siblings('.mr-2.h-4.w-4.flex-shrink-0').should('exist')
  })
})
