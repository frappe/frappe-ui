<template>
	<div class="flex items-center text-base">
		<!-- Status Badge -->
		<Badge v-if="cellType.isStatus" :theme="'gray'" :size="'lg'" :variant="'subtle'">
			{{ props.value }}
		</Badge>

		<!-- Tags Display -->
		<div v-else-if="cellType.isTags" class="flex flex-wrap gap-1">
			<span
				v-for="tag in parsedTags"
				:key="tag"
				class="inline-flex items-center px-2 py-0.5 rounded-md font-medium bg-blue-100 text-blue-800"
			>
				{{ tag }}
			</span>
		</div>

		<!-- Assignment Display -->
		<div v-else-if="cellType.isAssign" class="flex -space-x-2">
			<Avatar
				v-for="email in parsedAssignments"
				:key="email"
				:label="email"
				size="lg"
				class="border-2 border-[var(--surface-white)]"
			/>
		</div>

		<!-- Link Field -->
		<div v-else-if="cellType.isLink" class="truncate">
			{{ props.value }}
		</div>

		<!-- Date/Datetime Fields -->
		<span v-else-if="cellType.isDate">
			{{ formatDate(props.value) }}
		</span>

		<!-- Numeric Fields -->
		<span v-else-if="cellType.isNumeric" class="text-right">
			{{ formatNumeric(props.value) }}
		</span>

		<!-- Currency Field -->
		<span v-else-if="cellType.isCurrency" class="text-right">
			{{ formatCurrency(props.value) }}
		</span>

		<!-- Percent Field -->
		<div
			v-else-if="cellType.isPercent"
			class="w-full bg-surface-gray-2 rounded-full h-2.5 mr-4"
		>
			<div
				class="bg-surface-green-3 h-2.5 rounded-full"
				:style="{ width: `${Number(props.value)}%` }"
			></div>
		</div>

		<!-- Check Field -->
		<Checkbox
			v-else-if="cellType.isCheck"
			disabled
			:model-value="Number(props.value) ? true : false"
		/>

		<!-- Select Field -->
		<span v-else-if="cellType.isSelect" class="truncate">
			{{ props.value }}
		</span>

		<!-- Text Fields -->
		<span v-else-if="cellType.isText" class="truncate" :title="props.value">
			{{ truncateText(props.value) }}
		</span>

		<!-- Image Field -->
		<div v-else-if="cellType.isImage" class="flex items-center">
			<img
				v-if="props.value"
				:src="props.value"
				alt="Image"
				class="h-8 w-8 rounded object-cover"
			/>
			<span v-else class="italic">No Image</span>
		</div>

		<!-- Rating Field -->
		<Rating v-else-if="cellType.isRating" :model-value="Number(props.value) * 5" />

		<!-- Default Display -->
		<span v-else class="truncate"> {{ props.value }} </span>
	</div>
</template>

<script setup lang="ts">
import { Avatar, Badge, Checkbox, Rating } from 'frappe-ui';
import { computed } from 'vue';
import { DocField } from '../../types';
import {
	formatCurrency as formatCurrencyUtil,
	formatDate as formatDateUtil,
	formatNumeric as formatNumericUtil,
	getCellType,
	parseJsonSafely,
	truncateText as truncateTextUtil,
} from '../../utils/field';

const props = defineProps<{
	field: DocField
	value: any
}>()

const cellType = computed(() => getCellType(props.field))

const parsedTags = computed(() => parseJsonSafely(props.value))
const parsedAssignments = computed(() => parseJsonSafely(props.value))

const formatNumeric = (value: any) => formatNumericUtil(value)
const formatCurrency = (value: any) => formatCurrencyUtil(value)
const truncateText = (text: any) => truncateTextUtil(text)
const formatDate = (value: any) => formatDateUtil(value, cellType.value.isRelativeDate)
</script>
