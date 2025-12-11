<script setup lang="ts">
import { computed, reactive, ref, useSlots, watch } from "vue";
import LucideBox from "~icons/lucide/box";
import Button from "./Button/Button.vue";
import FormControl from "./FormControl/FormControl.vue";

const slots = useSlots();
const defaultSlot = slots.default?.();

interface Props {
  title?: string;
  previewCss?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Default",
});

const editorToggled = ref(false);
const toggleEditor = () => editorToggled.value = !editorToggled.value;

const editorInputs = reactive({});
const slotProps = computed(() => {
  const tmp = {};

  Object.entries(editorInputs).map(([key, value]) => {
    tmp[key] = value.val;
  });

  return tmp;
});

if (defaultSlot?.[0]?.type?.props) {
  const filledProps = defaultSlot[0].props || {};

  for (const [k, v] of Object.entries(defaultSlot[0].type.props)) {
    if (k) {
      editorInputs[k] = v;
      editorInputs[k].val = ref(filledProps[k]);
    }
  }
}

watch(slotProps, (x) => {
  if (defaultSlot) {
    defaultSlot[0].props = slotProps.value;
  }
});
</script>

<template>
  <section class="flex flex-col gap-3 h-fit">
    <Button class="w-fit capitalize" size="sm" @click="toggleEditor">
      <template #prefix>
        <LucideBox class="size-4" />
      </template>
      {{ title }}
    </Button>

    <div
      class="border border-outline-gray-2 p-5 rounded"
      :class="props.previewCss"
    >
      <slot v-bind="slotProps"></slot>
    </div>

    <div
      v-if="editorToggled"
      class="border border-outline-gray-2 p-3 rounded grid gap-3"
    >
      <FormControl
        v-for="(val, key) in editorInputs"
        :key="key"
        placeholder="Enter input"
        v-model="editorInputs[key].val"
        :label="key"
      >
        {{ key }}
      </FormControl>
    </div>
  </section>
</template>
