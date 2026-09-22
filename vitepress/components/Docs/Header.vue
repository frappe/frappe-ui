<script setup lang="ts">
// The doc pages' header: frappe-ui's own PageHeader, so the docs read like an
// app shell — the Sidebar holds the brand and search, this strip holds the
// site actions, and the two line up at 48px. Everything sits at the right
// end, the way an app's PageHeader holds its actions.
import { provide, useTemplateRef } from 'vue'
import { Button, PageHeader } from 'frappe-ui'
// Internal to the PageHeader family, imported by path on purpose: this theme
// ships inside the frappe-ui package, and the key is not public API.
import { pageHeaderTargetKey } from '../../../src/components/PageHeader/target'

import SiteActions from '../SiteActions.vue'
import { state } from '../../state'

defineSlots<{
  /** Extra controls placed before the site actions. */
  actions?: () => any
}>()

// A PageHeader teleports itself into the newest PageHeaderTarget on the page,
// which is how a routed page's header lands in its app shell. Here that would
// send the site header into any DesktopShell / MobileShell demo the prose
// mounts. Providing this wrapper as the target pins it in place — the shell
// demos keep their own headers, and this one never leaves the layout.
const own = useTemplateRef<HTMLElement>('own')
provide(pageHeaderTargetKey, own)
</script>

<template>
  <div ref="own" class="sticky top-0 z-20">
    <PageHeader>
      <!-- No brand here: the logo belongs to the Sidebar (and to the mobile
           nav sheet below lg), like an app's SidebarHeader. ml-auto pushes
           the single child to the right end. -->
      <nav class="ml-auto flex items-center gap-2 sm:gap-3">
        <slot name="actions" />
        <!-- Below lg the Sidebar (and its search field) is hidden, so the
             command palette gets a trigger here. -->
        <Button
          variant="ghost"
          icon="lucide-search"
          aria-label="Open search"
          class="lg:hidden"
          @click="state.searchDialog = true"
        />
        <SiteActions />
      </nav>
    </PageHeader>
  </div>
</template>
