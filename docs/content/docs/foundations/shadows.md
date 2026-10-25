<script setup>
import ShadowsPreview from '@/components/foundations/ShadowsPreview.vue'
</script>

# Shadows

Six shadows, from a slight lift to a floating menu.

<ShadowsPreview />

## Usage

### Pairing with a surface

Shadows are hard to see on a dark background, so in dark mode a raised
element needs a lighter surface instead. The `surface-elevation-*` tokens do
this: they are white in light mode and lighter than the page in dark mode.
Pair a shadow with one of them, and the element looks raised in both themes.

The pairs frappe-ui components use:

| Element | Surface | Shadow |
| --- | --- | --- |
| Active sidebar item, active tab | `bg-surface-elevation-3` | `shadow-sm` or `shadow-base` |
| Dialog | `bg-surface-elevation-1` | `shadow-xl` |
| Menu, dropdown, popover | `bg-surface-elevation-2` | `shadow-2xl` |

### Using the values in CSS

Each shadow is a CSS variable, as in `box-shadow: var(--elevation-md)`.
