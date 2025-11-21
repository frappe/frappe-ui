<script setup lang="ts">
import { ref, reactive, h } from 'vue'
import Combobox from './Combobox.vue'
import LucidePlus from '~icons/lucide/plus'
import LucideSearch from '~icons/lucide/search'
import LucideSettings from '~icons/lucide/settings'
import { Avatar } from '../Avatar'

const simpleValue = ref('')
const objectValue = ref('')
const iconValue = ref('')
const groupedValue = ref('')
const disabledValue = ref('')
const preselectedValue = ref('john-doe')
const customOptionValue = ref('')
const customWithRenderValue = ref('')
const customWithSlotValue = ref('')
const selectedOption = ref(null)

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

// Custom options that appear conditionally
const customOptions = [
  ...objectOptions,
  {
    type: 'custom' as const,
    key: 'create-new',
    label: 'Create New Item',
    icon: LucidePlus,
    condition: (context: { searchTerm: string }) =>
      context.searchTerm.toLowerCase().includes('new') ||
      context.searchTerm.toLowerCase().includes('create'),
    onClick: (context: { searchTerm: string }) => {
      alert(`Creating new item: "${context.searchTerm}"`)
    },
  },
  {
    type: 'custom' as const,
    key: 'advanced-search',
    label: 'Advanced Search',
    icon: LucideSearch,
    condition: (context: { searchTerm: string }) =>
      context.searchTerm.length > 3,
    onClick: (context: { searchTerm: string }) => {
      alert(`Opening advanced search for: "${context.searchTerm}"`)
    },
    keepOpen: true,
  },
]

// Custom options with render functions
const customRenderOptions = [
  ...objectOptions.slice(0, 3),
  {
    type: 'custom' as const,
    key: 'help-option',
    label: 'Need Help?',
    render: () => [
      h(LucideSettings, { class: 'size-4' }),
      h('span', { class: 'font-medium ml-2' }, 'Need Help?'),
    ],
    onClick: () => {
      alert('Opening help documentation...')
    },
  },
]

// Custom options with slot names
const customSlotOptions = [
  ...objectOptions.slice(0, 2),
  {
    type: 'custom' as const,
    key: 'user-profile',
    label: 'View User Profile',
    slotName: 'user-profile',
    onClick: () => {
      alert('Opening user profile...')
    },
  },
  {
    type: 'custom' as const,
    key: 'settings',
    label: 'Open Settings',
    slotName: 'settings',
    condition: (context: { searchTerm: string }) =>
      context.searchTerm.toLowerCase().includes('setting') ||
      context.searchTerm.toLowerCase().includes('config'),
    onClick: () => {
      alert('Opening settings...')
    },
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

    <Variant title="Outline variant">
      <div class="p-4">
        <label class="block text-sm font-medium mb-2">Simple Options</label>
        <Combobox
          variant="outline"
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

    <Variant title="Custom Options with onClick">
      <div class="p-4">
        <label class="block text-sm font-medium mb-2">Custom Options</label>
        <Combobox
          :options="customOptions"
          v-model="customOptionValue"
          :placeholder="state.placeholder"
          :disabled="state.disabled"
          :show-cancel="state.showCancel"
        />
        <div class="mt-2 text-sm text-gray-600">
          Selected: {{ customOptionValue || 'None' }}
        </div>
        <div class="mt-2 text-xs text-gray-500">
          Try typing 'new' or 'create' to see custom options
        </div>
      </div>
    </Variant>

    <Variant title="Custom Options with Render Function">
      <div class="p-4">
        <label class="block text-sm font-medium mb-2">
          Custom Render Options
        </label>
        <Combobox
          :options="customRenderOptions"
          v-model="customWithRenderValue"
          :placeholder="state.placeholder"
          :disabled="state.disabled"
        />
        <div class="mt-2 text-sm text-gray-600">
          Selected: {{ customWithRenderValue || 'None' }}
        </div>
        <div class="mt-2 text-xs text-gray-500">
          Custom options with render functions and conditional display
        </div>
      </div>
    </Variant>

    <Variant title="Custom Options with Slots">
      <div class="p-4">
        <label class="block text-sm font-medium mb-2">
          Custom Slot Options
        </label>
        <Combobox
          :options="customSlotOptions"
          v-model="customWithSlotValue"
          :placeholder="state.placeholder"
          :disabled="state.disabled"
        >
          <template #user-profile="{ option }">
            <Avatar label="F" size="sm" />
            <span class="ml-2"> View User Profile → </span>
          </template>
          <template #settings="{ option }">
            <div class="flex items-center gap-2">
              <LucideSettings class="w-4 h-4 text-gray-600" />
              <div class="font-medium text-sm">Open Settings</div>
            </div>
          </template>
        </Combobox>
        <div class="mt-2 text-sm text-gray-600">
          Selected: {{ customWithSlotValue || 'None' }}
        </div>
        <div class="mt-2 text-xs text-gray-500">
          Try typing 'setting' to see the settings option. Slots allow full
          template control.
        </div>
      </div>
    </Variant>

    <template #controls>
      <HstText v-model="state.placeholder" title="Placeholder" />
      <HstCheckbox v-model="state.disabled" title="Disabled" />
    </template>
  </Story>
</template>
