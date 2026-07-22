<script setup lang="ts">
import { ref } from 'vue'
import {
  MobileShell,
  MobileNav,
  MobileNavItem,
  PageHeaderMobile,
  Avatar,
} from 'frappe-ui'

const tab = ref('home')
</script>

<template>
  <!--
    MobileShell is `fixed inset-0`. The `transform` on this wrapper makes it the
    containing block for that fixed positioning, so the shell stays inside the
    preview box instead of covering the page. (A story-only concern.)
  -->
  <div
    class="mx-auto h-[600px] w-[360px] transform-gpu overflow-hidden border bg-surface-white"
  >
    <MobileShell>
      <PageHeaderMobile>
        <span class="text-base font-semibold text-ink-gray-8">Home</span>
      </PageHeaderMobile>

      <div class="p-4">Lorem ipsum dolor</div>

      <template #nav>
        <MobileNav>
          <MobileNavItem
            label="Home"
            icon="lucide-house"
            :active="tab === 'home'"
            @click="tab = 'home'"
          />
          <MobileNavItem
            label="Notifications"
            icon="lucide-bell"
            :active="tab === 'notifications'"
            @click="tab = 'notifications'"
          />
          <MobileNavItem
            label="Search"
            icon="lucide-search"
            :active="tab === 'search'"
            @click="tab = 'search'"
          />
          <MobileNavItem
            label="You"
            :active="tab === 'you'"
            @click="tab = 'you'"
          >
            <template #default="{ active }">
              <Avatar
                label="Jane Doe"
                size="md"
                :class="active ? 'ring-2 ring-outline-gray-4' : ''"
              />
            </template>
          </MobileNavItem>
        </MobileNav>
      </template>
    </MobileShell>
  </div>
</template>
