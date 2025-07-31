export const FIELD_TYPES = [
  'Autocomplete',
  'Attach',
  'Attach Image',
  'Barcode',
  'Button',
  'Check',
  'Code',
  'Color',
  'Currency',
  'Data',
  'Date',
  'Datetime',
  'Duration',
  'Dynamic Link',
  'Float',
  'Geolocation',
  'Heading',
  'HTML',
  'HTML Editor',
  'Icon',
  'Image',
  'Int',
  'JSON',
  'Link',
  'Long Text',
  'Markdown Editor',
  'Password',
  'Percent',
  'Phone',
  'Read Only',
  'Rating',
  'Select',
  'Signature',
  'Small Text',
  'Table',
  'Table MultiSelect',
  'Text',
  'Text Editor',
  'Time',
] as const

export const NO_VALUE_TYPES = [
  'Section Break',
  'Column Break',
  'Tab Break',
  'HTML',
  'Table',
  'Table MultiSelect',
  'Button',
  'Image',
  'Fold',
  'Heading',
] as const

export const LAYOUT_FIELDS = [
  'Section Break',
  'Column Break',
  'Tab Break',
  'Fold',
] as const

export const STD_FIELDS_LIST = [
  'name',
  'owner',
  'creation',
  'modified',
  'modified_by',
  '_user_tags',
  '_comments',
  '_assign',
  '_liked_by',
  'docstatus',
  'idx',
] as const

export const CHILD_TABLE_FIELD_LIST = [
  'parent',
  'parenttype',
  'parentfield',
] as const

export const RESTRICTED_FIELDS = [
  'name',
  'parent',
  'creation',
  'modified',
  'modified_by',
  'parentfield',
  'parenttype',
  'file_list',
  'flags',
  'docstatus',
] as const

export const HTML_FIELD_TYPES = [
  'Text Editor',
  'Text',
  'Small Text',
  'Long Text',
  'HTML Editor',
  'Markdown Editor',
  'Code',
] as const

export const IMAGE_FIELD_TYPES = ['Attach Image', 'Image'] as const

export const DATE_FIELD_TYPES = ['Date', 'Datetime'] as const

export const STD_FIELDS = [
  { fieldname: 'name', fieldtype: 'Link', label: 'ID' },
  {
    fieldname: 'owner',
    fieldtype: 'Link',
    label: 'Created By',
    options: 'User',
  },
  { fieldname: 'idx', fieldtype: 'Int', label: 'Index' },
  { fieldname: 'creation', fieldtype: 'Datetime', label: 'Created On' },
  { fieldname: 'modified', fieldtype: 'Datetime', label: 'Last Updated On' },
  {
    fieldname: 'modified_by',
    fieldtype: 'Link',
    label: 'Last Updated By',
    options: 'User',
  },
  { fieldname: '_user_tags', fieldtype: 'Data', label: 'Tags' },
  { fieldname: '_liked_by', fieldtype: 'Data', label: 'Liked By' },
  { fieldname: '_comments', fieldtype: 'Text', label: 'Comments' },
  { fieldname: '_assign', fieldtype: 'Text', label: 'Assigned To' },
  { fieldname: 'docstatus', fieldtype: 'Int', label: 'Document Status' },
]

export const NUMERIC_FIELD_TYPES = [
  'Int',
  'Float',
  'Currency',
  'Percent',
  'Duration',
] as const

export const STD_FIELDS_TABLE = [
  { fieldname: 'parent', fieldtype: 'Data', label: 'Parent' },
]

export const TABLE_FIELDS = ['Table', 'Table MultiSelect'] as const

export const STATUS_FIELDNAMES = [
  'status',
  'workflow_state',
  'docstatus',
] as const
export const TAGS_FIELDNAME = '_user_tags'
export const ASSIGN_FIELDNAME = '_assign'
export const RELATIVE_DATE_FIELDNAMES = ['creation', 'modified'] as const

export const DEFAULT_CURRENCY = 'USD'
export const TEXT_TRUNCATE_LENGTH = 50

export const DEFAULT_OPERATOR = {
  Data: 'like',
  Check: '=',
  Select: '=',
  Link: '=',
  Date: 'between',
  Datetime: 'between',
} as const
