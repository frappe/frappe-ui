<script setup lang="ts">
import { ref, reactive } from 'vue'
import IconPicker from './IconPicker.vue'

const basicValue = ref(null)
const preselectedValue = ref('star')
const disabledValue = ref('')

const state = reactive({
  disabled: false,
  placeholder: 'Select an icon...',
  openOnClick: true,
  openOnFocus: true,
  placement: 'start',
})
</script>

<template>
  <Story title="IconPicker" :layout="{ type: 'grid', width: 400 }">
    <Variant title="Basic Usage">
      <div class="p-4">
        <label class="block text-sm font-medium mb-2">Basic Icon Picker</label>
        <IconPicker
          v-model="basicValue"
          :placeholder="state.placeholder"
          :disabled="state.disabled"
          :open-on-click="state.openOnClick"
          :open-on-focus="state.openOnFocus"
          :placement="state.placement"
        />
        <div class="mt-2 text-sm text-gray-600">
          Selected: {{ basicValue || 'None' }}
        </div>
      </div>
    </Variant>

    <Variant title="Subtle Variant (Default)">
      <div class="p-4">
        <label class="block text-sm font-medium mb-2">Subtle Variant</label>
        <IconPicker
          variant="subtle"
          v-model="basicValue"
          :placeholder="state.placeholder"
          :disabled="state.disabled"
        />
        <div class="mt-2 text-sm text-gray-600">
          Selected: {{ basicValue || 'None' }}
        </div>
      </div>
    </Variant>

    <Variant title="Outline Variant">
      <div class="p-4">
        <label class="block text-sm font-medium mb-2">Outline Variant</label>
        <IconPicker
          variant="outline"
          v-model="basicValue"
          :placeholder="state.placeholder"
          :disabled="state.disabled"
        />
        <div class="mt-2 text-sm text-gray-600">
          Selected: {{ basicValue || 'None' }}
        </div>
      </div>
    </Variant>

    <Variant title="Ghost Variant">
      <div class="p-4">
        <label class="block text-sm font-medium mb-2">Ghost Variant</label>
        <IconPicker
          variant="ghost"
          v-model="basicValue"
          :placeholder="state.placeholder"
          :disabled="state.disabled"
        />
        <div class="mt-2 text-sm text-gray-600">
          Selected: {{ basicValue || 'None' }}
        </div>
      </div>
    </Variant>

    <Variant title="Pre-selected Icon">
      <div class="p-4">
        <label class="block text-sm font-medium mb-2">Pre-selected Icon</label>
        <IconPicker
          v-model="preselectedValue"
          :placeholder="state.placeholder"
          :disabled="state.disabled"
        />
        <div class="mt-2 text-sm text-gray-600">
          Selected: {{ preselectedValue || 'None' }}
        </div>
      </div>
    </Variant>

    <Variant title="Disabled State">
      <div class="p-4">
        <label class="block text-sm font-medium mb-2">Disabled Icon Picker</label>
        <IconPicker
          v-model="disabledValue"
          placeholder="This is disabled"
          :disabled="true"
        />
        <div class="mt-2 text-sm text-gray-600">
          Icon picker is disabled
        </div>
      </div>
    </Variant>

    <template #controls>
      <HstText v-model="state.placeholder" title="Placeholder" />
      <HstCheckbox v-model="state.disabled" title="Disabled" />
      <HstCheckbox v-model="state.openOnClick" title="Open on Click" />
      <HstCheckbox v-model="state.openOnFocus" title="Open on Focus" />
      <HstSelect
        v-model="state.placement"
        title="Placement"
        :options="[
          { value: 'start', label: 'Start' },
          { value: 'center', label: 'Center' },
          { value: 'end', label: 'End' }
        ]"
      />
    </template>
  </Story>
</template>
