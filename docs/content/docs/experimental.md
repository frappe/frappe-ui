# Experimental

The `frappe-ui/experimental` subpath exposes internal building blocks —
composables, class helpers, components and headless logic — that are not part of
the public API.

Think of it as a staging area: exports live here while their API settles. Over
time, some of them get promoted to the public API and others get removed.

> **Unstable API** — everything exported from `frappe-ui/experimental` is exempt
> from the usual deprecation policy and can change shape or disappear in _any_
> release, including minor and patch releases, with no deprecation window. Do
> **not** import this subpath from product apps or third-party code — pin to a
> public entry point instead.

## Parked or incubating

An export lands here for one of two reasons, and the reason tells you which way
it is likely to move:

- **Parked** — it was public in v0, left the root export in `1.0.0`, and sits
  here as an interim import path. It still works. It leaves by being deleted
  once apps migrate, not by being promoted.
- **Incubating** — this API was never public, even if the name was. It leaves
  by being promoted to the root export, or by being dropped.

| Export | State | Waiting on |
| --- | --- | --- |
| [`Accordion`](#accordion) | Incubating | Its API settling |
| [`Calendar`](#calendar) | Parked | A redesigned calendar family |
| [Charts (v1)](#charts-v1) | Parked | Apps moving to [`frappe-ui/charts`](/docs/charts/overview) |
| [`CodeEditor`](#codeeditor) | Incubating | Its API settling |
| [`CommandPalette`](#commandpalette) | Incubating | gameplan, helpdesk and this site running on it |
| [`FloatingWindow`](#floatingwindow) | Incubating | Its API settling |
| [`ListView`](#listview) | Parked | [`frappe-ui/list`](/docs/molecules/list) reaching parity |
| [`MultiEmailInput`](#multiemailinput) | Incubating | Its API settling |
| [Sprite icons](#sprite-icons) | Parked | Apps moving to `lucide-*` classes |
| [`ThemeSwitcher`](#themeswitcher) | Parked | Apps moving to `Select` plus `useColorScheme` |
| [TextEditor (v0)](#texteditor-v0) | Parked | Apps moving to [`frappe-ui/editor`](/docs/molecules/editor) |
| [Input labeling](#useinputlabeling) | Incubating | Its API settling |

A component that is **removed** rather than parked is a third case: it has no
import path at all and needs a replacement. Those are on the
[Legacy components](/docs/components/legacy) page.

## Accordion

Stacks sections of content behind labelled headers that expand and collapse.
Built on reka-ui's `Accordion`, so the WAI-ARIA keyboard grammar and the
single/multiple open models come for free.

```ts
import { Accordion } from 'frappe-ui/experimental'
```

See the [Accordion page](/docs/experimental/accordion) for examples and the full
API reference.

## Calendar

A date and event view with Month, Week, and Day modes: event CRUD, drag and
resize, keyboard shortcuts, and a replaceable header and event popover. Moved
here from root in `1.0.0` with its public API unchanged; it stays, unstable,
until a redesigned calendar family replaces it.

```ts
import { Calendar } from 'frappe-ui/experimental'
```

See the [Calendar page](/docs/experimental/calendar) for examples and the
full API reference.

## Charts (v1)

The first chart family — `AxisChart`, `DonutChart`, `FunnelChart`,
`NumberChart`, the raw `ECharts` wrapper, and `useAxisChartOptions`. Each one
takes a single `config` object. Removed from root in `1.0.0`;
[`frappe-ui/charts`](/docs/charts/overview) is the replacement and draws
everything these did. Unstable — it will be removed once consumers migrate.

```ts
import { AxisChart } from 'frappe-ui/experimental'
```

See the [migration guide](/docs/migration) for the before/after.

## CodeEditor

A CodeMirror 6 code field with syntax highlighting and an optional sanitized
preview (`CodePreview`). CodeMirror is lazy-loaded, so importing the barrel
pulls in no editor code until a field actually mounts.

```ts
import { CodeEditor, CodePreview } from 'frappe-ui/experimental'
```

See the [CodeEditor page](/docs/experimental/codeeditor) for languages, sizes,
variants, and the labeling contract.

## CommandPalette

A searchable list of commands in a dialog. The root `CommandPalette` was
removed in `1.0.0` and rebuilt here as seven composable parts, so an app writes
the rows it needs instead of feeding one `groups` shape. `filterable` (default
`true`) turns the client filter off for server search.

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
server search, link items and the styling hooks.

## FloatingWindow

A panel that docks, floats, or collapses to a bottom-right tray, for
composer-style windows. `v-model:mode` holds the state (`docked` | `floating` |
`minimized`); `storageKey` persists the mode and geometry across sessions, and
`minimizable: false` drops the tray state. The `#header`, `#actions`, and
`#footer` slots replace or extend the title bar and pin a region below the
scrollable body. `useFloatingWindow` is the headless half — pass it the panel
and drag-handle refs to build your own chrome.

A detached window sits at `z-index: 40`, above page chrome and below every
dialog. It was `50` before, which tied with `Dialog`. If your app has chrome in
that band, scope a rule to the `has-floating-window` class, set on `<body>`
while a window is detached.

```ts
import { FloatingWindow, useFloatingWindow } from 'frappe-ui/experimental'
```

## ListView

A config-driven data table: resizable columns, per-column `getLabel`/`prefix`
functions, cell tooltips, grouped rows, disabled-row exclusion, and a select
banner. `frappe-ui/list` is the composition-based replacement for new code,
but it has no equivalent for ListView's config-driven columns yet — ListView
stays here, unstable, until it does.

```ts
import { ListView } from 'frappe-ui/experimental'
```

See the [ListView page](/docs/experimental/listview) for examples and the
full API reference.

## TextEditor (v0)

The deprecated v0 editor family, parked here while apps migrate to
[`frappe-ui/editor`](/docs/molecules/editor). Removed from root in `1.0.0`;
this subpath is the interim import path. Unstable — it will be removed once
consumers migrate.

```ts
import { TextEditor, TextEditorFixedMenu } from 'frappe-ui/experimental'
```

See the [Editor migration section](/docs/migration#editor) for the
before/after.

## ThemeSwitcher

`ThemeSwitcher`, moved out of the root export in `1.0.0`. It stays deprecated
here: `Select` bound to the [`useColorScheme`](/docs/other/composables#usecolorscheme)
composable is the replacement, and `useColorScheme` remains the stable
primitive at the root. Parked only while apps migrate, and it will be removed.

```ts
import { ThemeSwitcher } from 'frappe-ui/experimental'
```

The replacement is behavioral, not visual. `ThemeSwitcher` renders a group of
theme preview cards, so an app that wants the cards keeps its own markup. See
the [migration guide](/docs/migration#themeswitcher) for the `Select` version.

## Sprite icons

The sprite-based `Icon`, `IconPicker`, and `spritePlugin`, moved out of
`frappe-ui/icons` in `1.0.0`. They draw from a 468 KB SVG sprite that
`spritePlugin` injects into `<body>`. `lucide-*` classes — and the root
[`Icon`](/docs/components/icon) component, which wraps one — are the canonical
way to render icons, so this trio is parked only while apps migrate, and it
will be removed. Nothing about the components changed; only the subpath did.

```ts
// Root `frappe-ui` exports a different `Icon` — alias one if you import both.
import { Icon as SpriteIcon, IconPicker, spritePlugin } from 'frappe-ui/experimental'
```

The named SFC icons (`CircleCheckIcon`, `HelpIcon`, …) stay on
`frappe-ui/icons`.

## MultiEmailInput

A multi-value email field: selected addresses render as removable chips, and a
typeahead dropdown suggests existing people as you type. Built on reka-ui's
`TagsInput` + `Combobox`, so chip keyboard navigation (Delete / Backspace /
Arrow / Home / End) and the popover come for free. `v-model` is the array of
addresses.

As you type, the component emits `update:query` (debounce it in the host) so you
can fetch matching `options`. Picked suggestions are added as-is; a typed
address is validated first (a practical email check by default — override with
`validate`) and surfaced through `invalid` if it fails. Already-selected
addresses are filtered out of the suggestions automatically.

### Why it isn't a `Combobox` mode

A `multiple` flag on `Combobox` looks like the obvious home for this, but the
two controls disagree about what the text input fundamentally _is_.

In a `Combobox` the input **is the value**: you type to narrow toward a single
choice, and the field then displays that choice. Typing edits the selection,
Backspace edits the search, and Enter commits _and closes_ — you are done
choosing. The model is one value, and the options are authoritative: they define
what is selectable, with free text as a deliberate exception.

`MultiEmailInput` inverts all of it. The input is a **throwaway staging area**
for the next address; committed values live beside it as independent,
individually-removable chips. Typing builds a token instead of a selection,
Backspace deletes a chip instead of a query, and Enter commits _and keeps going_
— you are assembling a set, not picking one member of it. Its options are merely
advisory: an email address space is open by nature, so the free-text token is
the centre of gravity and suggestions are assistance layered on top — the
reverse of a picker, where the list is the truth.

Those are two different interaction grammars — single-choice _resolution_ versus
set _composition_ — over two different data shapes (`string | null` versus
`string[]`). Collapsing them into one component would force `Combobox` to carry
both selection models, both keyboard grammars, and both commit semantics,
leaving every prop quietly ambiguous about which mode it governs. reka-ui
already draws this line: `Combobox` and `TagsInput` are separate primitives, and
`MultiEmailInput` is their _composition_, not a fork of either. Keeping it
distinct is what lets each one stay a single, legible idea.

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

It plugs into [`useInputLabeling`](#useinputlabeling), so `label`,
`description`, `error`, and `required` behave (and look) like every other
frappe-ui form field.

<ComponentPreview name="MultiEmailInput-AsyncSuggestions" csr="true" />

### Suggestions with avatars

Every suggestion row and chip always renders an `Avatar` — the option's `avatar`
image when present, otherwise initials from its `label`. (The field is named
`avatar`, not the house `icon`, because this control is person-centric: the
leading visual is always a face or initials.) Override the row with the
`#item-prefix` / `#item-label` / `#item-suffix` slots, or replace a chip
entirely with `#tag`:

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

`label`, `description`, `error`, and `required` render exactly like the other
form fields (this example shows a required error until a recipient is added).

<ComponentPreview name="MultiEmailInput-Labeling" csr="true" />

## useInputLabeling

Shared headless logic for input components: it wires up the label, description,
and error region of a form control, and computes the matching ARIA and `data-*`
attributes. All frappe-ui input components use it internally, so a custom
control built with it gets the same behavior and styling hooks for free.

```ts
import { useInputLabeling } from 'frappe-ui/experimental'

const { inputId, labelledBy, describedBy, hasError, errorLines, dataAttrs } =
  useInputLabeling(props, { size: () => props.size })
```

## Input labeling components

The presentational counterparts of `useInputLabeling`: small components that
render the label, description, and error region of a form control. frappe-ui
input components compose them internally; a custom control can use them with the
ids returned by `useInputLabeling` to get matching markup and styling.

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
  <div v-if="hasLabeling" class="space-y-1.5">
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
  </div>
  <slot v-else />
</template>
```

### InputLabel

Renders a `<label>` linked to the input via `forId`, with a required marker (a
red `*` plus screen-reader-only "(required)" text) when `required` is set.
Renders nothing when there is no label text or slot content. The default slot
replaces the label text and receives `required` as a slot prop.

### InputDescription

Renders the help text below an input as a muted paragraph
(`data-slot="description"`). Renders nothing without a `description` prop or
slot content.

### InputError

Renders validation messages (`lines`) as a `role="alert"` region
(`data-slot="error"`), one message per line. Renders nothing when `lines` is
empty.

## inputFontSizeClasses

Returns the Tailwind font-size class frappe-ui input components use for a given
size token (`'sm' | 'md' | 'lg' | 'xl'`), so custom controls render text at the
same scale as built-in ones.

```ts
import { inputFontSizeClasses } from 'frappe-ui/experimental'

inputFontSizeClasses('sm') // 'text-base'
inputFontSizeClasses('lg') // 'text-lg'
```
