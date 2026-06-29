<script setup lang="ts">
import { ref } from 'vue'
import { Checkbox } from 'frappe-ui'

const items = ref([
  { label: 'Notifications', checked: true },
  { label: 'Weekly digest', checked: false },
  { label: 'Marketing emails', checked: true },
])

const allChecked = ref(false)

const indeterminate = ref(
  items.value.some((i) => i.checked) && !items.value.every((i) => i.checked),
)

function onSelectAll(val: boolean | 0 | 1 | undefined) {
  const checked = Boolean(val)
  items.value.forEach((i) => (i.checked = checked))
  allChecked.value = checked
  indeterminate.value = false
}

function onItemChange() {
  const checkedCount = items.value.filter((i) => i.checked).length
  allChecked.value = checkedCount === items.value.length
  indeterminate.value = checkedCount > 0 && checkedCount < items.value.length
}
</script>

<template>
  <div class="flex flex-col gap-1 w-48">
    <Checkbox
      :indeterminate="indeterminate"
      :model-value="allChecked"
      label="Select all"
      variant="padded"
      @update:model-value="onSelectAll"
    />
    <div class="pl-4 flex flex-col gap-1">
      <Checkbox
        v-for="item in items"
        :key="item.label"
        v-model="item.checked"
        :label="item.label"
        variant="padded"
        @update:model-value="onItemChange"
      />
    </div>
  </div>
</template>
