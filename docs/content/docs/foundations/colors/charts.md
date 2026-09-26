---
search: false
---

<script setup>
import { onMounted } from 'vue'
import { useRouter, withBase } from 'vitepress'

// This page moved. Old links and bookmarks land here and are sent on.
const router = useRouter()
onMounted(() => router.go(withBase('/docs/charts/colors')))
</script>

# Chart Colors

This page moved to [Chart colors](/docs/charts/colors).
