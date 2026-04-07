<script setup lang="ts">
import { Tabs, Badge, Button, FormControl, Progress, Rating, Switch } from 'frappe-ui'
import { reactive, ref } from 'vue'
import LucideRight from '~icons/lucide/chevron-right'
import LucideCog from '~icons/lucide/cog'
import LucideTag from '~icons/lucide/tag'
import LucideUser from '~icons/lucide/user'

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
    class="grid h-fit gap-5 *:rounded *:border [&_label]:mb-2 [&_label]:text-base [&_label]:text-ink-gray-9"
  >
    <div class="h-fit">
      <Tabs :tabs v-model="val" class="[&>[role=tablist]]:px-4">
        <template #tab-panel="{ tab }">
          <div v-if="tab.label == 'Profile'" class="p-5">
            <div class="mb-4 flex items-center gap-4">
              <img src="/frappe-logo.svg" class="!size-14 rounded-full" />

              <div class="flex-1">
                <h4 class="font-semibold text-ink-gray-9">
                  {{ state.username }}
                </h4>
                <p class="text-sm text-ink-gray-6">{{ state.username }}@zap.io</p>
              </div>

              <Button
                size="md"
                :variant="followed ? 'outline' : 'solid'"
                @click="followed = !followed"
              >
                {{ followed ? 'Unfollow' : 'Follow' }}
              </Button>
            </div>

            <p class="mb-4 text-sm leading-relaxed text-ink-gray-7">
              {{ state.about }}
            </p>

            <div class="flex items-center gap-1 text-sm" v-if="state.followers">
              <span class="font-semibold text-ink-gray-9">4</span>
              <span class="mr-5 text-ink-gray-6">Following</span>
              <span class="font-semibold text-ink-gray-9">97.1K</span>
              <span class="text-ink-gray-6">Followers</span>
            </div>
          </div>

          <div v-else class="grid gap-5 p-5">
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

            <div class="-mb-2 flex items-center justify-between">
              <Button theme="red" @click="resetState"> Reset</Button>
              <Switch label="Followers" v-model="state.followers" class="[&_label]:!m-0" />
            </div>
          </div>
        </template>
      </Tabs>
    </div>

    <div class="grid h-fit gap-5 p-5">
      <Progress :value="20" label="Daily Progress" size="lg" :hint="true" />

      <div class="flex gap-3">
        <span class="flex items-center rounded bg-surface-gray-2 p-3 px-4">
          <LucideTag class="size-5" />
        </span>

        <p class="leading-relaxed">
          Prize: 25% discount coupon <br />
          <span class="text-ink-gray-6"> for all software courses</span>
        </p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-y-5 p-5 *:col-span-2">
      <FormControl label="Username" placeholder="Enter username">
        <template #prefix>
          <LucideUser class="size-4" />
        </template>
      </FormControl>

      <FormControl label="Email" :options="countryOptions" placeholder="Enter email">
        <template #prefix>
          <LucideMail class="size-4" />
        </template>
      </FormControl>

      <Rating class="!col-span-1" label="Rating" />

      <div class="!col-span-1 flex flex-wrap gap-x-1">
        <label class="w-full">Status</label>

        <Badge theme="blue" class="rounded-sm"> Stable</Badge>
        <Badge theme="orange" class="rounded-sm"> Moderate</Badge>
      </div>
    </div>

    <div class="grid h-full p-2 *:cursor-pointer *:rounded [&_label]:!m-0">
      <div class="boder-b flex items-center gap-2 !rounded-none p-2 px-2 pb-3">
        <span class="text-ink-gray-5"> Settings </span>
        <LucideRight class="size-4 text-ink-gray-5" />
        <span class="text-ink-gray-5"> System </span>
        <LucideRight class="size-4 text-ink-gray-5" />
        <span>Power </span>
      </div>

      <label class="flex gap-3 p-3 has-[:checked]:bg-surface-gray-1" for="balanced">
        <div class="grid flex-1 gap-1">
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
          class="m-auto bg-surface-gray-2 text-ink-gray-9 transition-all focus:!ring-outline-gray-5 dark:text-ink-gray-3"
        />
      </label>

      <label class="flex gap-3 p-3 has-[:checked]:bg-surface-gray-1" for="power-save">
        <div class="grid flex-1 gap-1">
          <span> Power Saving</span>
          <span class="text-ink-gray-4"> Saves energy by reducing performance where possible </span>
        </div>

        <input
          type="radio"
          class="m-auto bg-surface-gray-2 text-ink-gray-9 transition-all focus:!ring-outline-gray-5 dark:text-ink-gray-3"
          id="power-save"
          name="power"
        />
      </label>

      <label class="flex gap-3 p-3 has-[:checked]:bg-surface-gray-1" for="perf">
        <div class="grid flex-1 gap-1">
          <span> Performance</span>
          <span class="text-ink-gray-4"> High performance but uses more energy </span>
        </div>

        <input
          type="radio"
          class="m-auto bg-surface-gray-2 text-ink-gray-9 transition-all focus:!ring-outline-gray-5 dark:text-ink-gray-3"
          id="perf"
          name="power"
        />
      </label>
    </div>
  </section>
</template>
