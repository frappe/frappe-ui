<script setup lang="ts">
import { Avatar, Button, FormControl, Select, Switch, Tooltip } from 'frappe-ui'
import LucideRight from '~icons/lucide/arrow-right'
import LucideCircle from '~icons/lucide/circle-plus'
import LucideGlobe from '~icons/lucide/globe'
import LucideInfo from '~icons/lucide/info'
import LucideLink from '~icons/lucide/link'
import LucideSearch from '~icons/lucide/search'

const countryOptions = [
  { label: 'Syria', value: 'SY' },
  { label: 'Egypt', value: 'EG' },
  { label: 'Canada', value: 'CA' },
  { label: 'Ireland', value: 'IR' },
]

const users = [
  {
    name: 'Sandeep',
    label: 'sandeep@gmail.com',
    img: 'https://i.pravatar.cc/150?img=1',
  },
  {
    name: 'John',
    label: 'john@proton.me',
    img: 'https://i.pravatar.cc/150?img=2',
  },
  {
    name: 'Zach',
    label: 'zach@frappe.io',
    img: 'https://i.pravatar.cc/150?img=3',
  },
]

const selOpts = ['Admin', 'Editor', 'Viewer', 'Guest']
</script>

<template>
  <section
    class="grid h-fit gap-5 *:rounded *:border [&_label]:mb-2 [&_label]:text-base [&_label]:text-ink-gray-9"
  >
    <div class="grid h-fit grid-cols-2 gap-x-4 gap-y-5 p-5">
      <FormControl
        label="Billing name"
        placeholder="Enter your name"
        :options="countryOptions"
        class="col-span-2"
      />

      <FormControl type="select" label="Country" :options="countryOptions" />

      <FormControl type="select" label="City" :options="countryOptions" />

      <FormControl
        label="Address"
        :options="countryOptions"
        placeholder="Enter your address"
        class="col-span-2"
      />

      <FormControl
        type="checkbox"
        label="I have GSTN"
        :options="countryOptions"
        class="col-span-2"
      />

      <FormControl
        type="select"
        label="Month"
        placeholder="MM"
        :options="[
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ]"
      />

      <FormControl
        type="select"
        label="Year"
        placeholder="Select Year"
        :options="Array.from({ length: 6 }, (_, i) => String(i + new Date().getFullYear()))"
      />

      <Button variant="solid" class="col-span-2 -mt-1">
        Next
        <template #suffix>
          <LucideRight class="size-4" />
        </template>
      </Button>
    </div>

    <div class="grid gap-5 p-5">
      <h1 class="text-lg font-semibold">Create Project</h1>
      <FormControl label="Title" variant="outline" placeholder="Enter title" value="Operations" />

      <div class="flex gap-3">
        <div class="my-auto rounded bg-surface-gray-2 p-2">
          <LucideGlobe class="size-6" />
        </div>
        <div class="mr-auto grid gap-1">
          <span class="text-ink-gray-9">Visible to everyone</span>
          <p class="text-ink-gray-5">Collaborate and stay in sync</p>
        </div>
        <Switch />
      </div>

      <Select placeholder="Add people or emails" variant="outline" :options="users">
        <template #prefix>
          <LucideSearch class="size-4" />
        </template>
      </Select>

      <label class="!m-0">Members</label>

      <div v-for="x in users" class="flex gap-3">
        <Avatar size="xl" label="S" class="my-auto" :image="x.img" />

        <div class="grid gap-1">
          <span>{{ x.name }}</span>
          <span class="text-ink-gray-6">{{ x.label }}</span>
        </div>

        <Select
          :options="selOpts"
          class="my-auto ml-auto !w-fit"
          variant="ghost"
          placeholder="Select"
          :defaultValue="selOpts[Math.floor(Math.random() * selOpts.length)]"
        />
      </div>

      <div class="flex items-center justify-between gap-3">
        <Button>
          <template #prefix>
            <LucideLink class="size-4" />
          </template>
          Copy Link</Button
        >

        <Tooltip text="Gotchu!" :hover-delay="0">
          <span class="flex gap-2">
            Learn more
            <LucideInfo class="size-4" />
          </span>
        </Tooltip>
      </div>

      <Button variant="solid">
        <template #prefix>
          <LucideCircle class="size-4" />
        </template>
        Create project</Button
      >
    </div>
  </section>
</template>
