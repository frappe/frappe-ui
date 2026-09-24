<script setup lang="ts">
import { ref } from 'vue'
import { Badge, Checkbox, FormControl, Password } from '../../../src'

const domain = ref('')
const port = ref('')
const login = ref('')
const password = ref('')
const useSSL = ref(true)
const useIMAP = ref(false)
</script>

<template>
  <div class="flex w-[700px] max-w-full flex-col gap-6">
    <!--
      Two field rows. The design's columns are 340 + 350 with a 10px gap, so
      the first field is fixed and the second takes the rest.
    -->
    <div class="flex flex-col gap-6">
      <div class="flex items-start gap-[10px]">
        <FormControl
          v-model="domain"
          class="w-[340px] shrink-0"
          size="md"
          label="Incoming Email Server Domain"
          placeholder="pop.frappe.com"
          description="e.g. pop.frappe.com / imap.frappe.com"
        />
        <!--
          The second help text carries a leading icon in the design, so it
          goes through FormControl's `description` slot rather than the prop.
        -->
        <FormControl
          v-model="port"
          class="min-w-0 flex-1"
          size="md"
          label="IMAP Port"
          placeholder="993"
        >
          <template #description>
            <span class="flex items-center gap-1">
              <span
                class="lucide-alert-circle size-3.5 shrink-0"
                aria-hidden="true"
              />
              (e.g. POP3: 995/110, IMAP: 993/143)
            </span>
          </template>
        </FormControl>
      </div>

      <div class="flex items-start gap-[10px]">
        <FormControl
          v-model="login"
          class="w-[340px] shrink-0"
          size="md"
          label="Login"
          placeholder="you@frappe.com"
        />
        <!-- frappe-ui's Password: a text field that carries its own reveal toggle. -->
        <Password
          v-model="password"
          class="min-w-0 flex-1"
          size="md"
          label="Password"
          placeholder="Enter password"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-3">
        <Checkbox
          v-model="useSSL"
          size="md"
          label="Connect with SSL/TLS Encryption"
        />
        <Badge theme="violet" variant="subtle" size="lg">
          <template #prefix>
            <span class="lucide-shield-check size-3.5" aria-hidden="true" />
          </template>
          Enable enhanced security
        </Badge>
      </div>
      <Checkbox v-model="useIMAP" size="md" label="Use IMAP" />
    </div>
  </div>
</template>
