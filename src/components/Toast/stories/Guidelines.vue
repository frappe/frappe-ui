<script setup lang="ts">
import { defineComponent, h, ref } from 'vue'
import { Button, Select, TextInput, toast } from 'frappe-ui'

// A live toast shows in the page corner and closes after a few seconds, so a
// card can't hold two of them side by side. The cards draw each toast inline
// with ToastProvider's own classes. Its close button and action work: either
// one closes it, and "Show toast again" brings it back in the same spot.
const toastShell =
  'flex min-h-12 w-[360px] items-center gap-2 rounded-5 bg-surface-gray-9 px-4 py-2.5 shadow-xl'
const toastText = 'text-p-base font-medium text-ink-base'
const toastAction =
  'ml-auto inline-flex h-7 shrink-0 items-center rounded-4 px-2 text-base font-medium text-ink-blue-link hover:bg-surface-gray-8'
const toastClose =
  'grid size-5 shrink-0 place-items-center rounded-1 text-ink-base hover:bg-surface-gray-8'

const InlineToast = defineComponent({
  props: {
    text: { type: String, required: true },
    icon: { type: String, default: '' },
    iconClass: { type: String, default: 'text-ink-base' },
    action: { type: String, default: '' },
  },
  setup(props) {
    const open = ref(true)
    const close = () => (open.value = false)
    return () =>
      open.value
        ? h('div', { class: toastShell }, [
            props.icon
              ? h('span', {
                  class: [props.icon, 'size-4 shrink-0', props.iconClass],
                  'aria-hidden': 'true',
                })
              : null,
            h('span', { class: toastText }, props.text),
            props.action
              ? h(
                  'button',
                  { type: 'button', class: toastAction, onClick: close },
                  props.action,
                )
              : null,
            h(
              'button',
              {
                type: 'button',
                'aria-label': 'Close',
                class: [toastClose, props.action ? '' : 'ml-auto'],
                onClick: close,
              },
              [h('span', { class: 'lucide-x size-4', 'aria-hidden': 'true' })],
            ),
          ])
        : h('div', { class: 'flex min-h-12 w-[360px] items-center' }, [
            h(Button, {
              variant: 'ghost',
              size: 'sm',
              iconLeft: 'lucide-rotate-ccw',
              label: 'Show toast again',
              onClick: () => (open.value = true),
            }),
          ])
  },
})

// Card 1: validation errors in a toast name no field, and vanish before
// people find the one to fix. On the field, the error stays next to it.
const teamName = ref('')
const teamError = ref('Enter a team name.')
function createWithFieldError() {
  teamError.value = teamName.value.trim() ? '' : 'Enter a team name.'
}
const toastTeamName = ref('')
function createWithToast() {
  if (!toastTeamName.value.trim())
    toast.error('Please fill all required fields')
}

// Card 2: Builder's "Done" and "Warning", Drive's "There was an error.": a
// toast that says something happened, not what. A few words name it.

// Card 3: the field already shows the new value, so a toast after each
// change only repeats it. Change the status on each side.
const statuses = ['Open', 'Replied', 'Resolved', 'Closed']
const quietStatus = ref('Replied')
const noisyStatus = ref('Replied')
function toastEveryChange() {
  toast.success('Ticket updated successfully.')
}

// Card 4: when the action can be undone or stopped, the toast offers it.
// "Show all three" fires the real toasts, which also shows how they stack
// and spread out on hover.
const withActions = [
  { message: 'Moved “Q3 report” to Trash', action: 'Undo' },
  { message: '12 items archived', action: 'Undo' },
  { message: 'Background sync in progress', action: 'Cancel' },
]
function showAll() {
  withActions.forEach(({ message, action }, i) =>
    setTimeout(
      () => toast(message, { action: { label: action, onClick: () => {} } }),
      i * 300,
    ),
  )
}

const row = 'flex items-center gap-3'
const labelClass = 'w-20 text-sm leading-tighter text-ink-gray-6'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. The error sits on the field that needs fixing. Press Create on
         each side. -->
    <Guideline
      layout="stack"
      caption="Show a form's errors on its fields, not in a toast."
    >
      <template #do>
        <div class="flex w-[360px] items-start gap-2">
          <TextInput
            v-model="teamName"
            class="flex-1"
            aria-label="Team name"
            placeholder="Team name"
            :error="teamError"
          />
          <Button
            variant="solid"
            label="Create"
            @click="createWithFieldError"
          />
        </div>
      </template>
      <template #dont>
        <div class="flex w-[360px] flex-col gap-3">
          <div class="flex items-start gap-2">
            <TextInput
              v-model="toastTeamName"
              class="flex-1"
              aria-label="Team name"
              placeholder="Team name"
            />
            <Button variant="solid" label="Create" @click="createWithToast" />
          </div>
          <InlineToast
            text="Please fill all required fields"
            icon="lucide-circle-x"
            icon-class="text-ink-red-4"
          />
        </div>
      </template>
    </Guideline>

    <!-- 2. A few words that name what happened. -->
    <Guideline
      layout="stack"
      caption="Say what happened in a few words, like “Page copied to clipboard”, not just “Done” or “Error”."
    >
      <template #do>
        <InlineToast
          text="Page copied to clipboard"
          icon="lucide-circle-check"
        />
      </template>
      <template #dont>
        <InlineToast text="Done" icon="lucide-circle-check" />
      </template>
    </Guideline>

    <!-- 3. The changed field is the confirmation. Change the status on each
         side: only "don't" fires a toast. -->
    <Guideline
      layout="stack"
      caption="Don't confirm routine edits with a toast. The changed value already shows it worked."
    >
      <template #do>
        <div :class="row">
          <span :class="labelClass" aria-hidden="true">Status</span>
          <Select
            v-model="quietStatus"
            class="w-40"
            aria-label="Status"
            :options="statuses"
          />
        </div>
      </template>
      <template #dont>
        <div class="flex flex-col gap-3">
          <div :class="row">
            <span :class="labelClass" aria-hidden="true">Status</span>
            <Select
              v-model="noisyStatus"
              class="w-40"
              aria-label="Status"
              :options="statuses"
              @update:model-value="toastEveryChange"
            />
          </div>
          <InlineToast
            text="Ticket updated successfully."
            icon="lucide-circle-check"
          />
        </div>
      </template>
    </Guideline>

    <!-- 4. The action a toast offers depends on what just happened: Undo
         after a reversible change, Cancel while something runs. -->
    <Guideline
      :mark="false"
      caption="When an action can be undone or stopped, offer Undo or Cancel in the toast."
    >
      <template #do>
        <div class="flex flex-col items-center gap-3">
          <InlineToast
            v-for="t in withActions"
            :key="t.message"
            :text="t.message"
            :action="t.action"
          />
          <Button label="Show all three" size="sm" @click="showAll" />
        </div>
      </template>
    </Guideline>
  </div>
</template>
