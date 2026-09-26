<template>
  <EHeader>
    <template #left>
      <Breadcrumbs :items="[{ label: 'frappe' }, { label: 'frappe' }]" />
    </template>
    <template #right>
      <AvatarGroup :images="avatars" :more="3" />
      <div class="flex items-center gap-1">
        <Button variant="ghost" size="sm" aria-label="Previous">
          <template #icon>
            <EIcon name="left-chevron" class="size-4 text-ink-gray-7" />
          </template>
        </Button>
        <Button variant="ghost" size="sm" aria-label="Next">
          <template #icon>
            <EIcon name="right-chevron" class="size-4 text-ink-gray-7" />
          </template>
        </Button>
      </div>
      <Button variant="subtle" size="sm" class="!text-ink-gray-7">
        <template #prefix>
          <EIcon name="stages" class="size-4" />
        </template>
        Replied
      </Button>
      <Button variant="subtle" size="sm" aria-label="More">
        <template #icon>
          <EIcon name="dot-horizontal" class="size-4 text-ink-gray-7" />
        </template>
      </Button>
    </template>
  </EHeader>
</template>

<script setup lang="ts">
import { Breadcrumbs, Button } from '../../../src'
import EIcon from '../../espresso-sidebar/EIcon.vue'
import AvatarGroup from '../AvatarGroup.vue'
import EHeader from '../EHeader.vue'
import a0 from '../../espresso-sidebar/avatars/header-0.png'
import a1 from '../../espresso-sidebar/avatars/header-1.png'
import a2 from '../../espresso-sidebar/avatars/header-2.png'
import a3 from '../../espresso-sidebar/avatars/header-3.png'

const avatars = [a0, a1, a2, a3]
</script>
