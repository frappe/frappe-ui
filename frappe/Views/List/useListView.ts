import { watchDebounced } from '@vueuse/core'
import { computed, reactive, ref } from 'vue'
import { ListViewOptions, Row } from '../../../src/components/ListView'
import { useCall, useList } from '../../../src/data-fetching'
import { Filters } from '../../../src/data-fetching/useList/types'
import { Meta } from '../../types'
import { NO_VALUE_TYPES } from '../../utils/constants'
import { hasPerm } from '../../utils/field'

export function useListView(doctype: string) {
	const meta = useCall<Meta>({
		method: 'GET',
		url: `/api/v2/doctype/${doctype}/meta`,
	})

	const permittedFields = computed(() => {
		if (!meta.data) return []
		return meta.data.fields.filter((df) => hasPerm(df.permlevel))
	})

	const headerFields = computed(() => {
		if (!meta.data) return []

		const titleFieldName = meta.data.title_field
		const _headerFields = permittedFields.value.filter((df) => {
			if (df.fieldname === titleFieldName) return false

			return (
				df.in_list_view ||
				(df.fieldtype === 'Currency' && df.options && !String(df.options).includes(':')) ||
				df.fieldname === 'status'
			)
		})

		// Add title field first if exists
		if (titleFieldName) {
			const titleField = permittedFields.value.find((df) => df.fieldname === titleFieldName)
			if (titleField) {
				_headerFields.unshift(titleField)
			}
		}

		// Add name column if not hidden and not same as title field
		const hideNameColumn = false
		if (!hideNameColumn && meta.data.title_field !== 'name') {
			_headerFields.push({
				fieldname: 'name',
				label: 'ID',
				fieldtype: 'Data',
			})
		}

		// Add standard fields
		_headerFields.push(
			{
				fieldname: 'modified',
				label: 'Modified',
				fieldtype: 'Datetime',
			},
			{
				fieldname: '_assign',
				label: 'Assigned To',
				fieldtype: 'Data',
			},
		)

		return _headerFields
	})

	const quickFilterFields = computed(() => {
		if (!meta.data) return []

		return permittedFields.value.filter((df) => {
			const isTitleField = df.fieldname === meta.data?.title_field
			const isValidStandardFilter = df.in_standard_filter && !NO_VALUE_TYPES.includes(df.fieldtype)
			return isTitleField || isValidStandardFilter
		})
	})

	const listViewColumns = computed(() => {
		return headerFields.value.map((df) => ({
			...df,
			key: df.fieldname,
		}))
	})

	const listViewOptions: ListViewOptions = {
		showTooltip: false,
		resizeColumn: true,
		emptyState: {
			title: `No ${doctype.toLowerCase()} created.`,
			description: `Create a new ${doctype.toLowerCase()} to get started.`,
			button: {
				label: `Create ${doctype}`,
				variant: 'solid',
				// @ts-ignore
				onClick: () => {},
			},
		},
	}

	const filters = ref<Filters>({})
	const data = ref<Row[]>([])

	const params = computed(() => {
		return {
			doctype,
			fields: headerFields.value.map((df) => df.fieldname as any),
			filters: filters.value,
			orderBy: 'modified DESC' as const,
		}
	})

	watchDebounced(
		params,
		() => {
			useList({
				doctype: params.value.doctype,
				fields: params.value.fields,
				filters: params.value.filters,
				orderBy: params.value.orderBy,
				onSuccess(res) {
					data.value = res
				},
			})
		},
		{ debounce: 300 },
	)

	return reactive({
		doctype,
		meta,
		headerFields,
		quickFilterFields,
		permittedFields,
		filters,
		props: {
			columns: listViewColumns,
			rowKey: 'name',
			rows: data,
			options: listViewOptions,
		},
	})
}
