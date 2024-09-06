<script setup lang="ts">
import { ref } from 'vue'
import Tooltip from './Tooltip.vue'
import Button from '../Button.vue'

const placement = ref('top')
const disabled = ref(true)
</script>
<template>
  <Story :layout="{ type: 'grid', width: '300px' }">
    <Variant title="with text prop">
      <Tooltip
        text="This action cannot be undone"
        :hover-delay="1"
        :placement="placement"
      >
        <Button theme="red">Delete</Button>
      </Tooltip>
    </Variant>
    <Variant title="disabled">
      <Tooltip
        text="disabled tooltip"
        :disabled="disabled"
        :hover-delay="1"
        :placement="placement"
      >
        <Button theme="red">Delete</Button>
      </Tooltip>
    </Variant>
    <Variant title="with slot">
      <Tooltip arrow-class="fill-white" :placement="placement">
        <template #body>
          <div
            class="min-w-[6rem] rounded bg-white px-2 py-1 text-xs text-gray-900 shadow-xl"
          >
            test
          </div>
        </template>
        <Button theme="red">Delete</Button>
      </Tooltip>
    </Variant>

    <template #controls>
      <HstSelect
        v-model="placement"
        :options="['top', 'right', 'bottom', 'left']"
        title="Placement"
      />
    </template>
  </Story>
</template>
