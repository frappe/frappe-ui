---
outline: false
---

<script setup>
import ElevationPreview from '@/components/foundations/ElevationPreview.vue'
</script>

# Elevation

Shadow tokens for depth and hierarchy.

## Elevation scale

Six steps from a subtle lift to a floating overlay, plus `shadow-status` for
status dots.

<ElevationPreview />

## Surface pairing

In dark mode, shadows fade against dark backgrounds, so depth comes from a
lighter surface instead. The `surface-elevation-*` tokens handle this: they stay
white in light mode and step lighter in dark mode. Pair shadows with these
tokens rather than raw `surface-gray-*` so one class works in both themes.

Pairings used by the components:

| Use case                        | Surface               | Shadow                   |
| ------------------------------- | --------------------- | ------------------------ |
| Resting card, active nav item   | `surface-elevation-3` | `shadow-sm` / `shadow-base` |
| Dialog, Popover                 | `surface-elevation-2` | `shadow-xl`              |
| Dropdown, Select, floating menu | `surface-elevation-2` | `shadow-2xl`             |
