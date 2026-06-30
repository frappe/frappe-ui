<script setup lang="ts">
import { ref } from 'vue'
import {
  FormControl,
  SettingsBody,
  SettingsHeader,
  SettingsPanel,
} from 'frappe-ui'

const firstName = ref('Jane')
const lastName = ref('Doe')
const email = ref('jane.doe@example.com')
</script>

<template>
  <SettingsPanel>
    <SettingsHeader
      title="Profile"
      description="Manage your personal information."
    />
    <SettingsBody>
      <div class="flex flex-col gap-4">
        <div class="flex gap-4">
          <FormControl class="flex-1" label="First name" v-model="firstName" />
          <FormControl class="flex-1" label="Last name" v-model="lastName" />
        </div>
        <FormControl label="Email" v-model="email" />
      </div>
    </SettingsBody>
  </SettingsPanel>
</template>
