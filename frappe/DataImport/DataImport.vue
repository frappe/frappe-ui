<template>
    <DataImportList
        v-if="step === 'list'" 
        :label="props.label" 
        :description="props.description" 
        :dataImports="dataImports"
        @updateStep="updateStep" 
    />

    <NewDataImport 
        v-else-if="step === 'new'" 
        :dataImports="dataImports"
        @updateStep="updateStep" 
    />

    <EditDataImport 
        v-else-if="step === 'edit'" 
        :dataImports="dataImports"
        :data="data"
        @updateStep="updateStep" 
    />
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DataImportList from './DataImportList.vue';
import NewDataImport from './NewDataImport.vue';
import EditDataImport from './EditDataImport.vue';
import type { DataImportProps, DataImport } from './types';
import { createListResource } from '../../src/resources'

const step = ref('list');
const data = ref<DataImport | null>(null);

const props = withDefaults(defineProps<DataImportProps>(), {
  label: 'Data Import',
  description: 'Import data into your system using CSV files.'
})

const dataImports = createListResource({
    doctype: 'Data Import',
    fields: ["name", "reference_doctype", "import_type", "status", "creation", "mute_emails", "import_file", "google_sheets_url"],
    auto: true,
    orderBy: "modified desc",
})

const updateStep = (newStep: 'list' | 'new' | 'edit', newData: DataImport) => {
  step.value = newStep
    if (newData) {
        data.value = newData
    }
}
</script>