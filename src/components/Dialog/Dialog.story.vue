<script setup lang="ts">
import { ref } from 'vue'
import Dialog from './Dialog.vue'
import { Button } from '../Button'
import { Dropdown } from '../Dropdown'
import LucideSettings from '~icons/lucide/settings'
import LucideStar from '~icons/lucide/star'
import LucideChevronDown from '~icons/lucide/chevron-down'
import { Autocomplete } from '../Autocomplete'

const dialog1 = ref(false)
const dialog2 = ref(false)
const dialog3 = ref(false)
const dialog4 = ref(false)
const dialog5 = ref(false)
const dialog6 = ref(false)

// Dropdown state
const selectedOption = ref('Option 1')

const autocompleteValue = ref({ label: '', value: '' })

const dropdownOptions = [
  {
    label: 'Option 1',
    onClick: () => {
      selectedOption.value = 'Option 1'
    },
  },
  {
    label: 'Option 2',
    onClick: () => {
      selectedOption.value = 'Option 2'
    },
  },
  {
    label: 'Option 3',
    onClick: () => {
      selectedOption.value = 'Option 3'
    },
  },
  {
    group: 'Advanced Options',
    items: [
      {
        label: 'Advanced Option A',
        icon: LucideSettings,
        onClick: () => {
          selectedOption.value = 'Advanced Option A'
        },
      },
      {
        label: 'Advanced Option B',
        icon: LucideStar,
        onClick: () => {
          selectedOption.value = 'Advanced Option B'
        },
      },
    ],
  },
]

const createPromise = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, 2000)
  })
}
</script>

<template>
  <Story :layout="{ width: 500, type: 'grid' }">
    <!-- 1. Basic Dialog with Actions -->
    <Variant title="Basic Dialog with Actions" autoPropsDisabled>
      <Button @click="dialog1 = true">Show Confirmation Dialog</Button>
      <Dialog
        :options="{
          title: 'Confirm Action',
          message: 'Are you sure you want to proceed with this action?',
          size: 'lg',
          icon: {
            name: 'alert-triangle',
            appearance: 'warning',
          },
          actions: [
            {
              label: 'Confirm',
              variant: 'solid',
              onClick: () => createPromise(),
            },
          ],
        }"
        v-model="dialog1"
      />
    </Variant>

    <!-- 2. Custom Content with Slots -->
    <Variant title="Custom Content with Slots" autoPropsDisabled>
      <Button @click="dialog2 = true">Show Custom Dialog</Button>
      <Dialog v-model="dialog2">
        <template #body-title>
          <h3 class="text-2xl font-semibold text-blue-600">
            Custom Title with Styling
          </h3>
        </template>
        <template #body-content>
          <div class="space-y-4">
            <p class="text-gray-700">
              This dialog uses custom slots for flexible content layout.
            </p>
            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="text-blue-800">
                You can put any content here including forms, lists, or other
                components.
              </p>
            </div>
          </div>
        </template>
        <template #actions="{ close }">
          <div class="flex justify-start flex-row-reverse gap-2">
            <Button variant="solid" @click="close">Save Changes</Button>
            <Button variant="outline" @click="close">Cancel</Button>
          </div>
        </template>
      </Dialog>
    </Variant>

    <!-- 3. Different Sizes -->
    <Variant title="Different Sizes" autoPropsDisabled>
      <div class="space-x-2">
        <Button @click="dialog3 = true">Small Dialog</Button>
        <Button @click="dialog4 = true">Large Dialog</Button>
      </div>

      <!-- Small Dialog -->
      <Dialog
        :options="{
          title: 'Small Dialog',
          message: 'This is a small dialog.',
          size: 'sm',
          actions: [{ label: 'OK', variant: 'solid' }],
        }"
        v-model="dialog3"
      />

      <!-- Large Dialog -->
      <Dialog
        :options="{
          title: 'Large Dialog',
          message: 'This is a large dialog with more space for content.',
          size: '4xl',
          actions: [{ label: 'OK', variant: 'solid' }],
        }"
        v-model="dialog4"
      />
    </Variant>

    <!-- 4. Disable Outside Click -->
    <Variant title="Disable Outside Click to Close" autoPropsDisabled>
      <Button @click="dialog5 = true">Show Modal Dialog</Button>
      <Dialog
        :options="{
          title: 'Modal Dialog',
          message:
            'This dialog cannot be closed by clicking outside. Use the buttons or ESC key.',
          actions: [{ label: 'Close', variant: 'solid' }],
        }"
        :disable-outside-click-to-close="true"
        v-model="dialog5"
      />
    </Variant>

    <!-- 5. Dialog with Interactive Components -->
    <Variant title="Dialog with Interactive Components" autoPropsDisabled>
      <Button @click="dialog6 = true">Show Settings Dialog</Button>
      <Dialog v-model="dialog6">
        <template #body-title>
          <h3 class="text-2xl font-semibold text-ink-gray-9">
            Settings Dialog
          </h3>
        </template>
        <template #body-content>
          <div class="space-y-6 text-base">
            <p class="text-gray-700">
              This dialog contains interactive elements to test proper layering.
            </p>

            <Autocomplete
              :options="[
                { label: 'Option A', value: 'A' },
                { label: 'Option B', value: 'B' },
                { label: 'Option C', value: 'C' },
              ]"
              placeholder="Type to search..."
              v-model="autocompleteValue"
            />

            <div class="space-y-3">
              <label class="block text-sm font-medium text-gray-700">
                Select an option:
              </label>
              <Dropdown :options="dropdownOptions" placement="left">
                <Button variant="outline">
                  {{ selectedOption }}

                  <template #suffix>
                    <LucideChevronDown class="h-4 w-4 text-gray-500" />
                  </template>
                </Button>
              </Dropdown>
            </div>

            <div class="bg-gray-50 text-p-sm p-4 text-ink-gray-6 rounded-lg">
              <p><strong>Selected value:</strong> {{ selectedOption }}</p>
              <p class="mt-1">
                Interactive components should work properly within dialogs.
              </p>
            </div>
          </div>
        </template>
        <template #actions="{ close }">
          <div class="flex space-x-2">
            <Button variant="solid" @click="close">Save Settings</Button>
            <Button variant="outline" @click="close">Cancel</Button>
          </div>
        </template>
      </Dialog>
    </Variant>
  </Story>
</template>
