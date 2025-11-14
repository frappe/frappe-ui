<template>
	<div class="space-y-1.5">
		<label v-if="attrs.label" class="block text-xs text-ink-gray-5">
			{{ attrs.label }}
			<span class="text-ink-red-3" v-if="attrs.required">*</span>
		</label>
		<Autocomplete
			ref="autocomplete"
			:options="options.data"
			v-model="value"
			:size="attrs.size || 'sm'"
			:variant="attrs.variant"
			:placeholder="attrs.placeholder"
			:filterable="false"
			:readonly="attrs.readonly"
		>
			<template #target="{ open, togglePopover }">
				<slot name="target" v-bind="{ open, togglePopover }" />
			</template>

			<template #prefix>
				<slot name="prefix" />
			</template>

			<template #item-prefix="{ active, selected, option }">
				<slot name="item-prefix" v-bind="{ active, selected, option }" />
			</template>

			<template #item-label="{ active, selected, option }">
				<slot name="item-label" v-bind="{ active, selected, option }" />
			</template>

			<template #footer="{ value, close }">
				<div v-if="attrs.onCreate">
					<Button
						variant="ghost"
						class="w-full !justify-start"
                        label="Create New"
						@click="(attrs as any).onCreate(value, close)"
					>
						<template #prefix>
							<Plus class="h-4 w-4 stroke-1.5" />
						</template>
					</Button>
				</div>
				<div>
					<Button
						variant="ghost"
						class="w-full !justify-start"
                        label="Clear"
						@click="() => clearValue(close)"
					>
						<template #prefix>
							<X class="h-4 w-4 stroke-1.5" />
						</template>
					</Button>
				</div>
			</template>
		</Autocomplete>
		<p v-if="description" class="text-sm text-ink-gray-5">
            {{ description }}
        </p>
	</div>
</template>

<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { useAttrs, computed, ref } from 'vue'
import { Plus, X } from 'lucide-vue-next'
import { createResource } from "../../../src/resources"
import Autocomplete from "../../../src/components/Autocomplete/Autocomplete.vue"
import Button from "../../../src/components/Button/Button.vue"

const props = defineProps({
	doctype: {
		type: String,
		required: true,
	},
	filters: {
		type: Object,
		default: () => ({}),
	},
	modelValue: {
		type: String,
		default: '',
	},
	description: {
		type: String,
		default: '',
	},
})

const emit = defineEmits(['update:modelValue', 'change'])
const attrs = useAttrs()
const valuePropPassed = computed(() => 'value' in attrs)
const autocomplete = ref<{ query: string } | null>(null)
const text = ref('')

const value = computed({
	get: () => (valuePropPassed.value ? attrs.value : props.modelValue),
	set: (val: { value: string }) => {
		return (
			val?.value &&
			emit(valuePropPassed.value ? 'change' : 'update:modelValue', val?.value)
		)
	},
})

watchDebounced(
	() => autocomplete.value?.query,
	(val) => {
		val = val || ''
		if (text.value === val) return
		text.value = val
		reload(val)
	},
	{ debounce: 300, immediate: true }
)

watchDebounced(
	() => props.doctype,
	() => reload(''),
	{ debounce: 300, immediate: true }
)

const options = createResource({
	url: 'frappe.desk.search.search_link',
	cache: [props.doctype, text.value],
	method: 'POST',
	auto: true,
	params: {
		txt: text.value,
		doctype: props.doctype,
		filters: props.filters,
	},
	transform: (data: { label: string; value: string; description: string }[]) => {
		return data.map((option) => {
			return {
				label: option.label || option.value,
				value: option.value,
				description: option.description,
			}
		})
	},
})

const reload = (val: string) => {
	options.update({
		params: {
			txt: val,
			doctype: props.doctype,
			filters: props.filters,
		},
	})
	options.reload()
}

const clearValue = (close: () => void) => {
	emit(valuePropPassed.value ? 'change' : 'update:modelValue', '')
	close()
}
</script>
