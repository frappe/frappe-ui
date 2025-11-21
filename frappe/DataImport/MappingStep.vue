<template>
    <div class="w-[700px] mx-auto pt-12 space-y-8">
       <div class="flex items-center justify-between">
            <div class="space-y-2">
                <div class="text-lg font-semibold text-ink-gray-9">
                    Map Data
                </div>
                <div>
                    Change the mapping of columns from your file to fields in the system
                </div>
            </div>
            
            <div class="space-x-2">
                <Button label="Start Over" @click="startOver" />
                <Button label="Continue" variant="solid" @click="$emit('updateStep', 'preview')" />
            </div>
       </div>

       <div v-if="Object.keys(columnMappings).length" class="border rounded-md space-y-8">
            <div class="grid grid-cols-2 text-ink-gray-5 border-b py-2 px-4">
                <div>
                    Fields in File
                </div>
                <div>
                    Fields in System
                </div>
            </div>
            <div class="grid grid-cols-2 py-2 px-4 gap-y-8">
                <template v-for="i in columnsFromFile.length" :key="i">
                    <div class="text-ink-gray-7">{{ columnsFromFile[i - 1] }}</div>
                    <Autocomplete
                        :model-value="columnMappings[columnsFromFile[i - 1]]"
                        :options="columnsFromSystem"
                        placeholder="Select field" 
                        @update:model-value="(val) => updateColumnMappings(i, val)"
                    />
                </template>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { DataImport, DataImports } from './types';
import { fieldsToIgnore, getPreviewData } from './dataImport'
import { computed, nextTick, onMounted, ref } from 'vue';
import Autocomplete from '../../src/components/Autocomplete/Autocomplete.vue';
import Button from '../../src/components/Button/Button.vue';
import FeatherIcon from '../../src/components/FeatherIcon.vue'
import Link from "../Link/Link.vue"

const previewData = ref<any>(null);
const emit = defineEmits(['updateStep'])
const columnMappings = ref<Record<string, string>>({});

const props = defineProps<{
    dataImports: DataImports
    data: DataImport
    fields: any
}>()

onMounted(async () => {
    previewData.value = await getPreviewData(props.data.name, props.data.import_file, props.data.google_sheets_url);
    initializeColumnMappings();
});

const initializeColumnMappings = () => {
    const mappings: Record<string, string> = {};
    let columnToFieldMap = []
    if (props.data?.template_options)
        columnToFieldMap = JSON.parse(props.data?.template_options)?.["column_to_field_map"];

        columnsFromFile.value.forEach((col: string, index: number) => {
        if (columnToFieldMap && columnToFieldMap[index])
            mappings[col] = getMappedColumnName(columnToFieldMap[index]);
        else
            mappings[col] = col;
    });

    columnMappings.value = mappings;
}

const getMappedColumnName = (fieldname: string) => {
    const field = columnsFromSystem.value.find((f: any) => f.value == fieldname);
    if (field)
        return field.label;
    return fieldname;
}

const updateColumnMappings = (index: number, value: any) => {
    if (!value) return;
    let columnToFieldMap = JSON.parse(props.data?.template_options)?.["column_to_field_map"] || {};
    columnToFieldMap[index - 1] = value.value;

    props.dataImports.setValue.submit({
        ...props.data,
        template_options: JSON.stringify({
            ...JSON.parse(props.data?.template_options),
            column_to_field_map: columnToFieldMap
        })
    }, {
        onSuccess: (data: DataImport) => {
            emit('updateStep', 'map', { ...data })
            nextTick(() => {
                initializeColumnMappings()
            })
        }
    })
}

const columnsFromFile = computed(() => {
    const columns: string[] = [];
    previewData.value?.columns.forEach((col: any) => {
        if (col.header_title != "Sr. No")
            columns.push(col.header_title);
    })
    return columns;
})

const columnsFromSystem = computed(() => {
  const parent = props.data.reference_doctype
  const docs = props.fields.data?.docs || []

  return docs
    .map((doc: any) => {
      const isParent = doc.name === parent

      const columns = doc.fields
        .filter((f: any) => !fieldsToIgnore.includes(f.fieldtype))
        .map((f: any) => ({
          value: f.fieldname,
          label: isParent
            ? f.label
            : `${f.label} (${getChildTableName(parent, doc.name)})`,
        }))

      return [
        { value: "name", label: "ID" },
        ...columns,
      ]
    })
    .flat()
})

const startOver = () => {
    props.dataImports.setValue.submit({
        ...props.data,
        template_options: JSON.stringify({
            ...JSON.parse(props.data?.template_options),
            column_to_field_map: {}
        })
    }, {
        onSuccess: (data: DataImport) => {
            emit('updateStep', 'map', { ...data })
            nextTick(() => {
                initializeColumnMappings()
            })
        }
    })
}

const getChildTableName = (parent: string, child: string) => {
    let parentFields = props.fields.data?.docs.find((doc: any) => doc.name == parent)?.fields || [];
    
    let childField = parentFields.filter((field: any) => field.options == child)[0]
    return childField?.label || child;
}
</script>