<script setup lang="ts">
// Adapted from crm/TaskModal.vue — "Create / Edit task" form using the
// canonical `#default` slot for the form and `#actions` slot for the
// reactive submit/cancel pair. Title flips between create/edit modes.
import { computed, ref } from 'vue'
import { Button, Dialog, FormControl } from 'frappe-ui'

const open = ref(false)
const editMode = ref(false)

const task = ref({ title: '', status: 'Backlog', description: '' })

const statusOptions = [
  { label: 'Backlog', value: 'Backlog' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Done', value: 'Done' },
]

const title = computed(() => (editMode.value ? 'Edit task' : 'Create task'))
</script>

<template>
  <div class="w-full flex gap-2">
    <Button @click="((editMode = false), (open = true))">New task</Button>
    <Button
      variant="outline"
      @click="
        ((editMode = true),
        (task = {
          title: 'Wire up release notes',
          status: 'In Progress',
          description: 'Pull v1.x highlights into the public changelog.',
        }),
        (open = true))
      "
    >
      Edit task
    </Button>
  </div>

  <Dialog v-model:open="open" :title="title" size="xl">
    <div class="flex flex-col gap-4">
      <FormControl label="Title" v-model="task.title" placeholder="Add title" />
      <FormControl
        label="Status"
        type="select"
        v-model="task.status"
        :options="statusOptions"
      />
      <FormControl
        label="Description"
        type="textarea"
        v-model="task.description"
        placeholder="What needs to happen?"
      />
    </div>

    <template #actions="{ close }">
      <div class="flex flex-row-reverse gap-2">
        <Button variant="solid" @click="close">
          {{ editMode ? 'Update' : 'Create' }}
        </Button>
        <Button variant="outline" @click="close">Cancel</Button>
      </div>
    </template>
  </Dialog>
</template>
