<template>
    <Dialog v-model="show" :options="{
        title: 'Export Data',
        size: '2xl',
    }">
        <template #body-content>
            <div class="text-base space-y-5">
                <div class="grid grid-cols-2 gap-5">
                    <FormControl
                        label="File Type"
                        v-model="fileType"
                        :options="['Excel', 'CSV']"
                        type="select"
                    />
                    <FormControl
                        label="Export Type"
                        v-model="exportType"
                        :options="['All Records', '5 Records', 'Blank Template']"
                        type="select"
                    />
                </div>
                <div class="border-t">
                    <p class="mt-2 text-ink-gray-5">
                        Select the fields you want to include in the template.
                    </p>
                    <div class="space-x-2 mt-2 mb-5">
                        <Button label="Select All" @click="selectAllFields" />
                        <Button label="Select Mandatory Fields" @click="selectMandatoryFields" />
                        <Button label="Unselect All" @click="unselectAllFields" />
                    </div>
                    <div class="grid grid-cols-2 gap-5">
                        <div v-for="field in fields.data" :key="field.fieldname" class="flex items-center space-x-2">
                            <FormControl
                                type="checkbox"
                                v-model="fieldSelection[field.fieldname]"
                            />
                            <label :class="{
                                'text-ink-red-3': field.reqd
                            }">
                                {{ field.label }}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #actions="{ close }">
            <div class="flex justify-end space-x-2">
                <Button label="Export" variant="solid" @click="handleExport" />
                <Button label="Cancel" @click="close" />
            </div>
        </template>
    </Dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { DataImport, DocField } from './types'
import { createListResource } from '../../src/resources'
import Button from "../../src/components/Button/Button.vue"
import Dialog from "../../src/components/Dialog/Dialog.vue"
import FormControl from "../../src/components/FormControl/FormControl.vue"
import call from '../../src/utils/call'

const show = defineModel<boolean>({ required: true, default: false })
const fileType = ref<'Excel' | 'CSV'>('CSV')
const exportType = ref<'All Records' | '5 Records' | 'Blank Template'>('Blank Template')
const fieldSelection = ref<Record<string, boolean>>({})

const props = defineProps<{
    data: DataImport
}>()

const fields = createListResource({
    doctype: "DocField",
    parent: "DocType",
    filters: {
        parent: props.data.reference_doctype,
        parenttype: "DocType",
        parentfield: "fields",
    },
    fields: ["fieldname", "label", "reqd"],
    orderBy: "idx asc",
    auto: true,
    transform(data: DocField[]) {
        data.unshift({ fieldname: "name", label: "ID", reqd: 1 })
        data.forEach(field => {
            fieldSelection.value[field.fieldname] = field.reqd ? true : false
        })
    }
})

const handleExport = async () => {
    let doctype = props.data.reference_doctype
    let exportFields = { [doctype]: Object.keys(fieldSelection.value).filter((fieldname: string) => fieldSelection.value[fieldname]) }
    let exportRecords = getExportType()
    let exportPageLength = exportType.value == "5 Records" ? 5 : ''
    let url = `/api/method/frappe.core.doctype.data_import.data_import.download_template?doctype=${encodeURIComponent(doctype)}&export_fields=${encodeURIComponent(JSON.stringify(exportFields))}&export_records=${encodeURIComponent(exportRecords)}&file_type=${encodeURIComponent(fileType.value)}&export_page_length=${exportPageLength}`

    const response = await fetch(url)
    const blob = await response.blob();
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = props.data.reference_doctype + (fileType.value === 'CSV' ? '.csv' : '.xlsx');
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
}

const getExportType = () => {
    if (exportType.value == "Blank Template")
        return "blank_template"
    return "all"
}

const selectAllFields = () => {
    fields.data?.forEach((field: DocField) => {
        fieldSelection.value[field.fieldname] = true
    })
}

const selectMandatoryFields = () => {
    fields.data?.forEach((field: DocField) => {
        fieldSelection.value[field.fieldname] = field.reqd ? true : false
    })
}

const unselectAllFields = () => {
    fields.data?.forEach((field: DocField) => {
        fieldSelection.value[field.fieldname] = false
    })
}

</script>