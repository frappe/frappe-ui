<template>
  <BaseBlock title="Scope" icon="scope">
    <template #meta>
      <Select
        variant="outline"
        :options="doctypes"
        placeholder="Select Doctype"
        v-model="state.dt"
      />
    </template>
  </BaseBlock>
</template>

<script setup lang="ts">
import type { Option } from '@/components/Autocomplete/types'
import Select from '../../src/components/Select/Select.vue'

import { onMounted } from 'vue'
import { useAutomationState } from './automation'
import BaseBlock from './BaseBlock.vue'

const props = defineProps<{
  doctypes: Option[]
}>()

const state = useAutomationState()

onMounted(() => {
  if (props.doctypes.length === 1 && !state.dt) {
    state.dt = props.doctypes[0].value as string
  }
})
</script>

<style scoped></style>
