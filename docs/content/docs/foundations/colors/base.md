---
outline: false
---

<script setup>
import PalettePage from '@/components/foundations/PalettePage.vue'
</script>

# Base Colors

The raw palette. Twelve hues, eleven shades each, plus alpha ramps and neutrals.

## Reach for a semantic token first

A raw shade is a fixed color. It does not follow the theme, so `bg-gray-100`
stays light in dark mode. Use [semantic tokens](./semantic) for anything that
should re-theme, which is almost everything.

Raw shades are for colors that must stay put: a swatch in a color picker, a
brand mark, a chart series that has to match a legend printed elsewhere. The
editor's font-color swatches are the in-tree example.

The dark ramp is not a mirror of the light one. It runs in the opposite
direction and carries an extra `450` step, so `dark-gray-3` is not "`gray-3`
in dark mode". Hand-pairing a raw shade with its `dark:` counterpart is one
more reason to use a semantic token.

## How `alpha` is spelled

`alpha` is a suffix on the **group** key, which is how Figma names it. The
shade or step follows, so a raw class carries the hue in the group and a
semantic class carries it after `alpha`:

| Family | Theme key | Class |
| --- | --- | --- |
| Raw | `gray-alpha` | `bg-gray-alpha-100`, `text-gray-alpha-500` |
| Raw, dark | `dark-gray-alpha` | `bg-dark-gray-alpha-100` |
| Semantic surface | `surface-alpha` | `bg-surface-alpha-gray-2`, `bg-surface-alpha-base` |
| Semantic outline | `outline-alpha` | `border-outline-alpha-gray-1` |
| Overlays | `white-overlay`, `black-overlay` | `bg-black-overlay-200` |

There is no `gray-500-alpha`. The overlay ramps are the one place the frappe-ui
name differs from Figma, which calls them `white-alpha` and `black-alpha`.

Tailwind's `/50` opacity modifier works on the semantic alpha classes. It does
not work on the raw alpha or overlay classes, because those values already
carry their own alpha channel.

<PalettePage />
