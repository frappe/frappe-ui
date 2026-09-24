<script setup>
import TypographyPage from '@/components/foundations/TypographyPage.vue'
</script>

# Typography

One typeface and one size scale, with a weight and a paragraph version of
each size.

<TypographyPage />

## Usage

### Sizes

`text-sm`, `text-base` and the other sizes set the font size, line height and
letter spacing together. Most frappe-ui controls use `text-base` (14px), and
smaller text uses `text-sm` (13px).

### Weights

Add the weight to the size, as in `text-sm-medium` or `text-lg-semibold`. It
also adjusts the letter spacing for that weight, which `font-medium` alone
does not. The regular weight is 420, a little heavier than Tailwind's 400.

### Paragraphs

For text that runs over several lines, use `text-p-*`, as in `text-p-base`.
It has a taller line height, about 1.5.

### Line height

Sizes up to `text-4xl` have a line height of 1.35, so text that wraps stays
readable. For single-line text in a box of fixed height, such as a toolbar
label, add `leading-tighter` (1.15). frappe-ui components already do this.
