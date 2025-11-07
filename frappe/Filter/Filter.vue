<script setup lang="ts">
import { computed, ref } from "vue";
import type { FilterProps, StateRow } from "./types";

import {
  getDefaultOperator,
  getOperators,
  getValueControl,
  parseFilters,
} from "./utils";

import Badge from "../../src/components/Badge/Badge.vue";
import Button from "../../src/components/Button/Button.vue";
import Combobox from "../../src/components/Combobox/Combobox.vue";
import Popover from "../../src/components/Popover/Popover.vue";
import Select from "../../src/components/Select/Select.vue";
import { createResource } from "../../src/resources";

import FilterIcon from "../Icons/FilterIcon.vue";

let props = defineProps<FilterProps>();

const doctypeFields = createResource({
  url: "frappe.desk.form.load.getdoctype",
  method: "GET",
  params: { doctype: props.doctype },
  auto: true,

  transform(data) {
    const options = data.docs[0].fields.map((x) => {
      return {
        label: x.label,
        type: x.fieldtype,
        value: x.fieldname,
        options: x.options?.split("\n"),
      };
    })
      .filter((x) =>
        !["Section Break", "Read Only", "Column Break"].includes(x.type)
      );

    return options;
  },
});

const dummyObj = () => ({
  field: { fieldName: "", fieldType: "", options: [] },
  operator: "",
  value: "",
});

const rows = ref([dummyObj()]);
const insertRow = () => rows.value.push(dummyObj());

const clearRows = (closePopup: () => void) => {
  rows.value = [dummyObj()];
  closePopup();
  apply();
};

const deleteRow = (index: number) => {
  rows.value.splice(index, 1);
  if (rows.value.length === 0) insertRow();
  apply();
};

const getField = (val: string) => {
  return doctypeFields.data?.find((x: StateRow) => x.value === val);
};

const updateFilter = (val: string, index: number) => {
  if (!val) return;

  const field = getField(val);
  rows.value[index] = {
    field: {
      fieldName: val,
      fieldType: field.type,
      options: field.options,
    },
    operator: getDefaultOperator(field),
    value: "",
  };
  apply();
};

const model = defineModel();
const apply = () => {
  model.value = parseFilters(rows.value);
};

const filterCount = computed(() =>
  rows.value.filter((row) => row.field.fieldName !== "").length
);
</script>

<template>
  <Popover
    popover-class="mt-2 p-2 rounded-lg border bg-surface-modal shadow-xl max-w-xl"
    placement="bottom-end"
  >
    <template #target="{ close, togglePopover }">
      <Button
        @click="togglePopover()"
        :class='{ "rounded-r-none": filterCount != 0 }'
      >
        <template #prefix><FilterIcon /></template>
        Filter
        <Badge
          v-if="filterCount != 0"
          :class='"bg-surface-gray-4 ml-1 rounded"'
          :label="filterCount"
        />
      </Button>

      <Button
        v-if="filterCount != 0"
        @click="clearRows(close)"
        class="bg-surface-gray-4 rounded-l-none"
        icon="x"
      />
    </template>

    <template #body="{ close }">
      <div class="grid lg:grid-cols-[1fr_0.7fr_1fr_auto] gap-2 items-center">
        <!-- input fields -->
        <template v-for="(row, index) in rows">
          <Combobox
            :options="doctypeFields.data"
            :placeholder='"Select an option..."'
            :disabled="false"
            @update:modelValue="(e) => updateFilter(e, index)"
            v-model="row.field.fieldName"
          />

          <Select
            placeholder="is"
            :options="getOperators(row.field)"
            v-model="row.operator"
            @update:modelValue="apply"
          />

          <component
            :is="getValueControl(row)"
            v-model="row.value"
            @update:modelValue="apply"
          />
          <Button
            class="ml-auto lg:-ml-1"
            icon="x"
            variant="ghost"
            @click="deleteRow(index)"
          />
        </template>
      </div>

      <!-- footer buttons -->
      <div class="flex gap-2 justify-between mt-4">
        <Button variant="ghost" @click="insertRow()" icon-left="plus">
          Add Filter
        </Button>

        <Button variant="ghost" @click="clearRows(close)" icon-left="trash-2">
          Clear Filters
        </Button>
      </div>
    </template>
  </Popover>
</template>
