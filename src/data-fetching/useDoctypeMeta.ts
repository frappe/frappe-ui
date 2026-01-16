import { computed, reactive } from 'vue'
import { createResource } from '../resources'

interface DocField {
  fieldname: string
  fieldtype: string
  label?: string
  options?: string
  [key: string]: any
}

interface DoctypeMeta {
  name: string
  fields: DocField[]
  [key: string]: any
}

export interface TransformedField {
  label: string | undefined
  type: string
  value: string
  options: string[] | undefined | null | string
}

// Global cache for doctype meta
const metaCache = reactive<Record<string, DoctypeMeta>>({})

const EXCLUDED_FIELDTYPES = [
  'Section Break',
  'Read Only',
  'Column Break',
  'Tab Break',
]

export function useDoctypeMeta(doctype: string) {
  // Create resource for fetching meta
  const resource = createResource({
    url: 'frappe.desk.form.load.getdoctype',
    cache: ['DoctypeMeta', doctype],
    params: { doctype },
    onSuccess: (response: any) => {
      const docs = response.docs || []
      for (const doc of docs) {
        metaCache[doc.name] = doc
      }
    },
  })

  // Always return meta from cache (reactive)
  const meta = computed(() => metaCache[doctype] || null)
  if (!meta.value && !resource.loading) {
    resource.fetch()
  }

  // Computed for transformed fields
  const fields = computed<TransformedField[]>(() => {
    const doctypeMeta = metaCache[doctype]
    if (!doctypeMeta?.fields) return []

    return doctypeMeta.fields
      .map((f) => ({
        label: f.label,
        type: f.fieldtype,
        value: f.fieldname,
        options: f.fieldtype === 'Select' ? f.options?.split('\n') : f.options,
      }))
      .filter((f) => !EXCLUDED_FIELDTYPES.includes(f.type))
  })

  // Get a single field by fieldname (raw)
  function getField(fieldname: string): DocField | null {
    const doctypeMeta = metaCache[doctype]
    return doctypeMeta?.fields.find((f) => f.fieldname === fieldname) || null
  }

  const emailFields = computed(() => {
    if (!fields.value.length) return []
    const recipients = fields.value.filter(
      (f) => f.type === 'Data' && f.options === 'Email',
    )
    return [
      {
        label: 'Owner',
        value: 'owner',
        type: 'Data',
        options: null,
      },
      ...recipients,
      {
        label: 'Assignee',
        value: '_assign',
        type: 'JSON',
        options: [],
      },
    ]
  })

  return {
    meta,
    fields,
    getField,
    resource,
    emailFields,
  }
}
