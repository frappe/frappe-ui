<script setup lang="ts">
import { reactive, ref } from 'vue'
import LucideUser from '~icons/lucide/user'
import LucideCog from '~icons/lucide/cog'
import LucideRight from '~icons/lucide/chevron-right'
import {
  Tabs,
  Badge,
  Button,
  FormControl,
  Progress,
  Rating,
  Switch,
} from 'frappe-ui'
import LucideTag from '~icons/lucide/tag'

const val = ref(0)
const followed = ref(false)

const tabs = [
  {
    label: 'Profile',
    icon: LucideUser,
  },
  {
    label: 'Settings',
    icon: LucideCog,
  },
]

const defaultState = {
  username: 'frappe',
  email: '',
  about: ' We build world class open-source software products.',
  followers: true,
}

const state = reactive(JSON.parse(JSON.stringify(defaultState)))

const resetState = () => {
  Object.assign(state, defaultState)
}
</script>

<template>
  <section
    class="grid gap-5 *:rounded *:border [&_label]:text-ink-gray-9 [&_label]:mb-2 [&_label]:text-base h-fit"
  >
    <div class="h-fit">
      <Tabs :tabs v-model="val" class='[&>[role=tablist]]:px-4'>
        <template #tab-panel="{ tab }">
          <div v-if="tab.label == 'Profile'" class="p-5">
            <div class="flex items-center gap-4 mb-4">
              <img src="/frappe-logo.svg" class="!size-14 rounded-full" />

              <div class="flex-1">
                <h4 class="font-semibold text-ink-gray-9">
                  {{ state.username }}
                </h4>
                <p class="text-sm text-ink-gray-6">
                  {{ state.username }}@zap.io
                </p>
              </div>

              <Button
                size="md"
                :variant="followed ? 'outline' : 'solid'"
                @click="followed = !followed"
              >
                {{ followed ? 'Unfollow' : 'Follow' }}
              </Button>
            </div>

            <p class="text-sm text-ink-gray-7 mb-4 leading-relaxed">
              {{ state.about }}
            </p>

            <div class="flex items-center gap-1 text-sm" v-if="state.followers">
              <span class="font-semibold text-ink-gray-9">4</span>
              <span class="text-ink-gray-6 mr-5">Following</span>
              <span class="font-semibold text-ink-gray-9">97.1K</span>
              <span class="text-ink-gray-6">Followers</span>
            </div>
          </div>

          <div v-else class="p-5 grid gap-5">
            <FormControl
              v-model="state.username"
              label="Username"
              placeholder="Enter username"
              type="text"
            />
            <FormControl
              v-model="state.about"
              label="About"
              placeholder="Enter About"
              type="textarea"
            />

            <div class="flex items-center justify-between -mb-2">
              <Button theme="red" @click="resetState"> Reset</Button>
              <Switch
                label="Followers"
                v-model="state.followers"
                class="[&_label]:!m-0"
              />
            </div>
          </div>
        </template>
      </Tabs>
    </div>

    <div class="p-5 grid gap-5 h-fit">
      <Progress :value="20" label="Daily Progress" size="lg" :hint="true" />

      <div class="flex gap-3">
        <span class="p-3 px-4 rounded bg-surface-gray-2 flex items-center">
          <LucideTag class="size-5" />
        </span>

        <p class="leading-relaxed">
          Prize: 25% discount coupon <br />
          <span class="text-ink-gray-6"> for all software courses</span>
        </p>
      </div>
    </div>

    <div class="p-5 grid grid-cols-2 *:col-span-2 gap-y-5">
      <FormControl label="Username" placeholder="Enter username">
        <template #prefix>
          <LucideUser class="size-4" />
        </template>
      </FormControl>

      <FormControl
        label="mail"
        :options="countryOptions"
        placeholder="Enter mail"
      >
        <template #prefix>
          <LucideMail class="size-4" />
        </template>
      </FormControl>

      <Rating class="!col-span-1" label="Rating" />

      <div class="!col-span-1 flex flex-wrap gap-x-1">
        <label class="w-full">Status</label>

        <Badge size="lg" theme="blue" class="rounded-sm"> Stable</Badge>
        <Badge size="lg" theme="orange" class="rounded-sm"> Moderate</Badge>
      </div>
    </div>

    <div class="p-2 grid h-full [&_label]:!m-0 *:rounded *:cursor-pointer">
      <div class="flex items-center gap-2 boder-b p-2 px-2 pb-3 !rounded-none">
        <span class="text-ink-gray-5"> Settings </span>
        <LucideRight class="size-4 text-ink-gray-5" />
        <span class="text-ink-gray-5"> System </span>
        <LucideRight class="size-4 text-ink-gray-5" />
        <span>Power </span>
      </div>

      <label
        class="flex gap-3 p-3 has-[:checked]:bg-surface-gray-1"
        for="balanced"
      >
        <div class="grid gap-1 flex-1">
          <span>Balanced </span>
          <span class="text-ink-gray-4">
            Automatically balances performance with energy consumption
          </span>
        </div>

        <input
          type="radio"
          id="balanced"
          name="power"
          defaultChecked
          class="m-auto bg-surface-gray-2 text-ink-gray-9 dark:text-ink-gray-3 focus:!ring-outline-gray-5 transition-all"
        />
      </label>

      <label
        class="flex gap-3 p-3 has-[:checked]:bg-surface-gray-1"
        for="power-save"
      >
        <div class="grid gap-1 flex-1">
          <span> Power Saving</span>
          <span class="text-ink-gray-4">
            Saves energy by reducing performance where possible
          </span>
        </div>

        <input
          type="radio"
          class="m-auto bg-surface-gray-2 text-ink-gray-9 dark:text-ink-gray-3 focus:!ring-outline-gray-5 transition-all"
          id="power-save"
          name="power"
        />
      </label>

      <label class="flex gap-3 p-3 has-[:checked]:bg-surface-gray-1" for="perf">
        <div class="grid gap-1 flex-1">
          <span> Performance</span>
          <span class="text-ink-gray-4">
            High performance but uses more energy
          </span>
        </div>

        <input
          type="radio"
          class="m-auto bg-surface-gray-2 text-ink-gray-9 dark:text-ink-gray-3 focus:!ring-outline-gray-5 transition-all"
          id="perf"
          name="power"
        />
      </label>
    </div>
  </section>
</template>
