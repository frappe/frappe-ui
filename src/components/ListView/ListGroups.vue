<template>
  <div v-if="list" class="h-full overflow-y-auto">
    <div v-for="group in list.rows" :key="group.group">
      <slot>
        <ListGroupHeader :group="group">
          <slot
            name="group-header"
            v-if="$slots['group-header']"
            v-bind="{ group }"
          />
        </ListGroupHeader>
        <ListGroupRows :group="group" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ComputedRef, inject } from 'vue'
import ListGroupHeader from './ListGroupHeader.vue'
import ListGroupRows from './ListGroupRows.vue'
import type { ListContext } from './types'

const list = inject<ComputedRef<ListContext>>('list')
</script>
