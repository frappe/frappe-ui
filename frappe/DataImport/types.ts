export interface DataImportProps {
  label?: string
  description?: string
  doctype?: string | null
  importName?: string | null
  doctypeMap?: Record<string, { title: string; listRoute?: string; pageRoute?: string }>
}

export interface DataImport {
  name?: string
  reference_doctype: string
  import_type: string
  status: DataImportStatus
  creation?: string
  mute_emails: boolean
  import_file?: string
  google_sheets_url?: string
  template_options?: string
}

export interface DataImports {
  data: DataImport[]
  update: (args: { filters: any[] }) => void
  insert: { submit: (params: DataImport, options: { validate?: () => boolean; onSuccess: (data: DataImport) => void; onError: (err: any) => void }) => void }
  setValue: { submit: (params: DataImport, options: { onSuccess: (data: DataImport) => void; onError: (err: any) => void }) => void }
  reload: () => void
  hasNextPage: () => boolean
  next: () => Promise<void>
}

export type DataImportStatus = "Pending" | "Success" | "Partial Success" | "Error" | "Timed Out"

export interface DocField {
  label: string
  fieldname: string
  reqd: 0 | 1
  fieldtype: string
}

export interface File {
  name: string
  file_url: string
  file_name: string
  file_size: number
}