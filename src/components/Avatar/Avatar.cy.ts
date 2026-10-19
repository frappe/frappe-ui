import { h } from 'vue'
import Avatar from './Avatar.vue'
import AvatarBadge from './AvatarBadge.vue'

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']

const sizeHeights = {
  xs: '4',
  sm: '5',
  md: '6',
  lg: '7',
  xl: '8',
  '2xl': '10',
  '3xl': '11.5',
}

const defaultProps = {
  'data-cy': 'avatar',
  image: 'https://avatars.githubusercontent.com/u/499550',
  label: 'Abc',
}

describe('Avatar', () => {
  it('Renders', () => {
    cy.mount(Avatar, {
      props: defaultProps,
    })

    cy.get('[data-cy="avatar"]').should('exist')
  })

  it('Sizes', () => {
    sizes.forEach((x) => {
      cy.mount(Avatar, {
        props: { ...defaultProps, size: x },
      })

      cy.get('[data-cy="avatar"]').should('have.class', 'h-' + sizeHeights[x])
    })
  })

  it('Name', () => {
    cy.mount(Avatar, {
      props: { 'data-cy': 'avatar', label: 'Abc' },
    })

    cy.get('[data-cy="avatar"]').should('have.text', 'A')
  })

  it('Uses gray fallback theme by default', () => {
    cy.mount(Avatar, {
      props: { 'data-cy': 'avatar', label: 'Abc' },
    })

    cy.get('[data-cy="avatar"] > div')
      .should('have.class', 'bg-surface-gray-2')
      .and('have.class', 'text-ink-gray-5')
  })

  it('Supports colorful fallback themes', () => {
    cy.mount(Avatar, {
      props: { 'data-cy': 'avatar', label: 'Abc', theme: 'blue' },
    })

    cy.get('[data-cy="avatar"] > div')
      .should('have.class', 'bg-surface-blue-2')
      .and('have.class', 'text-ink-blue-7')
  })

  it('keeps the size enum when the class only sizes at a breakpoint', () => {
    // Tailwind emits variant utilities after the base ones, so `sm:size-16`
    // wins at `sm` on its own. Dropping the enum for it left the avatar
    // unsized below `sm`, and this root is inline-block.
    cy.mount(Avatar, {
      props: { 'data-cy': 'avatar', label: 'Abc', size: 'md' },
      attrs: { class: 'sm:size-16' },
    })
    cy.get('[data-cy="avatar"]').should('have.class', 'w-6')

    cy.mount(Avatar, {
      props: { 'data-cy': 'avatar-plain', label: 'Abc', size: 'md' },
      attrs: { class: 'size-16' },
    })
    cy.get('[data-cy="avatar-plain"]').should('not.have.class', 'w-6')
  })
})

describe('AvatarBadge', () => {
  // Mounts the avatar next to a probe element that carries a token class or
  // style, so a test compares the rendered color with the token's own color.
  function mountWithProbe(
    probe: string | { style: string },
    indicator: () => any,
    wrapperStyle = '',
  ) {
    cy.mount({
      render: () =>
        h('div', { style: wrapperStyle }, [
          h(Avatar, { label: 'Jane Cooper', size: '3xl' }, { indicator }),
          h('div', {
            'data-cy': 'probe',
            ...(typeof probe === 'string' ? { class: probe } : probe),
          }),
        ]),
    })
  }

  function backgroundOf(selector: string) {
    return cy
      .get(selector)
      .then(($el) => getComputedStyle($el[0]).backgroundColor)
  }

  function expectSameBackground(selector: string, probeSelector: string) {
    backgroundOf(probeSelector).then((expected) => {
      backgroundOf(selector).should('eq', expected)
    })
  }

  function expectSameColor(selector: string, probeSelector: string) {
    cy.get(probeSelector).then(($probe) => {
      cy.get(selector).should(
        'have.css',
        'color',
        getComputedStyle($probe[0]).color,
      )
    })
  }

  it('fills the indicator, gray by default', () => {
    mountWithProbe('bg-surface-gray-5', () => h(AvatarBadge))

    cy.get('[data-slot="avatar-badge"]')
      .should('have.class', 'size-full')
      .and('have.class', 'rounded-full')
      .and('have.css', 'display', 'flex')
    expectSameBackground('[data-slot="avatar-badge"]', '[data-cy="probe"]')
  })

  it('takes its color from a class, over the default gray', () => {
    mountWithProbe('bg-surface-gray-4', () =>
      h(AvatarBadge, { class: 'bg-surface-gray-4' }),
    )

    expectSameBackground('[data-slot="avatar-badge"]', '[data-cy="probe"]')
  })

  it('takes its text color from a class, over the default white', () => {
    // text-ink-gray-9 sorts before the default text-white in the stylesheet,
    // so it wins only because the default sits in :where().
    mountWithProbe('text-ink-gray-9', () =>
      h(AvatarBadge, { class: 'text-ink-gray-9' }),
    )

    expectSameColor('[data-slot="avatar-badge"]', '[data-cy="probe"]')
  })

  it('centers its content', () => {
    mountWithProbe('text-white', () =>
      h(AvatarBadge, () => h('span', { 'data-cy': 'icon', class: 'size-2' })),
    )

    cy.get('[data-slot="avatar-badge"]')
      .should('have.css', 'justify-content', 'center')
      .and('have.css', 'align-items', 'center')
    cy.get('[data-cy="icon"]').should('exist')
    expectSameColor('[data-slot="avatar-badge"]', '[data-cy="probe"]')
  })

  it('cuts the badge out with the page surface by default', () => {
    mountWithProbe({ style: 'background: var(--surface-base)' }, () =>
      h(AvatarBadge),
    )

    // badge → sized wrapper → ring
    cy.get('[data-slot="avatar-badge"]')
      .parent()
      .parent()
      .invoke('attr', 'data-cy', 'ring')
    expectSameBackground('[data-cy="ring"]', '[data-cy="probe"]')
  })

  it('takes the ring color from --avatar-badge-ring on an ancestor', () => {
    mountWithProbe(
      { style: 'background: var(--surface-gray-2)' },
      () => h(AvatarBadge),
      '--avatar-badge-ring: var(--surface-gray-2)',
    )

    cy.get('[data-slot="avatar-badge"]')
      .parent()
      .parent()
      .invoke('attr', 'data-cy', 'ring')
    expectSameBackground('[data-cy="ring"]', '[data-cy="probe"]')
  })

  it('leaves other indicator content as it was', () => {
    mountWithProbe({ style: 'background: var(--surface-base)' }, () =>
      h('span', { 'data-cy': 'dot', class: 'block size-full rounded-full' }),
    )

    cy.get('[data-cy="dot"]').parent().should('have.class', 'h-3')
    cy.get('[data-cy="dot"]')
      .parent()
      .parent()
      .invoke('attr', 'data-cy', 'ring')
    expectSameBackground('[data-cy="ring"]', '[data-cy="probe"]')
  })
})
