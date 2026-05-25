import { reactive } from 'vue'
import { SidebarSection } from './components/Docs/sidebarList'

export const state = reactive({
  mobsidebar: false,
  mobnavbar: false,
  searchDialog: false,
  sidebarList: [] as SidebarSection[],
})
