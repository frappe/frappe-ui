<template>
  <div>
    <Dialog
      v-model="show"
      :options="{ title: 'Choose active card' }"
      :disableOutsideClickToClose="confirmDialogOpened"
    >
      <template #body-content>
        <div v-if="cards.data?.length" class="flex flex-col gap-2.5">
          <div
            v-for="card in cards.data"
            :key="card.name"
            class="flex gap-2 justify-between text-base text-gray-900 p-2.5 rounded hover:bg-gray-100"
          >
            <div class="flex gap-2">
              <component :is="cardBrandIcon(card.brand)" class="size-7" />
              <div>
                <div class="flex items-center gap-1 h-7 font-medium">
                  <div>{{ card.name_on_card }}</div>
                  <div>&middot;</div>
                  <div>Card ending in ••••</div>
                  <div>{{ card.last_4 }}</div>
                  <Badge
                    v-if="card.is_default"
                    class="ml-1.5"
                    label="Primary"
                    variant="outline"
                    theme="green"
                  />
                </div>
                <div class="text-gray-600">
                  Expiry
                  {{
                    card.expiry_month < 10
                      ? `0${card.expiry_month}`
                      : card.expiry_month
                  }}/{{ card.expiry_year }}
                </div>
                <div v-if="!card.is_default" class="-ml-2 mt-2">
                  <Button
                    class="!text-gray-700"
                    label="Set as primary"
                    variant="ghost"
                    @click="setAsPrimary(card)"
                  />
                </div>
              </div>
            </div>
            <div v-if="cards.data.length > 1 && !card.is_default">
              <Dropdown
                :options="[
                  { label: 'Remove', onClick: () => removeCard(card) },
                ]"
              >
                <Button icon="more-horizontal" />
              </Dropdown>
            </div>
          </div>
        </div>
      </template>
      <template #actions>
        <Button
          label="Add new card"
          class="w-full"
          variant="solid"
          @click="emit('addCard')"
        >
          <template #prefix>
            <FeatherIcon name="plus" class="h-4" />
          </template>
        </Button>
      </template>
    </Dialog>
    <Dialogs />
  </div>
</template>
<script setup>
import Dropdown from '../Dropdown.vue'
import Badge from '../Badge.vue'
import Dialog from '../Dialog.vue'
import Button from '../Button.vue'
import FeatherIcon from '../FeatherIcon.vue'
import { Dialogs, createDialog } from '../../utils/dialogs.js'
import { createResource } from '../../resources/index.js'
import { cardBrandIcon } from './utils.js'
import { ref, inject } from 'vue'

const emit = defineEmits(['success', 'addCard'])

const show = defineModel()

const { baseAPIPath } = inject('billing')

const cards = createResource({
  url: `${baseAPIPath}.saas_api`,
  params: { method: 'billing.get_payment_methods' },
  auto: true,
})

const setAsPrimary = (card) => {
  createResource({
    url: `${baseAPIPath}.saas_api`,
    params: { method: 'billing.set_as_default', data: { name: card.name } },
    auto: true,
    onSuccess: () => {
      cards.reload()
      emit('success')
    },
  })
}

const confirmDialogOpened = ref(false)
const removeCard = (card) => {
  confirmDialogOpened.value = true
  createDialog({
    title: 'Remove Card',
    message: 'Are you sure you want to remove this card?',
    actions: [
      {
        label: 'Delete',
        variant: 'solid',
        theme: 'red',
        onClick: (close) => {
          createResource({
            url: `${baseAPIPath}.saas_api`,
            params: {
              method: 'billing.remove_payment_method',
              data: { name: card.name },
            },
            auto: true,
            onSuccess: () => {
              cards.reload()
              confirmDialogOpened.value = false
              close()
            },
          })
        },
      },
    ],
    onClose: () => {
      confirmDialogOpened.value = false
    },
  })
}
</script>
