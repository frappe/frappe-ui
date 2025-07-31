<template>
  <div class="flex flex-col h-full w-full overflow-hidden">
    <div
      class="flex h-12 items-center flex-shrink-0 justify-between border-b px-4"
    >
      <Breadcrumbs :items="breadcrumbs" />
    </div>
    <div
      v-if="!list.meta.loading"
      class="flex flex-col flex-1 h-full w-full overflow-hidden p-4"
    >
      <!-- List Header -->
      <div class="flex justify-between gap-4">
        <div class="flex gap-2">
          <ListQuickFilter
            v-for="field in list.quickFilterFields"
            :key="field.fieldname"
            :field="field"
            :modelValue="list.filters[field.fieldname]"
            @update:modelValue="updateFilter(field.fieldname, $event)"
          />
        </div>

        <!-- Filter -->
        <div class="flex gap-2">
          <Button label="Filter">
            <template #prefix>
              <LucideListFilter class="size-4 text-ink-gray-6" />
            </template>
          </Button>
          <Button label="Sort">
            <template #prefix>
              <LucideArrowUpDown class="size-4 text-ink-gray-6" />
            </template>
          </Button>
          <Button>
            <template #icon>
              <LucideMoreVertical class="size-4 text-ink-gray-6" />
            </template>
          </Button>
        </div>
      </div>

      <ListView
        class="mt-4"
        :id="`${list.doctype}-list`"
        :columns="list.props.columns"
        :rows="list.props.rows"
        :rowKey="list.props.rowKey"
        :options="list.props.options"
      >
        <template #cell="{ column, row, value }">
          <ListCell :field="column.field" :value="value" />
        </template>
      </ListView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Breadcrumbs, Button, ListView } from '../../../src'
import { pluralize } from '../../utils'
import ListCell from './ListCell.vue'
import ListQuickFilter from './ListQuickFilter.vue'
import { useListView } from './useListView'

const props = defineProps<{ doctype: string }>()

const route = useRoute()
const breadcrumbs = [
  {
    label: pluralize(props.doctype),
    to: route.path,
  },
]

const list = useListView(props.doctype)

function updateFilter(fieldname: string, value: any) {
  if (value) {
    list.filters[fieldname] = value
  } else {
    delete list.filters[fieldname]
  }
}
</script>
