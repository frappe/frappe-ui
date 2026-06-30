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
  LabelingWrapper,
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
  <LabelingWrapper :enabled="hasLabeling" wrapper-class="space-y-1.5">
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
  </LabelingWrapper>
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

### LabelingWrapper

Conditionally wraps its slot content in a `<div>` (with optional `wrapperClass`
/ `wrapperStyle`) when `enabled` is true, and renders the slot as-is otherwise.
Lets a control add a labeling wrapper element only when it actually renders a
label, description, or error.

## inputFontSizeClasses

Returns the Tailwind font-size class frappe-ui input components use for a given
size token (`'sm' | 'md' | 'lg' | 'xl'`), so custom controls render text at the
same scale as built-in ones.

```ts
import { inputFontSizeClasses } from 'frappe-ui/experimental'

inputFontSizeClasses('sm') // 'text-base'
inputFontSizeClasses('lg') // 'text-lg'
```
