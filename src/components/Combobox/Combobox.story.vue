<script setup lang="ts">
import { ref, reactive } from 'vue'
import Combobox from './Combobox.vue'

const simpleValue = ref('')
const objectValue = ref('')
const iconValue = ref('')
const groupedValue = ref('')
const disabledValue = ref('')
const preselectedValue = ref('john-doe')
const multipleSimpleValue = ref([])
const multipleObjectValue = ref([])
const multipleGroupedValue = ref(['apple', 'carrot'])
const complexObjectValue = ref(null)
const selectedOption = ref(null)

// Complex objects for displayValue demo
const complexObjects = [
  {
    label: 'John Doe (Admin)',
    value: 'john-doe',
    email: 'john@example.com',
    role: 'Admin',
  },
  {
    label: 'Jane Smith (User)',
    value: 'jane-smith',
    email: 'jane@example.com',
    role: 'User',
  },
  {
    label: 'Bob Johnson (Manager)',
    value: 'bob-johnson',
    email: 'bob@example.com',
    role: 'Manager',
  },
  {
    label: 'Alice Brown (User)',
    value: 'alice-brown',
    email: 'alice@example.com',
    role: 'User',
  },
]

const simpleOptions = [
  'John Doe',
  'Jane Doe',
  'John Smith',
  'Jane Smith',
  'John Wayne',
  'Jane Wayne',
  'Alice Johnson',
  'Bob Wilson',
  'Charlie Brown',
  'Diana Prince',
]

const objectOptions = [
  { label: 'John Doe', value: 'john-doe' },
  { label: 'Jane Doe', value: 'jane-doe' },
  { label: 'John Smith', value: 'john-smith' },
  { label: 'Jane Smith', value: 'jane-smith', disabled: true },
  { label: 'John Wayne', value: 'john-wayne' },
  { label: 'Jane Wayne', value: 'jane-wayne' },
  { label: 'Alice Johnson', value: 'alice-johnson' },
  { label: 'Bob Wilson', value: 'bob-wilson' },
]

const optionsWithIcons = [
  { label: 'Dashboard', value: 'dashboard', icon: '📊' },
  { label: 'Projects', value: 'projects', icon: '📁' },
  { label: 'Tasks', value: 'tasks', icon: '✅' },
  { label: 'Calendar', value: 'calendar', icon: '📅' },
  { label: 'Reports', value: 'reports', icon: '📈' },
  { label: 'Settings', value: 'settings', icon: '⚙️' },
]

const groupedOptions = [
  {
    group: 'Fruits',
    options: [
      { label: 'Apple', value: 'apple', icon: '🍎' },
      { label: 'Banana', value: 'banana', icon: '🍌' },
      { label: 'Orange', value: 'orange', icon: '🍊' },
      { label: 'Grape', value: 'grape', icon: '🍇' },
    ],
  },
  {
    group: 'Vegetables',
    options: [
      { label: 'Carrot', value: 'carrot', icon: '🥕' },
      { label: 'Broccoli', value: 'broccoli', icon: '🥦' },
      { label: 'Tomato', value: 'tomato', icon: '🍅' },
      { label: 'Lettuce', value: 'lettuce', icon: '🥬' },
    ],
  },
  {
    group: 'Proteins',
    options: [
      { label: 'Chicken', value: 'chicken', icon: '🍗' },
      { label: 'Fish', value: 'fish', icon: '🐟' },
      { label: 'Beef', value: 'beef', icon: '🥩' },
      { label: 'Tofu', value: 'tofu', icon: '🪤', disabled: true },
    ],
  },
]

const state = reactive({
  disabled: false,
  placeholder: 'Select an option...',
  showCancel: true,
})
</script>

<template>
  <Story title="Combobox" :layout="{ type: 'grid', width: 400 }">
    <Variant title="Simple String Options">
      <div class="p-4">
        <label class="block text-sm font-medium mb-2">Simple Options</label>
        <Combobox
          :options="simpleOptions"
          v-model="simpleValue"
          :placeholder="state.placeholder"
          :disabled="state.disabled"
          :show-cancel="state.showCancel"
          @update:selectedOption="selectedOption = $event"
        />
        <div class="mt-2 text-sm text-gray-600">
          Selected: {{ simpleValue || 'None' }}
        </div>
      </div>
    </Variant>

    <Variant title="Object Options">
      <div class="p-4">
        <label class="block text-sm font-medium mb-2">Object Options</label>
        <Combobox
          :options="objectOptions"
          v-model="objectValue"
          :placeholder="state.placeholder"
          :disabled="state.disabled"
          :show-cancel="state.showCancel"
        />
        <div class="mt-2 text-sm text-gray-600">
          Selected: {{ objectValue || 'None' }}
        </div>
      </div>
    </Variant>

    <Variant title="Options with Icons">
      <div class="p-4">
        <label class="block text-sm font-medium mb-2">Options with Icons</label>
        <Combobox
          :options="optionsWithIcons"
          v-model="iconValue"
          :placeholder="state.placeholder"
          :disabled="state.disabled"
        />
        <div class="mt-2 text-sm text-gray-600">
          Selected: {{ iconValue || 'None' }}
        </div>
      </div>
    </Variant>

    <Variant title="Grouped Options">
      <div class="p-4">
        <label class="block text-sm font-medium mb-2">Grouped Options</label>
        <Combobox
          :options="groupedOptions"
          v-model="groupedValue"
          :placeholder="state.placeholder"
          :disabled="state.disabled"
        />
        <div class="mt-2 text-sm text-gray-600">
          Selected: {{ groupedValue || 'None' }}
        </div>
      </div>
    </Variant>

    <Variant title="Disabled State">
      <div class="p-4">
        <label class="block text-sm font-medium mb-2">Disabled Combobox</label>
        <Combobox
          :options="simpleOptions"
          v-model="disabledValue"
          placeholder="This is disabled"
          :disabled="true"
        />
      </div>
    </Variant>

    <Variant title="Pre-selected Value">
      <div class="p-4">
        <label class="block text-sm font-medium mb-2">Pre-selected Value</label>
        <Combobox
          :options="objectOptions"
          v-model="preselectedValue"
          :placeholder="state.placeholder"
          :disabled="state.disabled"
        />
        <div class="mt-2 text-sm text-gray-600">
          Selected: {{ preselectedValue || 'None' }}
        </div>
      </div>
    </Variant>

    <Variant title="Multiple Selection - Simple">
      <div class="p-4">
        <label class="block text-sm font-medium mb-2"
          >Multiple Simple Options</label
        >
        <Combobox
          :options="simpleOptions"
          v-model="multipleSimpleValue"
          :placeholder="state.placeholder"
          :disabled="state.disabled"
          :show-cancel="state.showCancel"
          :multiple="true"
        />
        <div class="mt-2 text-sm text-gray-600">
          Selected:
          {{
            multipleSimpleValue.length > 0
              ? multipleSimpleValue.join(', ')
              : 'None'
          }}
        </div>
      </div>
    </Variant>

    <Variant title="Multiple Selection - Objects">
      <div class="p-4">
        <label class="block text-sm font-medium mb-2"
          >Multiple Object Options</label
        >
        <Combobox
          :options="objectOptions"
          v-model="multipleObjectValue"
          :placeholder="state.placeholder"
          :disabled="state.disabled"
          :multiple="true"
        />
        <div class="mt-2 text-sm text-gray-600">
          Selected:
          {{
            multipleObjectValue.length > 0
              ? multipleObjectValue.join(', ')
              : 'None'
          }}
        </div>
      </div>
    </Variant>

    <Variant title="Multiple Selection - Grouped">
      <div class="p-4">
        <label class="block text-sm font-medium mb-2"
          >Multiple Grouped Options</label
        >
        <Combobox
          :options="groupedOptions"
          v-model="multipleGroupedValue"
          :placeholder="state.placeholder"
          :disabled="state.disabled"
          :multiple="true"
        />
        <div class="mt-2 text-sm text-gray-600">
          Selected:
          {{
            multipleGroupedValue.length > 0
              ? multipleGroupedValue.join(', ')
              : 'None'
          }}
        </div>
      </div>
    </Variant>

    <Variant title="Complex Objects with Display Value">
      <div class="p-4">
        <label class="block text-sm font-medium mb-2">Complex Objects</label>
        <Combobox
          :options="complexObjects"
          v-model="complexObjectValue"
          :display-value="(obj) => (obj ? `${obj.label} - ${obj.email}` : '')"
          :placeholder="state.placeholder"
          :disabled="state.disabled"
          :show-cancel="state.showCancel"
        />
        <div class="mt-2 text-sm text-gray-600">
          Selected: {{ complexObjectValue || 'None' }}
        </div>
      </div>
    </Variant>

    <template #controls>
      <HstText v-model="state.placeholder" title="Placeholder" />
      <HstCheckbox v-model="state.disabled" title="Disabled" />
      <HstCheckbox v-model="state.showCancel" title="Show Cancel Button" />
    </template>
  </Story>
</template>
