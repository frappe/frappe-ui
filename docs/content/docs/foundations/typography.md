---
outline: false
---

<script setup>
import TypographyPage from '@/components/foundations/TypographyPage.vue'
</script>

# Typography

One typeface across a single size ramp, with paragraph and weight variants.

Text sizes set line-height 1.35, so text that wraps stays readable. Add
`leading-tighter` (1.15) to single-line text in a fixed-height box, such as a
custom row or a toolbar label. frappe-ui components already do. Use the
`text-p-*` paragraph styles for long prose. `leading-tight` keeps Tailwind's
1.25.

<TypographyPage />
