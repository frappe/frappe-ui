<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useData } from 'vitepress'
import { FrappeUIProvider, Badge } from 'frappe-ui'
import { theme as DocsTheme, Navbar } from 'frappe-ui/vitepress'
import { getRecipe } from '@/components/recipes'

const { frontmatter, params } = useData()
// Reuse the shared prose layout; the default Navbar comes from the theme.
const SharedLayout = DocsTheme.Layout
// Branch badge (set via vite define in the docs config) — a frappe-ui-only
// showcase extra slotted into the shared Navbar.
const devBranch = typeof __DEV_BRANCH__ !== 'undefined' ? __DEV_BRANCH__ : ''

// Chrome-less recipe demo target (/recipes/demo/<slug>) — rendered
// full-screen for RecipeExample iframes and "open full screen". The pages come
// from a single dynamic route (demo/[slug].md), so the slug is the route param.
const recipeDemo = computed(() =>
  frontmatter.value.layout === 'recipe-demo'
    ? getRecipe(params.value?.slug)
    : undefined,
)

// Demos load with the theme bootstrapped from localStorage, but the parent
// page's theme toggle only touches its own document. `storage` fires in the
// embedding iframes (same origin, different browsing context), so demos follow
// live toggles too.
function syncThemeFromStorage(e: StorageEvent) {
  if (e.key === 'theme' && e.newValue) {
    document.documentElement.setAttribute('data-theme', e.newValue)
  }
}
onMounted(() => {
  if (recipeDemo.value) window.addEventListener('storage', syncThemeFromStorage)
})
onBeforeUnmount(() =>
  window.removeEventListener('storage', syncThemeFromStorage),
)
</script>

<template>
  <FrappeUIProvider v-if="recipeDemo">
    <div class="h-screen w-full overflow-hidden bg-surface-base">
      <!-- csr recipes (the tiptap editor) can't render during SSG. -->
      <ClientOnly v-if="recipeDemo.csr">
        <component :is="recipeDemo.component" />
      </ClientOnly>
      <component :is="recipeDemo.component" v-else />
    </div>
  </FrappeUIProvider>

  <!-- Recipes homepage: full-width Navbar, no doc sidebar. -->
  <FrappeUIProvider v-else-if="frontmatter.layout === 'recipes'">
    <div class="flex h-full w-full flex-1 flex-col justify-between">
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

      <div class="flex-1 p-4 sm:p-5 lg:py-10">
        <main class="mx-auto w-full max-w-7xl">
          <Content
            as="article"
            class="prose prose-v3 prose-p:mb-4 text-[15px] !max-w-none"
          />
        </main>
      </div>
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
