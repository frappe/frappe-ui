# Button

A clickable element that runs an action, submits a form or opens a link.

<ComponentPlayground name="Button" />

## Examples

### List view controls

Filter and view controls above a list. `icon-left` and `icon-right` put an icon
beside the label, `icon` alone makes an icon-only button, and the `#suffix` slot
holds a count.

<ComponentPreview name='Button-SectionControls' />

### Section header

A `ghost` button with the section name, and an add action at the other end of
the row.

<ComponentPreview name='Button-SectionAction' />

### Selection toolbar

A row of `ghost` buttons that act on the selected items. `theme="red"` marks the
destructive action.

<ComponentPreview name='Button-SelectionToolbar' />

### Primary and secondary action

A `solid` button for the main action beside a default `subtle` one.

<ComponentPreview name='Button-InlineActions' />

### Full-width actions

Add `class="w-full"` to stack buttons in a narrow column.

<ComponentPreview name='Button-StackedActions' />

### Card actions

Two actions that share the width of a card, each with `class="flex-1"`.

<ComponentPreview name='Button-LiveClassCard' />

## Behavior

### Pressed state

`Button` shows its pressed look while its `data-state` attribute is `open` or
`active`. There is no `active` prop.

As a menu trigger, this needs no wiring. The menu sets `data-state="open"` on
the trigger, so the button stays pressed while the menu is open.

```vue
<Dropdown :options="options" :button="{ label: 'Options' }" />
```

For a standalone toggle, such as a toolbar control or a filter chip, set the
attribute yourself. It changes only the look, so pair it with `aria-pressed`:

```vue
<Button
  label="Bold"
  :data-state="isBold ? 'active' : 'inactive'"
  :aria-pressed="isBold"
/>
```

### Loading

`loading` shows a spinner in place of the left icon and makes the button
non-interactive, without the dimmed disabled look. `loading-text` replaces the
label while it loads. Only `disabled` dims the button.

### Links

With `route`, the button renders as a router link. With `href`, it renders as
an `<a>` that opens the URL in a new tab. A disabled or loading button always
renders as a native `<button>`, so it cannot be followed. `type` sets the native
button type and defaults to `button`.

## Accessibility

- An icon-only button needs a `label`. The label is not shown. It becomes the
  button's `aria-label`.
- A loading button sets `aria-busy="true"`.

<!-- @include: ./Button.api.md -->
