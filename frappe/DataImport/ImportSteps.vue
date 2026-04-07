<template>
  <div class="flex items-center space-x-3 text-xs lg:space-x-10 lg:text-base">
    <div
      class="flex cursor-pointer items-center space-x-1 text-ink-gray-5 lg:space-x-2"
      :class="{
        'font-semibold text-ink-gray-9': onUploadStep,
      }"
      @click="emit('updateStep', 'upload', { ...data })"
    >
      <FeatherIcon
        v-if="uploadStepCompleted"
        name="check"
        class="size-5 rounded-[5px] border p-0.5 text-sm"
        :class="{
          'bg-surface-gray-7 text-ink-white': onUploadStep,
        }"
      />
      <div
        v-else
        class="rounded-[5px] border px-1.5 py-0.5 text-sm"
        :class="{
          'bg-surface-gray-7 text-ink-white': onUploadStep,
        }"
      >
        <span> 1 </span>
      </div>
      <div>Upload File</div>
    </div>
    <div
      class="flex items-center space-x-1 text-ink-gray-5 lg:space-x-2"
      :class="{
        'font-semibold text-ink-gray-9': onMapStep,
        'cursor-pointer': uploadStepCompleted,
      }"
      @click="moveToMapStep()"
    >
      <FeatherIcon
        v-if="mapStepCompleted"
        name="check"
        class="size-5 rounded-[5px] border p-0.5 text-sm"
        :class="{
          'bg-surface-gray-7 text-ink-white': onMapStep,
        }"
      />
      <div
        v-else
        class="rounded-[5px] border px-1.5 py-0.5 text-sm"
        :class="{
          'bg-surface-gray-7 text-ink-white': onMapStep,
        }"
      >
        <span> 2 </span>
      </div>
      <div>Map Data</div>
    </div>
    <div
      class="flex items-center space-x-1 text-ink-gray-5 lg:space-x-2"
      :class="{
        'font-semibold text-ink-gray-9': onPreviewStep,
        'cursor-pointer': uploadStepCompleted,
      }"
      @click="moveToPreviewStep()"
    >
      <FeatherIcon
        v-if="previewStepCompleted"
        name="check"
        class="size-5 rounded-[5px] border p-0.5 text-sm"
        :class="{
          'bg-surface-gray-7 text-ink-white': onPreviewStep,
        }"
      />
      <div
        v-else
        class="rounded-[5px] border px-1.5 py-0.5 text-sm"
        :class="{
          'bg-surface-gray-7 text-ink-white': onPreviewStep,
        }"
      >
        <span> 3 </span>
      </div>
      <div>Review & Import</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

import FeatherIcon from '../../src/components/FeatherIcon.vue'
import type { DataImport } from './types'

const emit = defineEmits(['updateStep'])

const props = defineProps<{
  data: DataImport | null
  step: 'list' | 'upload' | 'map' | 'preview'
}>()

const onUploadStep = computed(() => {
  return props.step === 'upload'
})

const uploadStepCompleted = computed(() => {
  return props.data?.import_file || props.data?.google_sheets_url
})

const onMapStep = computed(() => {
  return props.step === 'map'
})

const mapStepCompleted = computed(() => {
  return (
    props.data &&
    props.data?.template_options &&
    JSON.parse(props.data.template_options).column_to_field_map
  )
})

const onPreviewStep = computed(() => {
  return props.step === 'preview'
})

const previewStepCompleted = computed(() => {
  return props.data?.status === 'Success'
})

const moveToMapStep = () => {
  if (uploadStepCompleted.value) {
    emit('updateStep', 'map', { ...props.data })
  }
}

const moveToPreviewStep = () => {
  if (uploadStepCompleted.value) {
    emit('updateStep', 'preview', { ...props.data })
  }
}
</script>
