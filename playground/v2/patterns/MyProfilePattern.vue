<script setup lang="ts">
import { ref } from 'vue'
import { Avatar, Button, FileUploader, FormControl } from '../../../src'
import * as pending from '../pendingFrappeUIChanges'
import { profilePhoto } from '../profilePhoto'

// A face out of the Espresso file rather than a remote sample: the pattern
// has to draw the same on any machine, online or not — and cut at 4x, since
// this avatar is drawn at 72px.
const photo = ref<string | null>(profilePhoto)
const name = ref('Shantanu Mishra')
</script>

<template>
  <div class="w-[700px] max-w-full">
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-4">
        <!-- 72px in the design; frappe-ui's Avatar scale stops at 46px (3xl). -->
        <Avatar
          size="3xl"
          :class="pending.avatarProfileSize"
          :image="photo ?? undefined"
          label="Shantanu Mishra"
        />

        <div class="flex min-w-0 flex-col gap-1">
          <!--
            Two ghost buttons with a dot between them. `-ml-2` cancels the
            first button's own padding so its label sits on the same left edge
            as the line below it.
          -->
          <div class="flex items-center">
            <FileUploader :file-types="['image/*']" class="-ml-2">
              <template #default="{ openFileSelector }">
                <Button
                  variant="ghost"
                  label="Upload new photo"
                  @click="openFileSelector"
                />
              </template>
            </FileUploader>
            <!--
              The design's `dot` icon, 12px. `-mx-1.5` trims the glyph's own
              empty box so the ink sits ~8px from each label, as it does there.
            -->
            <span
              class="lucide-dot -mx-1.5 size-4 shrink-0 text-ink-gray-6"
              aria-hidden="true"
            />
            <Button variant="ghost" label="Remove" @click="photo = null" />
          </div>
          <p class="text-p-sm text-ink-gray-6">
            Photos help people recognise you
          </p>
        </div>
      </div>

      <!-- The design's field is 260 of a 296 frame; half the body here, as in Branding. -->
      <FormControl
        v-model="name"
        class="w-1/2"
        size="md"
        label="Name"
        placeholder="Your full name"
      />
    </div>
  </div>
</template>
