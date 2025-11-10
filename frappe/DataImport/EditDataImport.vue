<template>
    <div class="text-base h-full flex flex-col overflow-y-auto">
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
                <FeatherIcon name="chevron-left" class="size-5 stroke-1 cursor-pointer" @click="emit('updateStep', 'list')" />
                <div class="text-xl font-semibold text-ink-gray-9">
                    {{ data.reference_doctype }} Import
                </div>
                <Badge :label="data.status" :theme="getBadgeColor(data.status) as BadgeProps['theme']" />
            </div>
            <Button label="Download Template" @click="showTemplateModal = true" />
        </div>
        <div>
            <div class="grid grid-cols-1 gap-5 mt-5">
                <FormControl
                    v-model="data.import_type"
                    label="Import Type"
                    disabled
                />

                <FormControl
                    v-model="sendEmailNotification"
                    type="checkbox"
                    label="Send Email Notification on Completion"
                    disabled
                />
            </div>
            <div class="mt-5 border-t pt-5 space-y-4">
                <div v-if="!googleSheet" class="flex flex-col space-y-2">
                    <div class="text-ink-gray-5 text-sm">
                        Import a CSV or Excel File
                    </div>
                    <FileUploader
                        v-if="!importFile"
                        :fileTypes="['.csv', '.xlsx', '.xls']"
						:uploadArgs="{
							private: true,
						}"
                        :validateFile="validateFile"
                        @success="(file: File) => (importFile = file?.file_url)"
					>
                        <template #default="{ uploading, progress, openFileSelector }">
							<Button @click="openFileSelector" :loading="uploading">
								{{
									uploading
										? `Uploading ${progress}%`
										: 'Upload'
								}}
							</Button>
						</template>
                    </FileUploader>
                    <div v-else class="flex items-center space-x-3 bg-surface-gray-2 w-fit px-3 py-2 rounded-md">
                        <div class="text-sm space-y-1 cursor-pointer" @click="openImportFile()">
                            <div>
                                {{ importFile }}
                            </div>
                        </div>
                        <Button
                            v-if="data.status != 'Success'"
                            @click="importFile = null"
                        >
                            <template #icon>
                                <FeatherIcon name="x" class="size-4 stroke-1" />
                            </template>
                        </Button>
                    </div>
                </div>

                <div v-if="!importFile && !googleSheet" class="text-ink-gray-5">
                    OR
                </div>

                <FormControl
                    v-if="!importFile"
                    label="Import from Google Sheets"
                    v-model="googleSheet"
                    :disabled="data.status === 'Success'"
                />
            </div>
            <div class="space-y-2 mt-8">
                <div v-if="showImportLogs" class="flex items-center space-x-2 px-2 py-1.5 rounded-md" :class="{
                    'bg-surface-green-1': data.status == 'Success',
                    'bg-surface-red-1': ['Partial Success', 'Error'].includes(data.status)
                }">
                    <div v-if="data.status == 'Success'" class="size-2 bg-surface-green-3 rounded-full">
                    </div>
                    <div v-else-if="['Partial Success', 'Error'].includes(data.status)" class="size-2 bg-surface-red-3 rounded-full">
                    </div>
                    <span v-if="data.status == 'Success'">
                        Import completed. {{ successfulImports}} rows imported successfully.
                    </span>
                    <span v-else-if="['Partial Success', 'Error'].includes(data.status)">
                        Import completed with some errors. {{ successfulImports}} rows imported.
                    </span>
                </div>

                <div v-if="showPreview" class="overflow-x-auto border border-outline-gray-2 rounded-md max-h-72">
                    <table class="table-fixed divide-y">
                        <thead class="rounded-t-md">
                            <tr>
                                <th
                                    v-for="column in previewColumns"
                                    :key="column.key"
                                    :style="{ width: column.width, textAlign: column.align }"
                                    class="p-2 text-left text-sm text-ink-gray-5 whitespace-nowrap"
                                    :class="{
                                        'border-r': column.key != previewColumns[previewColumns.length -1].key
                                    }"
                                >
                                    {{ column.label }}
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-surface-gray-2">
                            <tr v-for="(row, rowIndex) in previewData" :key="rowIndex">
                                <td
                                    v-for="column in previewColumns"
                                    :key="column.key"
                                    :style="{ width: column.width, textAlign: column.align }"
                                    class="px-3 py-2 text-sm text-ink-gray-7 align-top whitespace-nowrap"
                                    :class="{
                                        'border-r': column.key != previewColumns[previewColumns.length -1].key
                                    }"
                                >
                                    <div v-if="column.key == 'Sr. No'" class="flex items-center space-x-2">
                                        <span v-if="row.success && row.showStatus" class="size-1.5 bg-surface-green-3 rounded"></span>
                                        <span v-else-if="row.showStatus" class="size-1.5 bg-surface-red-5 rounded"></span>
                                        <span v-else class="size-1.5"></span>
                                        <span>
                                            {{ row[column.key] }}
                                        </span>
                                    </div>
                                    <div v-else-if="column.key == 'message'" v-html="row.message">
                                    </div>
                                    <div v-else class="leading-5 text-sm">
                                        {{ row[column.key] }}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="mt-auto">
            <Button 
                v-if="data.status != 'Success' && (importFile || googleSheet)" 
                variant="solid" 
                :label="data.status == 'Pending' ? 'Start Import' : 'Retry'" 
                @click="importData"
                class="float-right"
            />
            <Button 
                v-else-if="data.status != 'Success'"
                variant="solid" 
                label="Save"  
                @click="importData"
                class="float-right"
            />
        </div>
        
    </div>
    <TemplateModal
        v-model="showTemplateModal"
        :data="data"
    />
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import type { DataImport, DataImports } from './types';
import { getBadgeColor } from "./dataImport"
import Badge from '../../src/components/Badge/Badge.vue'
import type { BadgeProps } from '../../src/components/Badge/types'
import Button from '../../src/components/Button/Button.vue'
import FeatherIcon from '../../src/components/FeatherIcon.vue'
import FileUploader from '../../src/components/FileUploader/FileUploader.vue'
import FormControl from '../../src/components/FormControl/FormControl.vue'
import TemplateModal from './TemplateModal.vue';
import { toast } from "../../src/components/Toast/index"
import call from '../../src/utils/call';

const emit = defineEmits(['updateStep'])
const sendEmailNotification = ref(false)
const showTemplateModal = ref(false)
const importFile = ref<string | undefined>(undefined)
const googleSheet = ref('')
const showPreview = ref(false)
const previewData = ref<Record<string, any>[]>([])
const previewColumns = ref<Array<{ label: string; key: string; width: string; align: 'left' | 'center' | 'right' }>>([])
const successfulImports = ref(0)
const showImportLogs = ref(false)

const props = defineProps<{
    dataImports: DataImports
    data: DataImport
}>()

const importData = () => {
    call("frappe.core.doctype.data_import.data_import.form_start_import", {
        data_import: props.data.name
    }).then(() => {
        props.dataImports.reload()
        setTimeout(() => {
            showImportLogs.value = true
            let updatedData = props.dataImports.data?.find(d => d.name === props.data.name)
            emit('updateStep', 'edit', updatedData)
            console.log(updatedData)
            console.log(showImportLogs.value)
        }, 500)
    })
}

watch([importFile, googleSheet], ([newFile, newSheet]) => {
    if (props.data.import_file != importFile.value || props.data.google_sheets_url != googleSheet.value) {
        updateDataImport(newFile, newSheet)
    }

    if (!importFile.value && !googleSheet.value) {
        resetFormState()
    }
})

const updateDataImport = (newFile: string | undefined, newSheet: string) => {
    props.dataImports.setValue.submit({
        ...props.data,
        import_file: newFile,
        google_sheets_url: newSheet
    }, {
        onSuccess(data: DataImport) {
            props.dataImports.reload()
            getPreviewData(newFile, newSheet)
        },
        onError(error: any) {
            toast.error(error)
            console.error("Error updating data import:", error)
        }
    })
}

const resetFormState = () => {
    showPreview.value = false
    showImportLogs.value = false
    previewData.value = []
    previewColumns.value = []
    successfulImports.value = 0
}

const getPreviewData = (newFile: string | undefined, newSheet: string) => {
    call("frappe.core.doctype.data_import.data_import.get_preview_from_template", {
        data_import: props.data.name,
        import_file: newFile,
        google_sheets_url: newSheet
    }).then((data: any) =>  {
        if (!data) return
        let keys: string[] = []

        showPreview.value = true
        showImportLogs.value = true

        preparePreviewColumns(data, keys)
        preparePreviewData(data, keys)
        console.log(props.data)
        console.log(showImportLogs.value)
        if (props.data.status != 'Pending' && showImportLogs.value)
            getImportLogs()
    }).catch((error: any) => {
        toast.error(error)
        console.error("Error fetching preview data:", error)
    })
}

const preparePreviewColumns = (data: any, keys: string[]) => {
    previewColumns.value = []
    data?.columns.forEach((col: any, index: number) => {
        let width = "500px"
        let align: 'left' | 'center' | 'right' = 'left'
        if (index == 0) {
            width = "100px"
        }
        keys.push(col.header_title)
        previewColumns.value.push({ label: col.header_title, key: col.header_title, width: width, align: align })
    })
}

const preparePreviewData = (data: any, keys: string[]) => {
    previewData.value = []
    data?.data.forEach((row: any) => {
        let rowData: Record<string, any> = {}
        row.forEach((cell: any, index: number) => {
            rowData.showStatus = false
            if (index == 0)
                rowData[keys[index]] = (cell - 1).toString()
            else
                rowData[keys[index]] = cell
        })
        previewData.value.push(rowData)
    })
}

const getImportLogs = () => {
    call("frappe.core.doctype.data_import.data_import.get_import_logs", {
        data_import: props.data.name
    }).then((data: any) =>  {
        previewColumns.value.push(
            { label: 'Message', key: 'message', width: "300px", align: 'left' }
        )
        data.forEach((row: any) => {
            previewData.value.forEach((log: any, index: number) => {
                let rowIndex = JSON.parse(row.row_indexes)[0] - 2 
                if (rowIndex == index) {
                    log.showStatus = true
                    log.success = row.success
                    log.message = JSON.parse(row.messages)?.[0]?.message || '-'
                    if (row.success) {
                        successfulImports.value++
                    }
                }
            })
        })
    })
}


watch(() => props.data, (newData) => {
    if (newData) {
        sendEmailNotification.value = !newData.mute_emails
        importFile.value = newData.import_file || undefined
        googleSheet.value = newData.google_sheets_url || ''
        if (importFile.value || googleSheet.value) {
            getPreviewData(importFile.value, googleSheet.value)
        }
    }
}, { immediate: true })

const openImportFile = () => {
    if (importFile.value) {
        const url = importFile.value.startsWith('http') ? importFile.value : `${window.location.origin}${importFile.value}`
        window.open(url, '_blank')
    }
}

const validateFile = (file: File) => {
    const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    if (!validTypes.includes(file.type)) {
        return 'Invalid file type. Please upload a CSV or Excel file.'
    }
}
</script>