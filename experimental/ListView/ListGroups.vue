<template>
  <div class="h-full overflow-y-auto">
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

<script setup>
import ListGroupHeader from './ListGroupHeader.vue'
import ListGroupRows from './ListGroupRows.vue'
import { inject } from 'vue'

const list = inject('list')
</script>
