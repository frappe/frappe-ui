---
outline: false
---

<script setup>
import ElevationPreview from '@/components/foundations/ElevationPreview.vue'
import FocusRingPreview from '@/components/foundations/FocusRingPreview.vue'
</script>

# Elevation

Elevation conveys depth and hierarchy. Each step is a CSS variable
(`--elevation-*`) that flips between light and dark themes automatically — use
the same `shadow-*` utility in both modes.

## Elevation scale

Six steps from inset hairline to floating overlay, plus `shadow-status` for
status-dot rings.

<ElevationPreview />

## Focus rings

Component utilities backed by `--focus-*`. Width flips from 2px (light) to 3px
(dark) automatically. Pair with `focus-visible:` for keyboard-only highlight.

<FocusRingPreview />

## Surface pairing

In dark mode, shadows fade against dark backgrounds — depth is carried by a
lighter surface underneath. Recommended pairings for floating components:

| Use case          | Shadow         | Dark surface      |
| ----------------- | -------------- | ----------------- |
| Inset / pressed   | `shadow-sm`    | `surface-gray-1`  |
| Card              | `shadow-base`  | `surface-gray-1`  |
| Dropdown / menu   | `shadow-md`    | `surface-gray-1`  |
| Popover           | `shadow-lg`    | `surface-gray-2`  |
| Modal             | `shadow-xl`    | `surface-gray-2`  |
| Toast / overlay   | `shadow-2xl`   | `surface-gray-3`  |

## Migration

**Shadow values updated.** `shadow-sm` through `shadow-2xl` are now backed by
the Figma elevation scale. Y-offset, blur, and spread are all larger than
before, and most steps now include a subtle inner white highlight. Visual diff
is expected wherever shadows are used.

**New: `shadow-base`.** Sits between `shadow-sm` and `shadow-md` for resting
cards. `shadow` (the bare utility) remains as an alias.

**New: `shadow-status`.** A 1.5px white halo for status dots over coloured
backgrounds.

**Dark mode is automatic.** Shadow utilities now resolve to
`var(--elevation-*)` and flip values under `[data-theme="dark"]`. Remove any
conditional `dark:shadow-*` overrides — they are no longer needed.

**Focus rings.** Replace `focus-visible:ring-2 ring-outline-gray-3` with
`focus-visible:focus-ring`; semantic variants exist for red (error), green
(success), amber, blue, violet. Existing `ring-*` utilities are unchanged —
migrate only focus state, not selection rings (e.g. media nodes using
`ring-offset-2`).
