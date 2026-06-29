import { reactive } from 'vue'
import type { SidebarSection } from './components/Docs/sidebarList'

// Shared cross-component UI state for the docs layout.
export const state = reactive({
  mobsidebar: false,
  mobnavbar: false,
  searchDialog: false,
  sidebarList: [] as SidebarSection[],
})
