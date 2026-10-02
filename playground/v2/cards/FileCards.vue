<script setup lang="ts">
// Figma: espresso-2.0 › card › type=file — the outline and ghost pairs,
// every value read from the file. Icons and thumbnails come from it too.
//   outline sm (31286:71009) 172 × 172, 12px radius, on the card surface
//     behind a 1px outline-gray-1 border: a 116px gray-2 preview with the
//     40px file icon centred, then p 10 · 4px gaps — 14/500 gray-700 name
//     over a meta row of the 16px icon · 8px · 12 gray-500 "Zip · May 22"
//   outline md (31901:21554) 172 × 174, as above with a 16/500 name and
//     13 gray-500 meta
//   ghost sm (31903:6575) 172 × 221, 12px gaps, no card frame: a 175px
//     16px-radius thumbnail carrying the md elevation shadow, then the
//     14/500 gray-800 name over 12 gray-600 "Viewed 7 hours ago", with a
//     24px gray-2 ⋯ button on the right (4px between name and line). The
//     file draws that button in the hover state, so it fades in with the
//     card (and on keyboard focus); it keeps its space either way, so the
//     name does not jump
//   ghost md (31286:71011) 225 × 281: a 230px thumbnail, a 16/500 name and
//     13 gray-600 line, 6px apart
import dotIcon from '../assets/cards/icons/dot-horizontal.svg?raw'
import zipIcon from '../assets/cards/icons/zip.svg?raw'
import previewMd from '../assets/cards/fc-preview-md.png'
import previewSm from '../assets/cards/fc-preview-sm.png'

const emit = defineEmits<{ actions: [file: string] }>()
</script>

<template>
  <div class="flex flex-wrap items-start justify-center gap-12">
    <!-- outline sm · md -->
    <section class="flex flex-col gap-3">
      <div class="flex items-start gap-8">
        <div class="flex flex-col gap-2">
          <article class="espresso-file-card h-[172px] w-[172px] rounded-6">
            <div
              class="flex h-[116px] shrink-0 items-center justify-center bg-surface-gray-2"
            >
              <span class="size-10" v-html="zipIcon" />
            </div>
            <div class="flex flex-col gap-1 p-2.5">
              <p
                class="flex h-4 items-center truncate text-base-medium text-ink-gray-7"
              >
                Illustration.aed
              </p>
              <p class="flex h-4 items-center gap-2">
                <span class="size-4 shrink-0" v-html="zipIcon" />
                <span class="truncate text-xs text-ink-gray-5"
                  >Zip · May 22</span
                >
              </p>
            </div>
          </article>
        </div>
        <div class="flex flex-col gap-2">
          <article class="espresso-file-card h-[174px] w-[172px] rounded-6">
            <div
              class="flex h-[116px] shrink-0 items-center justify-center bg-surface-gray-2"
            >
              <span class="size-10" v-html="zipIcon" />
            </div>
            <div class="flex flex-col gap-1 p-2.5">
              <p
                class="flex h-[18px] items-center truncate text-lg-medium text-ink-gray-7"
              >
                Illustration.aed
              </p>
              <p class="flex h-4 items-center gap-2">
                <span class="size-4 shrink-0" v-html="zipIcon" />
                <span class="truncate text-sm text-ink-gray-5"
                  >Zip · May 22</span
                >
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ghost sm · md -->
    <section class="flex flex-col gap-3">
      <div class="flex items-start gap-8">
        <div class="flex flex-col gap-2">
          <article class="group flex w-[172px] flex-col gap-3">
            <div
              class="espresso-file-preview h-[175px] w-full overflow-hidden rounded-7 shadow-md"
            >
              <img
                :src="previewSm"
                alt=""
                class="size-full object-cover object-top"
              />
            </div>
            <div class="flex items-start gap-2">
              <div class="flex min-w-0 flex-1 flex-col gap-1">
                <p
                  class="flex h-4 items-center truncate text-base-medium text-ink-gray-8"
                >
                  Campsite landing
                </p>
                <p
                  class="flex h-[14px] items-center truncate text-xs text-ink-gray-6"
                >
                  Viewed 7 hours ago
                </p>
              </div>
              <button
                type="button"
                class="flex size-6 shrink-0 items-center justify-center rounded-4 bg-surface-gray-2 text-ink-gray-7 opacity-0 transition-[opacity,background-color] group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-surface-gray-3 focus-visible:opacity-100"
                aria-label="Actions for Campsite landing"
                @click="emit('actions', 'Campsite landing')"
              >
                <span class="size-3.5" v-html="dotIcon" />
              </button>
            </div>
          </article>
        </div>
        <div class="flex flex-col gap-2">
          <article class="group flex w-[225px] flex-col gap-3">
            <div
              class="espresso-file-preview h-[230px] w-full overflow-hidden rounded-7 shadow-md"
            >
              <img
                :src="previewMd"
                alt=""
                class="size-full object-cover object-top"
              />
            </div>
            <div class="flex items-start gap-2">
              <div class="flex min-w-0 flex-1 flex-col gap-1.5">
                <p
                  class="flex h-[18px] items-center truncate text-lg-medium text-ink-gray-8"
                >
                  Campsite landing page
                </p>
                <p
                  class="flex h-[15px] items-center truncate text-sm text-ink-gray-6"
                >
                  Viewed 7 hours ago
                </p>
              </div>
              <button
                type="button"
                class="flex size-6 shrink-0 items-center justify-center rounded-4 bg-surface-gray-2 text-ink-gray-7 opacity-0 transition-[opacity,background-color] group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-surface-gray-3 focus-visible:opacity-100"
                aria-label="Actions for Campsite landing page"
                @click="emit('actions', 'Campsite landing page')"
              >
                <span class="size-3.5" v-html="dotIcon" />
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
/* the outline file card: the same shell as the other types */
.espresso-file-card {
  --card-surface: var(--surface-elevation-2);
  background-color: var(--card-surface);
  /* the hairline is drawn inside, so the 116px preview and 56px footer
     still add up to the card height the design fixes */
  box-shadow: inset 0 0 0 1px var(--outline-gray-1);
  @apply flex flex-col overflow-hidden;
}
/* the ghost card has no frame: the thumbnail itself is the raised surface */
.espresso-file-preview {
  background-color: var(--surface-elevation-2);
}
[data-theme='dark'] .espresso-file-card {
  --card-surface: var(--surface-elevation-1);
}
[data-theme='dark'] .espresso-file-preview {
  background-color: var(--surface-elevation-1);
}
</style>
