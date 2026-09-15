---
outline: false
---

<script setup>
import SemanticPage from '@/components/foundations/SemanticPage.vue'
</script>

# Semantic Colors

Use-case tokens for surface, ink, and outline. They map to the palette and swap with the theme.

**These are the default.** Use a semantic token unless the color has to stay
fixed across themes; see [Base Colors](./base) for the exceptions and for how
`alpha` is spelled. A semantic token needs no `dark:` variant: the value flips
under `[data-theme="dark"]`, so one class is correct in both modes.

<SemanticPage />
