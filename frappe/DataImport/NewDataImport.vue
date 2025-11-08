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
                :required="true"
            />

            <FormControl
                v-model="importType"
                label="Import Type"
                type="select"
                :options="['Insert New Records', 'Update Existing Records']"
                :required="true"
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
import type { DataImports, DataImport } from './types'
import FormControl from '../../src/components/FormControl/FormControl.vue'
import Button from '../../src/components/Button/Button.vue'
import Link from "../Link/Link.vue"
import { toast } from "../../src/components/Toast/index"

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
        validate() {
            return validateImport()
        },
        onSuccess(data: DataImport) {
            emit('updateStep', 'edit', data)
        },
        onError(error: any) {
            toast.error(error)
            console.error('Error creating data import:', error)
        }
    })
}

const validateImport = () => {
    if (!referenceDoctype.value) {
        toast.error('Please select a Document Type to proceed.')
        return false
    }
    if (!importType.value) {
        toast.error('Please select an Import Type to proceed.')
        return false
    }
    return true
}
</script>