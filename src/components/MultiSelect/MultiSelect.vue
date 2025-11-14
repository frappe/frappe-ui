<script setup lang="ts">
import { computed } from "vue";
import { MultiSelectOption, MultiSelectProps } from "./types";

import {
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxRoot,
  ComboboxViewport,
} from "reka-ui";

import LucideX from "~icons/lucide/x";
import Popover from "../Popover/Popover.vue";
import LucideCheck from "~icons/lucide/check";
import LoadingIndicator from "../LoadingIndicator.vue";
import LucideChevronDown from "~icons/lucide/chevron-down";

const props = withDefaults(defineProps<MultiSelectProps>(), {
  placeholder: "Select option",
});

const model = defineModel<String[]>({ default: [] });

const getValues = (arr: String[]) =>
  arr.map((x) => props.options.find((y) => y.value === x)?.label);

const optionToStr = (options: MultiSelectOption[]) =>
  options.map((x) => x.label);

const selectedOptions = computed(() => {
  const values = getValues(model.value).join(", ");
  return model.value.length > 0 ? values : props.placeholder;
});

const clearAll = () => model.value = [];
const selectAll = () => model.value = optionToStr(props.options);
</script>

<template>
  <Popover
    popover-class="mt-2 shadow-xl rounded-lg border bg-surface-modal"
    :matchTargetWidth="true"
  >
    <template #target="{ togglePopover }">
      <Button
        @click="togglePopover"
        class="w-full justify-between"
        :class='{ "!text-ink-gray-4": model.length == 0 }'
      >
        {{ selectedOptions }}
        <template #suffix>
          <LucideChevronDown class="size-4 text-ink-gray-5" />
        </template>
      </Button>
    </template>

    <template #body>
      <ComboboxRoot
        :open="true"
        class="relative p-2 pb-0"
        v-model="model"
        multiple
      >
        <div
          v-if="!props.hideSearch"
          class="
            flex w-full items-center justify-between gap-2
            rounded bg-surface-gray-2 px-2 py-1 ring-2 ring-outline-gray-2
            transition-colors hover:bg-surface-gray-3 boder borer-transparent
          "
        >
          <ComboboxInput
            placeholder="Search for..."
            class="
              bg-transparent p-0 focus:outline-0 border-0 focus:border-0 focus:ring-0
              text-base text-ink-gray-8 h-full placeholder:text-ink-gray-4 w-full
            "
          />

          <div class="inline-flex gap-1">
            <LoadingIndicator
              v-if="props.loading"
              class="size-4 text-ink-gray-5"
            />
            <LucideX class="size-4 text-ink-gray-9" />
          </div>
        </div>

        <ComboboxContent class="z-10 overflow-hidden mt-2">
          <ComboboxViewport class="max-h-60 overflow-auto pb-1.5">
            <ComboboxEmpty
              class="text-ink-gray-5 text-base text-center py-1.5 px-2.5"
            >
              No results found
            </ComboboxEmpty>

            <ComboboxItem
              v-for="item in props.options"
              :key="item.value"
              :value="item.value"
              :disabled="item.disabled"
              class="
                text-base leading-none text-ink-gray-7 rounded flex items-center h-7 p-1.5
                relative select-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none
                data-[highlighted]:outline-none data-[highlighted]:bg-surface-gray-3
              "
            >
              <slot name="option" v-bind="{ item }">
                {{ item.label }}
              </slot>

              <ComboboxItemIndicator
                class="absolute right-2 inline-flex items-center justify-center"
              >
                <LucideCheck class="size-4" />
              </ComboboxItemIndicator>
            </ComboboxItem>
          </ComboboxViewport>

          <hr class="border-outline-gray-3" />

          <!-- footer btns -->
          <slot name="footer" v-bind="{ clearAll, selectAll }">
            <div class="flex justify-between my-2">
              <Button variant="ghost" @click="clearAll"> Clear All</Button>
              <Button variant="ghost" @click="selectAll"> Select All</Button>
            </div>
          </slot>
        </ComboboxContent>
      </ComboboxRoot>
    </template>
  </Popover>
</template>
