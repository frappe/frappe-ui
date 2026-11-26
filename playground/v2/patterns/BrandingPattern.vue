<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Avatar, Button, FileUploader, FormControl } from '../../../src'
import { List, ListCell, ListRow } from '../../../src/molecules/list'

const brandName = ref('')

// The Frappe CRM app icon, traced out of the Espresso file (node
// 35103:116643) rather than drawn by hand: the magenta squircle with its
// funnel mark. Image content — an uploaded logo — so its colours are literal,
// not theme tokens.
const CRM_LOGO =
  'data:image/svg+xml,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 56' fill='none'>" +
      "<path fill='#DB4EE0' d='M0 22.4C0 14.5593 0 10.6389 1.52591 7.64413C2.86814 5.00986 5.00986 2.86814 7.64413 1.52591C10.6389 0 14.5593 0 22.4 0H33.6C41.4407 0 45.3611 0 48.3559 1.52591C50.9901 2.86814 53.1319 5.00986 54.4741 7.64413C56 10.6389 56 14.5593 56 22.4V33.6C56 41.4407 56 45.3611 54.4741 48.3559C53.1319 50.9901 50.9901 53.1319 48.3559 54.4741C45.3611 56 41.4407 56 33.6 56H22.4C14.5593 56 10.6389 56 7.64413 54.4741C5.00986 53.1319 2.86814 50.9901 1.52591 48.3559C0 45.3611 0 41.4407 0 33.6V22.4Z'/>" +
      "<path fill='#F1FCFF' d='M10.0488 13.1641V18.1887H40.9255V21.9572L30.0271 32.7603V38.6392H25.9351V32.7603C25.9351 32.7603 19.5706 26.3538 17.2592 24.0927H10.074L20.0312 34.0165C20.609 34.5692 20.9356 35.348 20.9356 36.152V42.0811L35.0517 42.1313V36.152C35.0517 35.348 35.3783 34.5692 35.9562 34.0165L45.9501 24.0676V13.1641H10.0488Z'/>" +
      '</svg>',
  )

// The design shows one of each state — the logo set (preview + Remove), the
// favicon empty (placeholder + Upload) — and each row flips between the two.
const assets = reactive([
  {
    key: 'logo',
    title: 'Logo',
    description:
      'Appears in the left sidebar. Recommended size is 32×32 px in PNG or SVG',
    fileTypes: ['.png', '.svg'],
    url: CRM_LOGO as string | null,
  },
  {
    key: 'favicon',
    title: 'Favicon',
    description:
      'Appears next to the title in your browser tab. Recommended size is 32×32 px in PNG or ICO',
    fileTypes: ['.png', '.ico'],
    url: null as string | null,
  },
])
</script>

<template>
  <!--
    24px between the name field and the upload rows (the design has 16 — trying
    the larger gap), 16px between the two rows themselves.
  -->
  <div class="flex w-[700px] max-w-full flex-col gap-6">
    <!-- Half the width, as the design sizes it (350 of 700). -->
    <FormControl
      v-model="brandName"
      class="w-1/2"
      size="md"
      label="Brand name"
      placeholder="Enter brand name"
    />

    <!--
      The upload rows are a frappe-ui List in its default feed layout — leading
      media, content, trailing cell — which is exactly this row's shape. Each
      row holds a button, so rows stay static (no row click, no hover); their
      height is the 80px tile. `divider="none"`: the design has no rules
      between them. `list-gap-3.5` is the 14px from tile to text; the trailing
      cell adds 18px more so the button sits 32px from the text, as designed.
    -->
    <List class="flex flex-col gap-4 list-gap-3.5" divider="none">
      <ListRow v-for="asset in assets" :key="asset.key">
        <ListCell>
          <!--
            Preview tile: an 80px square, border only. There is no Card
            component, so the surface is built from tokens. It holds the image
            as a square `xl` Avatar (32px, 6px radius — the design's avatar
            exactly), or the empty-state image glyph.
          -->
          <div
            class="flex size-20 shrink-0 items-center justify-center rounded-6 border border-outline-gray-1"
          >
            <Avatar
              v-if="asset.url"
              :image="asset.url"
              :label="asset.title"
              size="xl"
              shape="square"
            />
            <span
              v-else
              class="lucide-image size-5 text-ink-gray-4"
              aria-hidden="true"
            />
          </div>
        </ListCell>

        <ListCell>
          <div class="min-w-0">
            <div class="text-base-medium text-ink-gray-8">
              {{ asset.title }}
            </div>
            <p class="mt-1 text-p-base text-ink-gray-6">
              {{ asset.description }}
            </p>
          </div>
        </ListCell>

        <ListCell class="justify-end pl-[18px]">
          <Button v-if="asset.url" label="Remove" @click="asset.url = null" />
          <!--
            Logos and favicons are shown to every visitor, so the upload is
            deliberately public. The playground has no Frappe server behind it,
            so picking a file doesn't complete the upload.
          -->
          <FileUploader
            v-else
            :file-types="asset.fileTypes"
            :private="false"
            @success="(file) => (asset.url = file.file_url)"
          >
            <template #default="{ openFileSelector, uploading }">
              <Button
                icon-left="lucide-arrow-up-to-line"
                label="Upload"
                :loading="uploading"
                @click="openFileSelector"
              />
            </template>
          </FileUploader>
        </ListCell>
      </ListRow>
    </List>
  </div>
</template>
