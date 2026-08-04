# Button

An interactive element used to trigger actions, submit forms, or navigate between views.

## Active state

`Button` holds the pressed look while its own `data-state` is `open` or
`active` — there is no `active` prop.

Used as a menu trigger, this needs no wiring at all: the menu primitive stamps
`data-state="open"` on the trigger, so the button stays pressed for as long as
the menu is open.

```vue
<Dropdown :options="options" :button="{ label: 'Options' }" />
```

For a standalone toggle — a toolbar control, a filter chip — set the attribute
yourself. It is visual only, so pair it with `aria-pressed`:

```vue
<Button
  label="Bold"
  :data-state="isBold ? 'active' : 'inactive'"
  :aria-pressed="isBold"
/>
```

## Playground

<ComponentPlayground name="Button" />

## Section controls

<ComponentPreview name='Button-SectionControls' />

## Section action

<ComponentPreview name='Button-SectionAction' />

## Selection toolbar

<ComponentPreview name='Button-SelectionToolbar' />

## Inline actions

<ComponentPreview name='Button-InlineActions' />

## Stacked actions

<ComponentPreview name='Button-StackedActions' />

## Card actions

<ComponentPreview name='Button-LiveClassCard' />

<!-- @include: ./Button.api.md -->
