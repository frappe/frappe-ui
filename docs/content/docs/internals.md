# Internals

The `frappe-ui/internals` subpath exposes internal building blocks —
composables, class helpers, components and headless logic — that are not part of the
public API.

Think of it as a staging area: exports live here while their API settles. Over
time, some of them get promoted to the public API and others get removed.

> **Unstable API** — everything exported from `frappe-ui/internals` is exempt
> from the usual deprecation policy and can change shape or disappear in _any_
> release, including minor and patch releases, with no deprecation window.
> Do **not** import this subpath from product apps or third-party code — pin
> to a public entry point instead.

## useInputLabeling

Shared headless logic for input components: it wires up the label,
description, and error region of a form control, and computes the matching
ARIA and `data-*` attributes. All frappe-ui input components use it
internally, so a custom control built with it gets the same behavior and
styling hooks for free.

```ts
import { useInputLabeling } from 'frappe-ui/internals'

const { inputId, labelledBy, describedBy, hasError, errorLines, dataAttrs } =
  useInputLabeling(props, { size: () => props.size })
```

## Input labeling components

The presentational counterparts of `useInputLabeling`: small components that
render the label, description, and error region of a form control. frappe-ui
input components compose them internally; a custom control can use them with
the ids returned by `useInputLabeling` to get matching markup and styling.

```vue
<script setup lang="ts">
import {
  InputLabel,
  InputDescription,
  InputError,
  LabelingWrapper,
  useInputLabeling,
} from 'frappe-ui/internals'

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

Renders a `<label>` linked to the input via `forId`, with a required marker
(a red `*` plus screen-reader-only "(required)" text) when `required` is set.
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

Conditionally wraps its slot content in a `<div>` (with optional
`wrapperClass` / `wrapperStyle`) when `enabled` is true, and renders the slot
as-is otherwise. Lets a control add a labeling wrapper element only when it
actually renders a label, description, or error.

## inputFontSizeClasses

Returns the Tailwind font-size class frappe-ui input components use for a
given size token (`'sm' | 'md' | 'lg' | 'xl'`), so custom controls render text
at the same scale as built-in ones.

```ts
import { inputFontSizeClasses } from 'frappe-ui/internals'

inputFontSizeClasses('sm') // 'text-base'
inputFontSizeClasses('lg') // 'text-lg'
```
