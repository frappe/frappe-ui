<script setup lang="ts">
import { ref } from 'vue'
import { Badge, Checkbox, FormControl, Password } from '../../../src'
import * as pending from '../pendingFrappeUIChanges'

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
        <!--
          frappe-ui's Password: a text field that carries its own reveal
          toggle. The toggle is a fixed size whatever the field is, so it
          carries `pending.passwordToggle`; its glyph is swapped for
          Espresso's in the style block below.
        -->
        <Password
          v-model="password"
          class="min-w-0 flex-1"
          :class="pending.passwordToggle"
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

<!--
  Espresso's `icon/line/preview` (component 23513:51264) in place of lucide's
  eye. `Password` renders its own suffix with no slot to reach it, so the
  glyph is swapped where lucide puts it — on the mask, which is how the icon
  plugin draws every `lucide-*` class. A mask reads alpha only, so the fill in
  the data URI is irrelevant.

  Only the shown state is Espresso's: the file's hide glyph isn't in the node
  that was linked, so `lucide-eye-off` still draws the toggled state.
-->
<style scoped>
:deep(.lucide-eye) {
  mask-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.9976 4.85742C19.7543 4.85742 24.6877 8.40791 26.939 13.4746C27.0871 13.8085 27.0871 14.1896 26.939 14.5234C24.688 19.5909 19.7549 23.1406 13.9976 23.1406C8.24082 23.1403 3.30717 19.5905 1.0562 14.5234C0.90856 14.1897 0.908139 13.8082 1.0562 13.4746L1.27495 13.0039C3.61617 8.18904 8.42074 4.85783 13.9976 4.85742ZM13.9976 6.85742C9.20448 6.85784 5.02756 9.74834 3.01519 13.998C5.02722 18.2489 9.20365 21.1403 13.9976 21.1406C18.7916 21.1406 22.9658 18.2487 24.9781 13.998C22.9653 9.74888 18.7906 6.85742 13.9976 6.85742ZM13.9996 9.625C16.4158 9.62504 18.3746 11.5838 18.3746 14C18.3745 16.4162 16.4158 18.375 13.9996 18.375C11.5833 18.375 9.62459 16.4162 9.62456 14C9.62456 11.5838 11.5833 9.625 13.9996 9.625ZM13.9996 11.625C12.6879 11.625 11.6246 12.6883 11.6246 14C11.6246 15.3117 12.6879 16.375 13.9996 16.375C15.3112 16.375 16.3745 15.3116 16.3746 14C16.3746 12.6883 15.3112 11.625 13.9996 11.625Z" fill="black"/></svg>');
}
</style>
