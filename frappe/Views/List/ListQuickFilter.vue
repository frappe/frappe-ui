<template>
	<DocField
		class="w-40"
		:key="props.field.fieldname"
		:fieldname="props.field.fieldname"
		:fieldtype="props.field.fieldtype"
		:label="props.field.label"
		:options="props.field.options"
		v-model="value"
	/>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { DocField as TDocField } from '../../types';
import { DEFAULT_OPERATOR } from '../../utils/constants';
import { FilterValue } from '../../../src/data-fetching/useList/types';
import { DocField } from '../../Controls/DocField';

const props = defineProps<{ field: TDocField }>()
const filterValue = defineModel<FilterValue>()

const value = ref('')
const operator = computed(() => {
	if (props.field.fieldtype in DEFAULT_OPERATOR) {
		// @ts-ignore
		return DEFAULT_OPERATOR[props.field.fieldtype]
	}
	return '='
})

watchEffect(() => {
	if (value.value) {
		filterValue.value = [operator.value, value.value]
	} else {
		filterValue.value = undefined
	}
})
</script>
