<script setup lang="ts">
import { Avatar, Breadcrumbs } from 'frappe-ui'

const email = 'jane.cooper@example.com'

const items = [
  { label: 'Teams', icon: 'lucide-users', onClick: () => {} },
  { label: 'Design', icon: 'lucide-palette', onClick: () => {} },
  {
    label: 'Jane Cooper',
    user: { image: `https://i.pravatar.cc/80?u=${email}` },
  },
]
</script>

<template>
  <Breadcrumbs :items="items">
    <template #prefix="{ item }">
      <Avatar
        v-if="item.user"
        :image="item.user.image"
        :label="item.label"
        size="sm"
        class="mr-1.5"
      />
      <span
        v-else
        :class="item.icon"
        class="mr-1.5 size-4 shrink-0"
        aria-hidden="true"
      />
    </template>
  </Breadcrumbs>
</template>
