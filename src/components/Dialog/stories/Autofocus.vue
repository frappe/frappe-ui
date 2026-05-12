<script setup lang="ts">
// Two ways to opt a Dialog into focusing a specific element on open:
//
// 1. Put `autofocus` on the component itself when it forwards attrs to
//    its focusable DOM node (TextInput, Textarea, Checkbox, Button, and
//    anything wrapped in FormControl).
// 2. Wrap with `<div autofocus>…</div>` for components that don't (Switch,
//    Combobox, Select, Autocomplete). Dialog walks into the marker and
//    focuses the first focusable descendant.
import { ref } from 'vue'
import { Button, Dialog, FormControl, Switch } from 'frappe-ui'

const inviteOpen = ref(false)
const prefsOpen = ref(false)

const form = ref({ name: '', email: '' })
const prefs = ref({ notify: false, digest: true })
</script>

<template>
  <div class="flex gap-2">
    <Button @click="inviteOpen = true">Invite teammate</Button>
    <Button @click="prefsOpen = true">Edit preferences</Button>
  </div>

  <!-- Pattern 1: `autofocus` directly on a forwarding component -->
  <Dialog v-model:open="inviteOpen" title="Invite teammate">
    <div class="space-y-4">
      <FormControl
        label="Name"
        v-model="form.name"
        placeholder="Jane Doe"
        autofocus
      />
      <FormControl
        label="Email"
        type="email"
        v-model="form.email"
        placeholder="jane@example.com"
      />
    </div>

    <template #actions="{ close }">
      <div class="flex flex-row-reverse gap-2">
        <Button variant="solid" :disabled="!form.name" @click="close">
          Send invite
        </Button>
        <Button variant="outline" @click="close">Cancel</Button>
      </div>
    </template>
  </Dialog>

  <!-- Pattern 2: wrap a non-forwarding component with `<div autofocus>` -->
  <Dialog v-model:open="prefsOpen" title="Notification preferences">
    <div class="space-y-4">
      <div autofocus>
        <Switch
          label="Email me on every reply"
          v-model="prefs.notify"
        />
      </div>
      <Switch label="Weekly digest" v-model="prefs.digest" />
    </div>

    <template #actions="{ close }">
      <div class="flex flex-row-reverse gap-2">
        <Button variant="solid" @click="close">Save</Button>
        <Button variant="outline" @click="close">Cancel</Button>
      </div>
    </template>
  </Dialog>
</template>
