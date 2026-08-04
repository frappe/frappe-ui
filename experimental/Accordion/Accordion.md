# Accordion

Stacks sections of content behind labelled headers that expand and collapse.
Useful for FAQs, settings groups, and anywhere vertical space is at a premium.

> **Experimental** — `Accordion` ships from
> [`frappe-ui/experimental`](/docs/experimental) while its API settles, so it is
> exempt from the usual deprecation policy and can change shape or disappear in
> any release.

```ts
import { Accordion } from 'frappe-ui/experimental'
import type { AccordionItem, AccordionProps } from 'frappe-ui/experimental'
```

Each item needs a `value` — it is the item's identity and the key `modelValue` /
`defaultValue` refer to, so it must stay stable as `items` is reordered or
filtered.

## Default

<ComponentPreview name="Accordion-Default" />

## Multiple

<ComponentPreview name="Accordion-Multiple" />

## Controlled

Bind `v-model` to own the open state in the parent — external controls can drive
it, and you can react to every change.

<ComponentPreview name="Accordion-Controlled" />

## Icons

<ComponentPreview name="Accordion-Icons" />

## Header suffix

Use the `#item-suffix` slot for trailing, non-interactive header content such as
a count or `Badge`.

<ComponentPreview name="Accordion-Suffix" />

<!-- @include: ./Accordion.api.md -->
