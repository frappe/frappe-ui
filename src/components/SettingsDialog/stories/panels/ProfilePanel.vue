<script setup lang="ts">
import { ref } from 'vue'
import {
  Avatar,
  Button,
  FormControl,
  SettingsBody,
  SettingsHeader,
  Textarea,
} from 'frappe-ui'

const fullName = ref('Alex Rivera')
const bio = ref(
  'Product designer. Writing things down so we talk less and ship more.',
)
const email = ref('alex@example.com')
</script>

<template>
  <SettingsHeader
    title="Profile"
    description="How you appear across the community."
  />
  <SettingsBody>
    <div class="flex flex-col gap-6">
      <div class="flex items-center gap-4">
        <Avatar size="3xl" label="Alex Rivera" />
        <div class="flex gap-2">
          <Button>Upload photo</Button>
          <Button variant="ghost">Remove</Button>
        </div>
      </div>
      <FormControl label="Full name" v-model="fullName" />
      <Textarea label="Bio" v-model="bio" :rows="3" />
      <FormControl label="Email" type="email" v-model="email" disabled />
    </div>
  </SettingsBody>
</template>
