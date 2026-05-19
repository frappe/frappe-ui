<script setup lang="ts">
// Adapted from insights/ConnectPostgreSQLDialog.vue — a multi-state form
// dialog where the primary action's label/theme transitions as the
// connection is tested. Demonstrates state-driven action buttons inside
// a non-dismissible dialog.
import { computed, reactive, ref } from 'vue'
import { Button, Dialog, FormControl } from 'frappe-ui'

const open = ref(false)
const db = reactive({ host: 'localhost', port: '5432', user: '', password: '' })

type ConnState = 'idle' | 'testing' | 'connected' | 'failed'
const state = ref<ConnState>('idle')

async function testConnection({ close }: { close: () => void }) {
  state.value = 'testing'
  await new Promise((r) => setTimeout(r, 900))
  state.value = db.user ? 'connected' : 'failed'
}

const testButton = computed(() => {
  if (state.value === 'testing') return { label: 'Testing…', loading: true }
  if (state.value === 'connected')
    return { label: 'Connected', theme: 'green' as const, variant: 'outline' as const }
  if (state.value === 'failed')
    return { label: 'Failed, retry?', theme: 'red' as const, variant: 'outline' as const }
  return { label: 'Test connection', variant: 'outline' as const }
})
</script>

<template>
  <Button @click="open = true">Connect to PostgreSQL…</Button>

  <Dialog
    v-model:open="open"
    title="Connect to PostgreSQL"
    :dismissible="false"
  >
    <div class="flex flex-col gap-4">
      <FormControl label="Host" v-model="db.host" />
      <FormControl label="Port" v-model="db.port" />
      <FormControl label="User" v-model="db.user" placeholder="postgres" />
      <FormControl label="Password" type="password" v-model="db.password" />
    </div>

    <template #actions="{ close }">
      <div class="flex flex-row-reverse gap-2">
        <Button
          variant="solid"
          :disabled="state !== 'connected'"
          @click="close"
        >
          Submit
        </Button>
        <Button v-bind="testButton" @click="testConnection({ close })" />
      </div>
    </template>
  </Dialog>
</template>
