# SplitButton

A button for the main action, joined to a chevron that opens a menu of other
ways to do it, like Publish with "Publish to staging" beside it. For a menu with
no main action, use [Dropdown](./dropdown).

<ComponentPlayground name="SplitButton" />

## Examples

### Publish a page

A page header. Publish is one click, and the chevron offers staging and
unpublishing. `condition` hides the actions that don't apply to the page's
status, and `loading` locks the menu while the page saves.

<ComponentPreview name="SplitButton-Publish" />

### Message composer

A chat composer. Send goes now, and the chevron schedules the message. Both
halves stay disabled until there's something to send.

<ComponentPreview name="SplitButton-Composer" />

### Export formats

An `outline` SplitButton in a list toolbar. The format most people want is the
button, and the others are in the menu.

<ComponentPreview name="SplitButton-Export" />

## Behavior

### Halves

The main action is a `Button` and the chevron is a `Dropdown` trigger. Both take
`variant` and `size`, so they always match. There is no `theme`: a split button
is always gray, and a colored action belongs on a plain `Button`. `@click` fires
only from the main action. The menu's items run their own `onClick`.

`options` takes the same items and groups as [Dropdown](./dropdown#options),
including `icon`, `theme`, `condition` and `submenu`. `align` places the menu
along the chevron, and defaults to `end`.

### Joining

The inner corners are square, and the halves overlap by a 1px border. `outline`
shows that border as the seam. The other variants keep it transparent and paint
the shared edge in the page color, so it reads as a 1px gap. Every variant is
the same size, so switching variants moves nothing.

### Loading and disabled

`disabled` disables both halves and turns them gray. `loading` shows a spinner
on the main action and locks the chevron too, because the menu holds other ways
to do the same thing, and starting one mid-request would race the first. Like a
loading `Button`, neither half turns gray while loading: the chevron keeps its
look, sets `aria-disabled`, and its menu doesn't open. An open menu closes when
loading starts.

### Styling hooks

The wrapper has `data-slot="root"`, `data-variant` and `data-size`. The main
action has `data-slot="action"`, and the chevron has the Dropdown trigger's
`data-slot="trigger"`.

## Accessibility

- The halves are two buttons in the tab order: the main action, then the
  chevron.
- The chevron is named by `menuLabel`, which defaults to "More options". Name it
  after what the menu holds, like "More ways to publish" or "Schedule send".
- The chevron has `aria-haspopup="menu"` and `aria-expanded`. The menu keys are
  the same as [Dropdown](./dropdown#accessibility), and `Escape` returns focus
  to the chevron.
- A loading main action sets `aria-busy="true"`.

<!-- @include: ./SplitButton.api.md -->
