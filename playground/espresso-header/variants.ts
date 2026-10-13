import type { Component } from 'vue'
import HeaderDefault from './headers/HeaderDefault.vue'
import HeaderFile from './headers/HeaderFile.vue'
import HeaderFullWidth from './headers/HeaderFullWidth.vue'
import HeaderTabs from './headers/HeaderTabs.vue'
import SubheaderDefault from './subheaders/SubheaderDefault.vue'
import SubheaderDropdown from './subheaders/SubheaderDropdown.vue'
import SubheaderEditor from './subheaders/SubheaderEditor.vue'
import SubheaderTabs from './subheaders/SubheaderTabs.vue'

export interface Variant {
  value: string
  label: string
  component: Component
}

/** Header types, in the order of Figma's `header new` set. */
export const headerTypes: Variant[] = [
  { value: 'default', label: 'Default', component: HeaderDefault },
  { value: 'file', label: 'File', component: HeaderFile },
  { value: 'tabs', label: 'Tabs', component: HeaderTabs },
  { value: 'full-width', label: 'Full width', component: HeaderFullWidth },
]

/** Subheader variations, in the order of Figma's `subheader new` set. */
export const subheaderTypes: Variant[] = [
  { value: 'default', label: 'Default', component: SubheaderDefault },
  { value: 'dropdown', label: 'Dropdown', component: SubheaderDropdown },
  { value: 'editor', label: 'Editor', component: SubheaderEditor },
  { value: 'tabs', label: 'Tabs', component: SubheaderTabs },
]
