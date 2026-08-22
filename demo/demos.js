import { defineAsyncComponent } from 'vue'

// Every demo in the playground. Add an entry and it gets a route
// (`/<slug>`) plus a row on the index page — no other file to touch.
export const demos = [
  {
    slug: 'contributors-list',
    title: 'Contributors list',
    description: 'Column mode, sortable header, selection, avatars and badges.',
    icon: 'lucide-users',
    component: defineAsyncComponent(
      () => import('./demos/ContributorsList.vue'),
    ),
  },
  {
    slug: 'toast-per-field',
    title: 'One action, one toast',
    description: 'A toast per field vs one toast reused across related edits.',
    icon: 'lucide-bell',
    component: defineAsyncComponent(() => import('./demos/ToastPerField.vue')),
  },
  {
    slug: 'dropdown-tour',
    title: 'Dropdown, every feature',
    description: 'Sections, icons, shortcuts, submenus, switches and typeahead.',
    icon: 'lucide-chevron-down',
    component: defineAsyncComponent(() => import('./demos/DropdownTour.vue')),
  },
]
