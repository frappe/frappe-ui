---
outline: false
---

<script setup>
import ElevationPreview from '@/components/foundations/ElevationPreview.vue'
import FocusRingPreview from '@/components/foundations/FocusRingPreview.vue'
</script>

# Elevation

Elevation conveys depth and hierarchy. Each step is a CSS variable
(`--elevation-*`) that resolves to the same value in both themes — Espresso 2.0
uses one shadow set for light and dark, so the same `shadow-*` utility works in
either mode without overrides.

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

**One shadow set for both themes.** `shadow-*` utilities resolve to a single
value (`var(--elevation-*)`) regardless of theme — matching how Espresso 2.0
applies shadows in the Figma dark-mode page. Remove any conditional
`dark:shadow-*` overrides. If a component genuinely needs a heavier
dark-mode-specific shadow, opt in with `shadow-dark-{sm,base,md,lg,xl,2xl}`.

**Focus rings.** Replace `focus-visible:ring-2 ring-outline-gray-3` with
`focus-visible:focus-ring`; semantic variants exist for red (error), green
(success), amber, blue, violet. Existing `ring-*` utilities are unchanged —
migrate only focus state, not selection rings (e.g. media nodes using
`ring-offset-2`).
