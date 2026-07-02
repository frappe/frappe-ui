<script setup lang="ts">
import { List, ListRow, ListCell, ListRows } from 'frappe-ui/list'

const items = Array.from({ length: 1000 }, (_, i) => ({
  id: String(i + 1),
  title: `Task ${i + 1}`,
  status: i % 3 === 0 ? 'Done' : i % 3 === 1 ? 'In progress' : 'Backlog',
}))
</script>

<template>
  <!-- The scroll container is app-owned: ListRows finds the nearest
       scrollable ancestor and windows against it. -->
  <div class="h-72 w-full overflow-y-auto rounded border">
    <List :columns="['3rem', 'minmax(0,1fr)', '6rem']" :row-height="44" class="px-2">
      <ListRows :items="items" virtual v-slot="{ item }">
        <ListRow>
          <ListCell>
            <span class="text-sm text-ink-gray-4">#{{ item.id }}</span>
          </ListCell>
          <ListCell>
            <span class="truncate text-base text-ink-gray-8">{{ item.title }}</span>
          </ListCell>
          <ListCell class="justify-end">
            <span class="text-sm text-ink-gray-5">{{ item.status }}</span>
          </ListCell>
        </ListRow>
      </ListRows>
    </List>
  </div>
</template>
