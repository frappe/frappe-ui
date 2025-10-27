<template>
    <div class="text-base h-full flex flex-col">
        <div class="text-xl font-semibold mb-1 text-ink-gray-9">
            New Data Import
        </div>
        <div class="grid grid-cols-1 gap-5 mt-5">
            <Link 
                doctype="DocType" 
                v-model="referenceDoctype" 
                label="Select a Document Type"
                :filters="{
                    'allow_import': 1
                }"
            />

            <FormControl
                v-model="importType"
                label="Import Type"
                type="select"
                :options="['Insert New Records', 'Update Existing Records']"
            />

            <FormControl
                v-model="sendEmailNotification"
                type="checkbox"
                label="Send Email Notification on Completion"
            />
        </div>
        <div class="mt-auto">
            <Button 
                variant="solid" 
                class="float-right"
                @click="saveImport"
            >
                Continue
            </Button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { DataImports } from './types'
import FormControl from '../../src/components/FormControl/FormControl.vue'
import Link from "../components/Link/Link.vue"
import Button from '../../src/components/Button/Button.vue'

const referenceDoctype = ref<string>('')
const importType = ref<'Insert New Records' | 'Update Existing Records'>('Insert New Records')
const sendEmailNotification = ref(false)
const emit = defineEmits(['updateStep'])

const props = defineProps<{
    dataImports: DataImports
}>()

const saveImport = () => {
    props.dataImports.insert.submit({
        reference_doctype: referenceDoctype.value,
        import_type: importType.value,
        mute_emails: !sendEmailNotification.value,
        status: 'Pending'
    }, {
        onSuccess(data) {
            emit('updateStep', 'edit', data)
        }
    })
}
</script>