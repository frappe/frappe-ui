<script setup>
import FocusRingPreview from '@/components/foundations/FocusRingPreview.vue'
</script>

# Focus ring

An outline around the element that has keyboard focus. Press Tab to move
through these controls:

<FocusRingPreview />

## Usage

### Where it shows

The ring applies to every element on `:focus-visible`, so it shows when you
use the keyboard and not when you click. Your own buttons and links get it
with no extra class. To hide it, add `focus-visible:outline-none`.

### Colors

Add a color to show the ring in that color, such as red on a field with an
error:

```html
<input class="focus-visible:focus-ring-red" />
```

The colors are `red`, `green`, `amber`, `blue` and `violet`. Each is also a
CSS variable, as in `var(--focus-outline-red)`.
