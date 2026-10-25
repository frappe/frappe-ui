<script setup>
import SemanticColors from '@/components/foundations/SemanticColors.vue'
import PaletteColors from '@/components/foundations/PaletteColors.vue'
</script>

# Colors

Colors come from three sets of tokens: `surface` for backgrounds, `ink` for
text and icons, and `outline` for borders. Each token changes with the theme,
so one class works in light and dark mode.

<SemanticColors />

## Working with colors

### Using the classes

Use `surface` tokens with `bg-`, `ink` tokens with `text-` and `outline`
tokens with `border-`:

<div class="not-prose my-4 flex justify-center rounded-7 border border-outline-gray-1 bg-surface-gray-1 p-8">
  <div class="w-72 rounded-6 border border-outline-gray-2 bg-surface-base p-4">
    <div class="flex items-center justify-between">
      <span class="text-base font-medium text-ink-gray-8">Invoice paid</span>
      <span class="rounded-full bg-surface-green-2 px-1.5 py-0.5 text-xs font-medium text-ink-green-7">Paid</span>
    </div>
    <p class="mt-1 text-sm text-ink-gray-5">Paid on 12 March by bank transfer.</p>
  </div>
</div>

```html
<div class="rounded-6 border border-outline-gray-2 bg-surface-base p-4">
  <div class="flex items-center justify-between">
    <span class="text-base font-medium text-ink-gray-8">Invoice paid</span>
    <span class="rounded-full bg-surface-green-2 px-1.5 py-0.5 text-xs font-medium text-ink-green-7">
      Paid
    </span>
  </div>
  <p class="mt-1 text-sm text-ink-gray-5">Paid on 12 March by bank transfer.</p>
</div>
```

Higher steps are stronger. The grays used most in frappe-ui components:

| Token | Use |
| --- | --- |
| `bg-surface-base` | The page, cards and menus |
| `bg-surface-gray-2`, `bg-surface-gray-3` | Soft backgrounds, hover and pressed states |
| `text-ink-gray-8` | Main text |
| `text-ink-gray-5` | Secondary text, such as hints and timestamps |
| `border-outline-gray-1`, `border-outline-gray-2` | Dividers and borders |

### Dark mode

Tokens need no `dark:` variant. Their values change when the page has
`data-theme="dark"`. Switch the theme at the top of this page to see the
colors above change.

### Transparency

Add an opacity modifier, as in `bg-surface-gray-7/50`. For a surface that
must let the content behind it show through, use an alpha token such as
`bg-surface-alpha-gray-2` or `border-outline-alpha-gray-1`. They are in the
"gray alpha" rows above.

### Using the values in CSS

Each token is a CSS variable with the same name:

```css
.chip {
  background: var(--surface-gray-2);
  color: var(--ink-gray-8);
  border: 1px solid var(--outline-gray-1);
}
```

## Palette

Fixed colors that look the same in light and dark mode. Use them only when a
color must not change with the theme, like a swatch in a color picker. For
everything else, use the tokens above.

<PaletteColors />

`dark-*` shades hold the values the dark theme uses. `dark-gray-*` and
`dark-gray-alpha-*` have an extra `450` step.
An opacity modifier such as `/50` works on solid shades, but not on the alpha
and overlay shades, which already have their own transparency.
