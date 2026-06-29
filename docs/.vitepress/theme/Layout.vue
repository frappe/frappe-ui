<script setup lang="ts">
import { useData } from 'vitepress'
import { FrappeUIProvider, Badge } from 'frappe-ui'
import { theme as DocsTheme, Navbar } from 'frappe-ui/vitepress'
import Home from '@/components/Home/index.vue'

const { frontmatter } = useData()
// Reuse the shared prose layout; the default Navbar comes from the theme.
const SharedLayout = DocsTheme.Layout
// Branch badge (set via vite define in the docs config) — a frappe-ui-only
// showcase extra slotted into the shared Navbar.
const devBranch = typeof __DEV_BRANCH__ !== 'undefined' ? __DEV_BRANCH__ : ''
</script>

<template>
  <!-- Marketing landing page: full-width Navbar + Home, no doc sidebar. -->
  <FrappeUIProvider v-if="frontmatter.layout === 'home'">
    <div class="h-full flex flex-col justify-between flex-1 w-full">
      <Navbar>
        <template #actions>
          <Badge
            v-if="devBranch"
            :title="`git branch: ${devBranch}`"
            theme="orange"
            variant="outline"
            class="hidden md:flex"
          >
            <template #prefix><span class="lucide-git-branch" /></template>
            {{ devBranch }}
          </Badge>
        </template>
      </Navbar>
      <Home />
    </div>
  </FrappeUIProvider>

  <!-- Doc pages: shared layout (sidebar + content) with the dev badge added. -->
  <component :is="SharedLayout" v-else>
    <template #navbar>
      <Navbar :is-docs="true">
        <template #actions>
          <Badge
            v-if="devBranch"
            :title="`git branch: ${devBranch}`"
            theme="orange"
            variant="outline"
            class="hidden md:flex"
          >
            <template #prefix><span class="lucide-git-branch" /></template>
            {{ devBranch }}
          </Badge>
        </template>
      </Navbar>
    </template>
  </component>
</template>
