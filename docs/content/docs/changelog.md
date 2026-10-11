<script setup>
import { onMounted } from 'vue'
import { withBase } from 'vitepress'

// This page used to hold the whole v0 to v1 changelog. Old links to its
// sections, such as #deprecation-log, are sent on to the page that holds them.
onMounted(() => {
  const { hash } = window.location
  if (hash) window.location.replace(withBase('/docs/changelog/v0-to-v1') + hash)
})
</script>

# Changelog

frappe-ui keeps one changelog per major version.

- [v1 Changelog](/docs/changelog/v1): every 1.x release.
- [Changes from v0 to v1](/docs/changelog/v0-to-v1): every change that affects
  apps between v0.1.278 and 1.0.0.
