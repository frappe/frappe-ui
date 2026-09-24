# Experimental

`frappe-ui/experimental` holds components and helpers that are not part of the
public API yet, or are on their way out of it.

> **Unstable API.** Don't import this subpath in product apps. Anything in it
> can change or disappear in any release, including minor and patch releases.

## Parked or incubating

Each export is here for one of two reasons:

- **Parked:** it was public in v0 and left the root export in `1.0.0`. It still
  works here while apps migrate, and then it is deleted.
- **Incubating:** it is new, and will be promoted to the root export or dropped
  once its API settles.

| Export | State | Waiting on |
| --- | --- | --- |
| [`Accordion`](#accordion) | Incubating | Its API settling |
| [`Calendar`](#calendar) | Parked | A redesigned calendar family |
| [Charts (v1)](#charts-v1) | Parked | Apps moving to [`frappe-ui/charts`](/docs/charts/overview) |
| [`CommandPalette`](#commandpalette) | Incubating | gameplan, helpdesk and this site running on it |
| [`DateCalendar`](#date-calendars) | Incubating | Its API settling |
| [`DateRangeCalendar`](#date-calendars) | Incubating | Its API settling |
| [`FloatingWindow`](#floatingwindow) | Incubating | Its API settling |
| [`ListView`](#listview) | Parked | [`frappe-ui/list`](/docs/molecules/list) reaching parity |
| [`MultiEmailInput`](#multiemailinput) | Incubating | Its API settling |
| [`PickerShell`](#pickershell) | Incubating | Its API settling |
| [Sprite icons](#sprite-icons) | Parked | Apps moving to `lucide-*` classes |
| [`ThemeSwitcher`](#themeswitcher) | Parked | Apps moving to `Select` plus `useColorScheme` |
| [TextEditor (v0)](#texteditor-v0) | Parked | Apps moving to [`frappe-ui/editor`](/docs/molecules/editor) |
| [Input labeling](#useinputlabeling) | Incubating | Its API settling |

Components that were **removed** have no import path at all. The
[migration guide](/docs/migration#removed-and-parked) lists each one with its
replacement.

## Accordion

Sections of content behind headers that expand and collapse. Incubating.

```ts
import { Accordion } from 'frappe-ui/experimental'
```

See the [Accordion page](/docs/experimental/accordion) for examples and the API.

## Calendar

A date and event view with Month, Week and Day modes. Parked: moved here from
the root in `1.0.0` with the same API, until a redesigned calendar family
replaces it. There is no replacement yet.

```ts
import { Calendar } from 'frappe-ui/experimental'
```

See the [Calendar page](/docs/experimental/calendar) for examples and the API.

## Charts (v1)

The first chart family: `AxisChart`, `DonutChart`, `FunnelChart`,
`NumberChart`, the `ECharts` wrapper, and `useAxisChartOptions`. Parked, and
will be removed. Use [`frappe-ui/charts`](/docs/charts/overview) instead.

```ts
import { AxisChart } from 'frappe-ui/experimental'
```

See the [migration guide](/docs/migration#charts-v1-—-moved-to-frappe-ui-experimental)
for the before and after.

## CommandPalette

A searchable list of commands in a dialog, built from seven parts so an app
writes the rows it needs. Incubating. It replaces the root `CommandPalette`,
which was removed in `1.0.0`.

```ts
import {
  CommandPalette,
  CommandPaletteInput,
  CommandPaletteList,
  CommandPaletteGroup,
  CommandPaletteItem,
  CommandPaletteEmpty,
  CommandPaletteFooter,
} from 'frappe-ui/experimental'
```

See the [CommandPalette page](/docs/experimental/commandpalette) for filtering,
server search, link items and styling.

## Date calendars

The calendars inside the date pickers, as standalone components. Incubating.
`DateCalendar` holds one date as `v-model`. `DateRangeCalendar` holds a
`[from, to]` pair and shows two months with `dualPane`. Both accept `min`, `max`
and `isDateUnavailable`, and expose `focus()`.

```ts
import { DateCalendar, DateRangeCalendar } from 'frappe-ui/experimental'
```

Both emit `select` on every click and `today` from the Today button, even when
the value does not change. Listen to these when every click matters, for
example to close a popover. Setting the value from outside moves the view to
that month.

<ComponentPreview name="DatePicker-DateCalendar" />

<ComponentPreview name="DatePicker-DateRangeCalendar" />

## FloatingWindow

A panel that docks, floats, or collapses to a tray at the bottom right, for
windows like an email composer. Incubating. `v-model:mode` holds the state
(`docked`, `floating` or `minimized`), and `storageKey` saves the mode and
position between sessions, and `minimizable: false` removes the tray state. The
`#header`, `#actions` and `#footer` slots change the title bar and add a footer
below the scrolling body. `useFloatingWindow` gives the same behavior without
the markup.

A detached window sits at `z-index: 40`, below every dialog. While one is
detached, `<body>` has the `has-floating-window` class.

```ts
import { FloatingWindow, useFloatingWindow } from 'frappe-ui/experimental'
```

## ListView

A data table configured with column objects. Parked until
[`frappe-ui/list`](/docs/molecules/list) supports config-driven columns. Use
`frappe-ui/list` for new code.

```ts
import { ListView } from 'frappe-ui/experimental'
```

See the [ListView page](/docs/experimental/listview) for examples and the API.

## MultiEmailInput

An email field that holds several addresses as removable chips and suggests
people as you type. Incubating. `v-model` is the array of addresses.

It is a separate component, not a `Combobox` mode: a `Combobox` picks one value
from its options, while this field builds a list from free text, with options
only as suggestions.

The component emits `update:query` as you type, so you can fetch matching
`options` (debounce it). A typed address is checked with `validate` (a basic
email check by default) and emits `invalid` if it fails. Addresses already
selected are left out of the suggestions.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { debounce } from 'frappe-ui'
import { MultiEmailInput } from 'frappe-ui/experimental'
import type { MultiEmailOption } from 'frappe-ui/experimental'

const emails = ref<string[]>([])
const options = ref<MultiEmailOption[]>([])
const loading = ref(false)

const search = debounce(async (query: string) => {
  loading.value = true
  options.value = await fetchUsers(query) // → [{ label, value, avatar? }]
  loading.value = false
}, 250)
</script>

<template>
  <MultiEmailInput
    v-model="emails"
    :options="options"
    :loading="loading"
    label="Invite by email"
    description="Pick existing users, or type a new address and press Enter."
    @update:query="search"
    @invalid="(email) => console.warn('rejected', email)"
  />
</template>
```

`label`, `description`, `error` and `required` work like on every other form
field.

<ComponentPreview name="MultiEmailInput-AsyncSuggestions" csr="true" />

### Suggestions with avatars

Every suggestion and chip shows an `Avatar`: the option's `avatar` image, or
initials from its `label`. Change a row with the `#item-prefix`, `#item-label`
and `#item-suffix` slots, or replace a chip with `#tag`:

```vue
<MultiEmailInput v-model="emails" :options="options">
  <template #tag="{ value, option, removeTag }">
    <Avatar :image="option?.avatar" :label="option?.label ?? value" size="xs" />
    <span>{{ option?.label ?? value }}</span>
    <button :aria-label="`Remove ${value}`" @click="removeTag">✕</button>
  </template>
</MultiEmailInput>
```

<ComponentPreview name="MultiEmailInput-CustomChip" csr="true" />

### Validation and custom create label

```vue
<MultiEmailInput
  v-model="emails"
  :validate="(v) => v.endsWith('@acme.com')"
  :create-label="(v) => `Invite ${v}`"
/>
```

### Label, description, error

This example shows a required error until a recipient is added.

<ComponentPreview name="MultiEmailInput-Labeling" csr="true" />

## PickerShell

The input half of the date pickers: a `TextInput` that opens a `Popover`, with
focus handled between them. Incubating. Use it to build your own picker instead
of copying `DatePicker`. Put the panel in `#default` and bind the text with
`v-model:input-value`.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PickerShell } from 'frappe-ui/experimental'

const open = ref(false)
const text = ref('')
</script>

<template>
  <PickerShell
    v-model:open="open"
    v-model:input-value="text"
    side="bottom"
    align="start"
    :offset="4"
    label="Colour"
  >
    <template #default="{ close }">
      <ColourGrid @select="close" />
    </template>
  </PickerShell>
</template>
```

Style it with the `data-slot` attributes that `TextInput` and
[`Popover`](/docs/components/popover) render. It has no class props.

## Sprite icons

The sprite-based `Icon`, `IconPicker` and `spritePlugin`, moved here from
`frappe-ui/icons` in `1.0.0` with no other change. Parked, and will be removed.
Use `lucide-*` classes or the root [`Icon`](/docs/components/icon) component
instead.

```ts
// Root `frappe-ui` exports a different `Icon`. Alias one if you import both.
import { Icon as SpriteIcon, IconPicker, spritePlugin } from 'frappe-ui/experimental'
```

The named icon components (`CircleCheckIcon`, `HelpIcon`, …) stay in
`frappe-ui/icons`.

## ThemeSwitcher

A group of theme preview cards, moved out of the root export in `1.0.0`.
Parked, and will be removed. Use a `Select` bound to
[`useColorScheme`](/docs/other/composables#usecolorscheme) instead; the
[migration guide](/docs/migration#themeswitcher) shows how. An app that wants
the cards keeps its own markup.

```ts
import { ThemeSwitcher } from 'frappe-ui/experimental'
```

## TextEditor (v0)

The v0 editor family, removed from the root in `1.0.0`. Parked, and will be
removed. Use [`frappe-ui/editor`](/docs/molecules/editor) instead.

```ts
import { TextEditor, TextEditorFixedMenu } from 'frappe-ui/experimental'
```

See the [Editor migration section](/docs/migration#editor) for the before and
after.

## useInputLabeling

The logic frappe-ui inputs use for their label, description and error: ids,
ARIA attributes and `data-*` attributes. Incubating. Use it in a custom input to
get the same behavior and styling hooks.

```ts
import { useInputLabeling } from 'frappe-ui/experimental'

const { inputId, labelledBy, describedBy, hasError, errorLines, dataAttrs } =
  useInputLabeling(props, { size: () => props.size })
```

## Input labeling components

The components that render the label, description and error of a form field.
Incubating. Pass them the ids from `useInputLabeling`.

```vue
<script setup lang="ts">
import {
  InputLabel,
  InputDescription,
  InputError,
  useInputLabeling,
} from 'frappe-ui/experimental'

const {
  inputId,
  labelId,
  descriptionId,
  errorMessageId,
  hasError,
  errorLines,
  showDescription,
} = useInputLabeling(props)
</script>

<template>
  <InputLabel
    v-if="props.label"
    :id="labelId"
    :for-id="inputId"
    :label="props.label"
    :required="props.required"
  />
  <slot />
  <InputDescription
    v-if="showDescription"
    :id="descriptionId"
    :description="props.description"
  />
  <InputError v-if="hasError" :id="errorMessageId" :lines="errorLines" />
</template>
```

| Component          | Renders                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| `InputLabel`       | A `<label>` for `forId`. With `required`, adds a red `*` and "(required)" for screen readers.     |
| `InputDescription` | The help text below the input (`data-slot="description"`).                                        |
| `InputError`       | Each message in `lines` on its own line, in a `role="alert"` region (`data-slot="error"`).        |

Each one renders nothing when it has no text or slot content.

## inputFontSizeClasses

Returns the font-size class frappe-ui inputs use for a size (`'xs'`, `'sm'`,
`'md'` or `'lg'`), so a custom input matches the built-in ones.

```ts
import { inputFontSizeClasses } from 'frappe-ui/experimental'

inputFontSizeClasses('sm') // 'text-base'
inputFontSizeClasses('lg') // 'text-lg'
```
