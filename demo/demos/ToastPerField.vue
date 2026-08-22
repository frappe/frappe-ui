<script setup>
import { computed, reactive, ref } from 'vue'
import { Button, FormControl, TabButtons, toast } from 'frappe-ui'

const roles = ['Maintainer', 'Reviewer', 'Writer']
const teams = ['Design systems', 'Platform', 'Docs']

const fields = [
  { key: 'fullName', label: 'Full name', noun: 'name', type: 'text' },
  { key: 'email', label: 'Email', noun: 'email', type: 'email' },
  { key: 'role', label: 'Role', noun: 'role', type: 'select', options: roles },
  { key: 'team', label: 'Team', noun: 'team', type: 'select', options: teams },
]

const initial = {
  fullName: 'Nadia Haddad',
  email: 'nadia@example.com',
  role: 'Maintainer',
  team: 'Design systems',
}

// Recording aid: `?mode=reused` opens on the second example and `?duration=`
// (ms) holds the toasts on screen for the length of a take.
const params = new URLSearchParams(location.search)

// Toasts hang around a little longer than the default, so the point stays on
// screen while you talk. The list of edited fields clears with the last toast.
const DURATION = Number(params.get('duration')) || 6000
const REUSE_TOAST_ID = 'contact-saved'

const modes = [
  { value: 'perField', label: 'A toast per field' },
  { value: 'reused', label: 'One toast, reused' },
]
const mode = ref(params.get('mode') === 'reused' ? 'reused' : 'perField')

const values = reactive({ ...initial })
let saved = { ...initial }
let edited = []
let timer = null

// Text inputs commit on `change` — that is, on blur, the usual auto-save form.
// Select has no native change event, so it commits on the model update.
function saveOn(field) {
  if (field.type === 'select') {
    return { 'onUpdate:modelValue': (value) => save(field, value) }
  }
  return { onChange: (event) => save(field, event.target.value) }
}

function save(field, value) {
  if (value === saved[field.key]) return
  saved[field.key] = value
  if (!edited.includes(field.noun)) edited.push(field.noun)

  clearTimeout(timer)
  timer = setTimeout(() => (edited = []), DURATION)

  if (mode.value === 'perField') {
    // One toast per field: four edits, four rows fighting for the same corner.
    toast.success(`${field.label} updated`, { duration: DURATION })
  } else {
    // One toast, reused: the same row is rewritten with every field so far.
    toast.success(`${sentence(edited)} updated`, {
      id: REUSE_TOAST_ID,
      duration: DURATION,
    })
  }
}

function sentence(nouns) {
  const text =
    nouns.length < 2
      ? nouns[0]
      : `${nouns.slice(0, -1).join(', ')} and ${nouns[nouns.length - 1]}`
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// Every take starts from the same state, on both the switch and the button.
function reset() {
  toast.dismiss()
  clearTimeout(timer)
  Object.assign(values, initial)
  saved = { ...initial }
  edited = []
}

const activeMode = computed({
  get: () => mode.value,
  set: (value) => {
    mode.value = value
    reset()
  },
})
</script>

<template>
  <div class="min-h-screen bg-surface-base p-6 text-ink-gray-9">
    <div class="mx-auto flex max-w-md flex-col gap-4 pt-16">
      <TabButtons v-model="activeMode" :options="modes" />

      <div class="rounded-lg border border-outline-gray-2 bg-surface-white p-4">
        <div class="mb-4 flex items-center justify-between gap-2">
          <h1 class="text-base font-medium text-ink-gray-8">Profile</h1>
          <Button label="Reset" icon-left="lucide-rotate-ccw" @click="reset" />
        </div>

        <div class="flex flex-col gap-3">
          <FormControl
            v-for="field in fields"
            :key="field.key"
            v-model="values[field.key]"
            :type="field.type"
            :label="field.label"
            :options="field.options"
            v-bind="saveOn(field)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
