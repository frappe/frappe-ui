<template>
    <div class="flex min-h-0 flex-col text-base">
		<div class="flex items-center justify-between">
			<div>
				<div class="text-xl font-semibold mb-1 text-ink-gray-9">
					{{ label }}
				</div>
				<div class="text-ink-gray-6 leading-5">
					{{ description }}
				</div>
			</div>
            <Button variant="solid" @click="emit('updateStep', 'new')">
                <template #prefix>
                    <FeatherIcon name="plus" class="size-4 stroke-1.5" />
                </template>
                Import
            </Button>
		</div>

        <div class="flex items-center space-x-2 my-5">
            <FormControl
                v-model="search"
                placeholder="Search imported files"
                type="text"
                class="flex-1"
            />
            <FormControl
                v-model="importStatus"
                type="select"
                :options="importOptions"
            />
        </div>

        <div v-if="dataImports.data?.length" class="divide-y overflow-y-scroll">
            <div class="grid grid-cols-[70%,20%,10%] text-sm text-ink-gray-5 py-1.5 mx-2 my-0.5 px-1">
                <div>
                    Name
                </div>
                <div>
                    Status
                </div>
            </div>
            <div 
                v-for="dataImport in dataImports.data" 
                @click="() => emit('updateStep', 'edit', { ...dataImport })"
                class="grid grid-cols-[70%,20%,10%] cursor-pointer py-2.5 px-1 mx-2"
            >
                <div class="space-y-1">
                    <div>
                        {{ dataImport.reference_doctype }}
                    </div>
                    <div class="text-ink-gray-5">
                        {{ dayjs(dataImport.creation).fromNow() }}
                    </div>
                </div>
                <Badge :label="dataImport.status" :theme="getBadgeColor(dataImport.status) as BadgeProps['theme']" class="w-fit" />
            </div>
        </div>
        <div v-else class="text-sm italic text-ink-gray-5 mt-5">
            No data imports found.
        </div>
	</div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { DataImports } from './types'
import { dayjs } from "../../src/utils/dayjs"
import { getBadgeColor } from "./dataImport"
import Badge from '../../src/components/Badge/Badge.vue'
import type { BadgeProps } from '../../src/components/Badge/types'
import Button from '../../src/components/Button/Button.vue'
import FeatherIcon from '../../src/components/FeatherIcon.vue'
import FormControl from '../../src/components/FormControl/FormControl.vue'

const search = ref('')
const importStatus = ref('All')
const emit = defineEmits(['updateStep'])

const props = defineProps<{
    label: string,
    description?: string
    dataImports: DataImports
}>()

const importOptions = computed(() => {
    const options = ["All", "Pending", "Success", "Partial Success", "Error", "Timed Out"]
    return options.map(option => ({ label: option, value: option }))
})

watch([search, importStatus], ([newSearch, newStatus]) => {
    props.dataImports.update({
        filters: [
            newSearch ? [['name', 'like', `%${newSearch}%`]] : [],
            newStatus !== 'All' ? [['status', '=', newStatus]] : [],
        ].flat(),
    })
    props.dataImports.reload()
})
</script>