<script setup lang="ts">
import { ref } from 'vue'
import { ScrollArea, type ScrollAreaExposed } from 'frappe-ui'
import { List, ListRow, ListCell, ListRows } from 'frappe-ui/list'

const scroller = ref<ScrollAreaExposed | null>(null)

const items = Array.from({ length: 1000 }, (_, i) => ({
  id: String(i + 1),
  title: `Task ${i + 1}`,
  status: i % 3 === 0 ? 'Done' : i % 3 === 1 ? 'In progress' : 'Backlog',
}))
</script>

<template>
  <ScrollArea ref="scroller" class="h-72 w-full rounded-4 border">
    <List
      :columns="['3rem', 'minmax(0,1fr)', '6rem']"
      :row-height="44"
      class="px-2"
    >
      <ListRows
        :items="items"
        virtual
        :scroll-container="() => scroller?.viewportElement ?? null"
        v-slot="{ item }"
      >
        <ListRow>
          <ListCell>
            <span class="text-sm text-ink-gray-4">#{{ item.id }}</span>
          </ListCell>
          <ListCell>
            <span class="truncate text-base text-ink-gray-8">{{
              item.title
            }}</span>
          </ListCell>
          <ListCell class="justify-end">
            <span class="text-sm text-ink-gray-5">{{ item.status }}</span>
          </ListCell>
        </ListRow>
      </ListRows>
    </List>
  </ScrollArea>
</template>
