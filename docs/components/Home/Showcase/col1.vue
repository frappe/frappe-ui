<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Avatar,
  Badge,
  Button,
  FormControl,
  Rating,
  Select,
  Switch,
  TextInput,
  Tooltip,
} from "frappe-ui";
import LucideRight from "~icons/lucide/arrow-right";
import LucideUser from "~icons/lucide/user";
import LucideMail from "~icons/lucide/mail";
import LucideGlobe from "~icons/lucide/globe";
import LucideLink from "~icons/lucide/link";
import LucideSearch from "~icons/lucide/search";
import LucideInfo from "~icons/lucide/info";
import LucideCircle from "~icons/lucide/circle-plus";

const countryOptions = [
  { label: "Syria", value: "SY" },
  { label: "Egypt", value: "EG" },
  { label: "Canada", value: "CA" },
  { label: "Ireland", value: "IR" },
];

const users = [
  {
    name: "Sandeep",
    mail: "sandeep@gmail.com",
    img: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "John",
    mail: "john@gmail.com",
    img: "https://i.pravatar.cc/150?img=2",
  },
  {
    name: "Jane",
    mail: "jane@gmail.com",
    img: "https://i.pravatar.cc/150?img=3",
  },
];
</script>

<template>
  <div
    class="grid gap-5 *:rounded *:border [&_label]:text-ink-gray-9 [&_label]:mb-2 [&_label]:text-base h-fit"
  >
    <div class="grid p-5 grid-cols-2 gap-y-5 gap-x-4 h-fit">
      <FormControl
        label="Billing name"
        placeholder="Enter your name"
        :options="countryOptions"
        class="col-span-2"
      />

      <FormControl
        type="select"
        label="Country"
        :options="countryOptions"
      />

      <FormControl
        type="select"
        label="City"
        :options="countryOptions"
      />

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
        :options='
          [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ]
        '
      />

      <FormControl
        type="select"
        label="Year"
        placeholder="Select Year"
        :options="
          Array.from({ length: 6 }, (_, i) =>
            String(i + new Date().getFullYear()))
        "
      />

      <Button variant="solid" class="col-span-2 -mt-1">
        Next
        <template #suffix>
          <LucideRight class="size-4" />
        </template>
      </Button>
    </div>

    <div class="p-5 grid gap-5">
      <h1 class="font-semibold text-lg">Create Project</h1>
      <FormControl
        label="Title"
        variant="outline"
        placeholder="Enter title"
        value="Operations"
      />

      <div class="flex gap-3">
        <div class="my-auto bg-surface-gray-2 p-2 rounded">
          <LucideGlobe class="size-6" />
        </div>
        <div class="grid gap-1 mr-auto">
          <span class="text-ink-gray-9">Visible to everyone</span>
          <p class="text-ink-gray-5">
            Collaborate and stay in sync
          </p>
        </div>
        <Switch />
      </div>

      <Select placeholder="Add people or emails" variant="outline">
        <template #prefix>
          <LucideSearch class="size-4" />
        </template>
      </Select>

      <label class="!m-0">Members</label>

      <div v-for="x in users" class="flex gap-3">
        <Avatar size="xl" label="S" class="my-auto" :image="x.img" />

        <div class="grid gap-1">
          <span>{{ x.name }}</span>
          <span class="text-ink-gray-6">{{ x.mail }}</span>
        </div>

        <Select
          :options='["Admin", "Editor", "Viewer", "Guest"]'
          class="my-auto ml-auto !w-fit"
          variant="ghost"
          placeholder="Select"
        />
      </div>

      <div class="flex gap-3 justify-between items-center">
        <Button>
          <template #prefix>
            <LucideLink class="size-4" />
          </template>
          Copy Link</Button>

        <Tooltip
          text="Gotchu!"
          hover-delay="0"
        >
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
        Create project</Button>
    </div>
  </div>
</template>
