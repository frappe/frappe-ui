<script setup lang="ts">
// Figma: espresso-2.0 › References › modal (34953:131929) — "popup". A code
// field with an outline Apply button, then one Espresso card per coupon
// (35011:123194); sections sit 20px apart on the shared form card.
import { ref, watch } from 'vue'
import { Button, TextInput } from '../../../src'
import lmsLogo from '../../espresso-sidebar/logos/lms.svg'
import EspressoModal from './EspressoModal.vue'
import ModalField from './ModalField.vue'

export interface Coupon {
  code: string
  description: string
  /** Short tag after the code, e.g. "New". */
  hint?: string
}

withDefaults(defineProps<{ coupons?: Coupon[] }>(), {
  coupons: () => [
    { code: 'LMS40', description: 'Use code “LMS40” & get 40% OFF', hint: 'New' },
    { code: 'LEARN50', description: 'Use code “LEARN50” & get 50% OFF' },
  ],
})

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{ apply: [code: string]; knowMore: [code: string] }>()

const code = ref('')

watch(open, (isOpen) => {
  if (!isOpen) code.value = ''
})

function apply(value: string, close: () => void) {
  const trimmed = value.trim()
  if (!trimmed) return
  emit('apply', trimmed)
  close()
}
</script>

<template>
  <EspressoModal v-model:open="open" title="Applicable coupons" variant="form">
    <template #default="{ close }">
      <div class="flex flex-col gap-5">
        <!-- field · 10px · Apply, bottom-aligned -->
        <form
          class="flex items-end gap-2.5"
          @submit.prevent="apply(code, close)"
        >
          <ModalField class="flex-1" label="Apply coupon">
            <TextInput
              v-model="code"
              size="md"
              variant="outline"
              placeholder="Enter coupon code"
            />
          </ModalField>
          <Button type="submit" variant="outline" size="md">Apply</Button>
        </form>

        <!-- coupon card (espresso-2.0, 35011:123194): surface-elevation-2
             fill, outline-gray-2 border, 10px radius, p 10; 28px app logo
             · 8px · title + hint, then description and "Know more" 8px
             apart; outline sm Apply on the right -->
        <div
          v-for="coupon in coupons"
          :key="coupon.code"
          class="flex items-start gap-2 rounded-5 border border-outline-gray-2 bg-surface-elevation-2 p-2.5"
        >
          <img :src="lmsLogo" alt="" class="size-7 shrink-0 rounded-3" />
          <div class="flex min-w-0 flex-1 flex-col gap-1">
            <p class="flex items-baseline gap-1 text-base-medium text-ink-gray-7">
              {{ coupon.code }}
              <span v-if="coupon.hint" class="text-base text-ink-gray-5">
                · {{ coupon.hint }}
              </span>
            </p>
            <div class="flex flex-col gap-2">
              <p class="text-p-base text-ink-gray-6">{{ coupon.description }}</p>
              <button
                type="button"
                class="self-start text-p-base text-ink-gray-6 hover:text-ink-gray-8"
                @click="emit('knowMore', coupon.code)"
              >
                Know more
              </button>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            class="shrink-0 !bg-transparent"
            @click="apply(coupon.code, close)"
          >
            Apply
          </Button>
        </div>
      </div>
    </template>
  </EspressoModal>
</template>
