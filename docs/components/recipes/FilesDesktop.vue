<script setup>
import { computed, ref } from 'vue'
import {
  Avatar,
  Breadcrumbs,
  Button,
  DesktopShell,
  Dropdown,
  PageHeader,
  Progress,
  ScrollArea,
  Select,
  Sidebar,
  SidebarHeader,
  SidebarItem,
  TextInput,
} from 'frappe-ui'
import {
  List,
  ListCell,
  ListGroup,
  ListHeader,
  ListHeaderCell,
  ListHeaderCellSort,
  ListRow,
} from 'frappe-ui/list'

const nav = [
  { label: 'Home', icon: 'lucide-house' },
  { label: 'Recents', icon: 'lucide-clock' },
  { label: 'Favourites', icon: 'lucide-star' },
  { label: 'Shared with me', icon: 'lucide-users' },
  { label: 'Trash', icon: 'lucide-trash-2' },
]
const activeNav = ref('Home')

// A flat tree: `parent` is the id of the containing folder (null at the root).
// Folders and files share one collection so they interleave in the time
// buckets. `daysAgo` is the single source of truth for age — both the relative
// label and the bucket a row lands in derive from it. Folders carry no byte
// `size`; their Size column shows a derived child count instead.
const allItems = [
  // Root
  {
    id: 'design',
    parent: null,
    type: 'folder',
    name: 'Design assets',
    icon: 'lucide-folder',
    owner: 'Rhea Kapoor',
    ownerImage: 'https://i.pravatar.cc/150?img=5',
    daysAgo: 0,
  },
  {
    id: 'contracts',
    parent: null,
    type: 'folder',
    name: 'Contracts',
    icon: 'lucide-folder',
    owner: 'Priya Nair',
    ownerImage: 'https://i.pravatar.cc/150?img=12',
    daysAgo: 3,
  },
  {
    id: 'screenshots',
    parent: null,
    type: 'folder',
    name: 'Product screenshots',
    icon: 'lucide-folder',
    owner: 'Sam Rivera',
    ownerImage: 'https://i.pravatar.cc/150?img=33',
    daysAgo: 8,
  },
  {
    id: 'offsite',
    parent: null,
    type: 'folder',
    name: 'Team offsite 2026',
    icon: 'lucide-folder',
    owner: 'Ana Costa',
    ownerImage: 'https://i.pravatar.cc/150?img=47',
    daysAgo: 21,
  },
  {
    id: 'q2-deck',
    parent: null,
    type: 'file',
    name: 'Q2 board deck.pdf',
    icon: 'lucide-file-text',
    owner: 'Rhea Kapoor',
    ownerImage: 'https://i.pravatar.cc/150?img=5',
    daysAgo: 0,
    size: 8.4,
    sizeLabel: '8.4 MB',
  },
  {
    id: 'standup',
    parent: null,
    type: 'file',
    name: 'Standup notes.md',
    icon: 'lucide-file-text',
    owner: 'Evan You',
    ownerImage: 'https://avatars.githubusercontent.com/u/499550?v=4',
    daysAgo: 0,
    size: 0.02,
    sizeLabel: '18 KB',
  },
  {
    id: 'hero',
    parent: null,
    type: 'file',
    name: 'Homepage hero.png',
    icon: 'lucide-image',
    owner: 'Evan You',
    ownerImage: 'https://avatars.githubusercontent.com/u/499550?v=4',
    daysAgo: 1,
    size: 2.1,
    sizeLabel: '2.1 MB',
  },
  {
    id: 'revenue',
    parent: null,
    type: 'file',
    name: 'Revenue model.xlsx',
    icon: 'lucide-file-spreadsheet',
    owner: 'Priya Nair',
    ownerImage: 'https://i.pravatar.cc/150?img=12',
    daysAgo: 2,
    size: 0.6,
    sizeLabel: '640 KB',
  },
  {
    id: 'sprint',
    parent: null,
    type: 'file',
    name: 'Sprint plan.docx',
    icon: 'lucide-file-text',
    owner: 'Amy Santiago',
    ownerImage: 'https://i.pravatar.cc/150?img=45',
    daysAgo: 4,
    size: 0.3,
    sizeLabel: '312 KB',
  },
  {
    id: 'teaser',
    parent: null,
    type: 'file',
    name: 'Launch teaser.mp4',
    icon: 'lucide-video',
    owner: 'Sam Rivera',
    ownerImage: 'https://i.pravatar.cc/150?img=33',
    daysAgo: 5,
    size: 148,
    sizeLabel: '148 MB',
  },
  {
    id: 'old-logo',
    parent: null,
    type: 'file',
    name: 'Old logo.ai',
    icon: 'lucide-file-image',
    owner: 'Ana Costa',
    ownerImage: 'https://i.pravatar.cc/150?img=47',
    daysAgo: 9,
    size: 5.6,
    sizeLabel: '5.6 MB',
  },
  {
    id: 'brand-fonts',
    parent: null,
    type: 'file',
    name: 'Brand fonts.zip',
    icon: 'lucide-file-archive',
    owner: 'Ana Costa',
    ownerImage: 'https://i.pravatar.cc/150?img=47',
    daysAgo: 12,
    size: 24,
    sizeLabel: '24 MB',
  },
  {
    id: 'archive',
    parent: null,
    type: 'file',
    name: 'Archive 2025.zip',
    icon: 'lucide-file-archive',
    owner: 'Rhea Kapoor',
    ownerImage: 'https://i.pravatar.cc/150?img=5',
    daysAgo: 40,
    size: 512,
    sizeLabel: '512 MB',
  },

  // Inside "Design assets" — includes a sub-folder for multi-level nav
  {
    id: 'exports',
    parent: 'design',
    type: 'folder',
    name: 'Exports',
    icon: 'lucide-folder',
    owner: 'Rhea Kapoor',
    ownerImage: 'https://i.pravatar.cc/150?img=5',
    daysAgo: 1,
  },
  {
    id: 'logo-master',
    parent: 'design',
    type: 'file',
    name: 'Logo master.svg',
    icon: 'lucide-file-image',
    owner: 'Rhea Kapoor',
    ownerImage: 'https://i.pravatar.cc/150?img=5',
    daysAgo: 0,
    size: 0.4,
    sizeLabel: '420 KB',
  },
  {
    id: 'palette',
    parent: 'design',
    type: 'file',
    name: 'Color palette.png',
    icon: 'lucide-image',
    owner: 'Sam Rivera',
    ownerImage: 'https://i.pravatar.cc/150?img=33',
    daysAgo: 2,
    size: 1.2,
    sizeLabel: '1.2 MB',
  },
  {
    id: 'type-scale',
    parent: 'design',
    type: 'file',
    name: 'Type scale.pdf',
    icon: 'lucide-file-text',
    owner: 'Rhea Kapoor',
    ownerImage: 'https://i.pravatar.cc/150?img=5',
    daysAgo: 6,
    size: 3.1,
    sizeLabel: '3.1 MB',
  },

  // Inside "Design assets / Exports"
  {
    id: 'logo-2x',
    parent: 'exports',
    type: 'file',
    name: 'logo@2x.png',
    icon: 'lucide-image',
    owner: 'Rhea Kapoor',
    ownerImage: 'https://i.pravatar.cc/150?img=5',
    daysAgo: 1,
    size: 0.8,
    sizeLabel: '800 KB',
  },
  {
    id: 'brand-sheet',
    parent: 'exports',
    type: 'file',
    name: 'brand-sheet.pdf',
    icon: 'lucide-file-text',
    owner: 'Sam Rivera',
    ownerImage: 'https://i.pravatar.cc/150?img=33',
    daysAgo: 1,
    size: 2.4,
    sizeLabel: '2.4 MB',
  },

  // Inside "Contracts"
  {
    id: 'msa',
    parent: 'contracts',
    type: 'file',
    name: 'MSA 2026.pdf',
    icon: 'lucide-file-text',
    owner: 'Priya Nair',
    ownerImage: 'https://i.pravatar.cc/150?img=12',
    daysAgo: 3,
    size: 0.5,
    sizeLabel: '512 KB',
  },
  {
    id: 'nda',
    parent: 'contracts',
    type: 'file',
    name: 'NDA template.docx',
    icon: 'lucide-file-text',
    owner: 'Priya Nair',
    ownerImage: 'https://i.pravatar.cc/150?img=12',
    daysAgo: 9,
    size: 0.1,
    sizeLabel: '96 KB',
  },
  {
    id: 'vendor',
    parent: 'contracts',
    type: 'file',
    name: 'Vendor agreement.pdf',
    icon: 'lucide-file-text',
    owner: 'Amy Santiago',
    ownerImage: 'https://i.pravatar.cc/150?img=45',
    daysAgo: 20,
    size: 0.7,
    sizeLabel: '720 KB',
  },

  // Inside "Product screenshots"
  {
    id: 'ss-dashboard',
    parent: 'screenshots',
    type: 'file',
    name: 'Dashboard.png',
    icon: 'lucide-image',
    owner: 'Sam Rivera',
    ownerImage: 'https://i.pravatar.cc/150?img=33',
    daysAgo: 8,
    size: 1.6,
    sizeLabel: '1.6 MB',
  },
  {
    id: 'ss-settings',
    parent: 'screenshots',
    type: 'file',
    name: 'Settings.png',
    icon: 'lucide-image',
    owner: 'Sam Rivera',
    ownerImage: 'https://i.pravatar.cc/150?img=33',
    daysAgo: 8,
    size: 1.1,
    sizeLabel: '1.1 MB',
  },
  {
    id: 'ss-onboarding',
    parent: 'screenshots',
    type: 'file',
    name: 'Onboarding.png',
    icon: 'lucide-image',
    owner: 'Evan You',
    ownerImage: 'https://avatars.githubusercontent.com/u/499550?v=4',
    daysAgo: 10,
    size: 1.3,
    sizeLabel: '1.3 MB',
  },

  // Inside "Team offsite 2026"
  {
    id: 'off-agenda',
    parent: 'offsite',
    type: 'file',
    name: 'Agenda.pdf',
    icon: 'lucide-file-text',
    owner: 'Ana Costa',
    ownerImage: 'https://i.pravatar.cc/150?img=47',
    daysAgo: 21,
    size: 0.3,
    sizeLabel: '320 KB',
  },
  {
    id: 'off-photo',
    parent: 'offsite',
    type: 'file',
    name: 'Group photo.jpg',
    icon: 'lucide-image',
    owner: 'Ana Costa',
    ownerImage: 'https://i.pravatar.cc/150?img=47',
    daysAgo: 22,
    size: 6.2,
    sizeLabel: '6.2 MB',
  },
  {
    id: 'off-budget',
    parent: 'offsite',
    type: 'file',
    name: 'Budget.xlsx',
    icon: 'lucide-file-spreadsheet',
    owner: 'Priya Nair',
    ownerImage: 'https://i.pravatar.cc/150?img=12',
    daysAgo: 25,
    size: 0.4,
    sizeLabel: '380 KB',
  },
]

const itemsById = new Map(allItems.map((item) => [item.id, item]))

// Navigation: the id of the open folder (null = root). Files/folders shown are
// this folder's direct children.
const currentFolderId = ref(null)

function childrenOf(folderId) {
  return allItems.filter((item) => item.parent === folderId)
}

function openFolder(folderId) {
  currentFolderId.value = folderId
  searchQuery.value = ''
}

// Home + one crumb per ancestor down to the open folder. Each crumb navigates.
const breadcrumbs = computed(() => {
  const trail = []
  let node = currentFolderId.value ? itemsById.get(currentFolderId.value) : null
  while (node) {
    trail.unshift(node)
    node = node.parent ? itemsById.get(node.parent) : null
  }
  return [
    { label: 'Home', onClick: () => openFolder(null) },
    ...trail.map((folder) => ({
      label: folder.name,
      onClick: () => openFolder(folder.id),
    })),
  ]
})

function onRowClick(item) {
  if (item.type === 'folder') openFolder(item.id)
  // Files would open a preview here; no-op in this recipe.
}

const fileActions = [
  { label: 'Download', icon: 'lucide-download' },
  { label: 'Share', icon: 'lucide-user-plus' },
  { label: 'Rename', icon: 'lucide-pencil' },
  { label: 'Move to trash', icon: 'lucide-trash-2' },
]

const folderActions = [
  { label: 'Open', icon: 'lucide-folder-open' },
  { label: 'Share', icon: 'lucide-user-plus' },
  { label: 'Rename', icon: 'lucide-pencil' },
  { label: 'Move to trash', icon: 'lucide-trash-2' },
]

// Fixed, chronological buckets. Each row lands in the first bucket whose
// `match` accepts its `daysAgo`; empty buckets drop out of the render.
const timeBuckets = [
  { key: 'today', label: 'Today', match: (d) => d <= 0 },
  { key: 'yesterday', label: 'Yesterday', match: (d) => d === 1 },
  { key: 'this-week', label: 'This week', match: (d) => d >= 2 && d <= 6 },
  { key: 'last-week', label: 'Last week', match: (d) => d >= 7 && d <= 13 },
  { key: 'earlier', label: 'Earlier', match: (d) => d >= 14 },
]

// One filterable category per row. Folders are their own category; files map
// from their icon so the data stays the single source of truth.
const categoryByIcon = {
  'lucide-file-text': 'document',
  'lucide-file-spreadsheet': 'document',
  'lucide-image': 'image',
  'lucide-file-image': 'image',
  'lucide-video': 'video',
  'lucide-file-archive': 'archive',
}

function categoryOf(item) {
  if (item.type === 'folder') return 'folder'
  return categoryByIcon[item.icon] ?? 'document'
}

const typeOptions = [
  { label: 'All types', value: 'all', icon: 'lucide-list-filter' },
  { label: 'Folders', value: 'folder', icon: 'lucide-folder' },
  { label: 'Documents', value: 'document', icon: 'lucide-file-text' },
  { label: 'Images', value: 'image', icon: 'lucide-image' },
  { label: 'Videos', value: 'video', icon: 'lucide-video' },
  { label: 'Archives', value: 'archive', icon: 'lucide-file-archive' },
]
const typeIcon = Object.fromEntries(typeOptions.map((o) => [o.value, o.icon]))
const selectedType = ref('all')
const searchQuery = ref('')
const isFiltering = computed(
  () => !!searchQuery.value.trim() || selectedType.value !== 'all',
)

function relativeLabel(daysAgo) {
  if (daysAgo <= 0) return 'Today'
  if (daysAgo === 1) return 'Yesterday'
  if (daysAgo < 7) return `${daysAgo} days ago`
  if (daysAgo < 14) return 'Last week'
  if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} weeks ago`
  const months = Math.floor(daysAgo / 30)
  return `${months} ${months === 1 ? 'month' : 'months'} ago`
}

const sortField = ref('modified')
const sortDirection = ref('asc')

function toggleSort(field) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

function directionFor(field) {
  return sortField.value === field ? sortDirection.value : null
}

// Folders have no byte size, so treat them as 0 for a size-sort (they cluster
// at the light end); a name tiebreaker keeps ties from shuffling on re-sort.
function compareRows(a, b) {
  const factor = sortDirection.value === 'desc' ? -1 : 1
  if (sortField.value === 'name') return factor * a.name.localeCompare(b.name)
  if (sortField.value === 'size') {
    return (
      factor * ((a.size ?? 0) - (b.size ?? 0)) || a.name.localeCompare(b.name)
    )
  }
  return factor * (a.daysAgo - b.daysAgo) || a.name.localeCompare(b.name)
}

// The time buckets are the primary structure; the active column sort only
// orders rows *within* each bucket. Group order stays chronological either way.
const groups = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const visible = childrenOf(currentFolderId.value).filter((item) => {
    const matchesType =
      selectedType.value === 'all' || categoryOf(item) === selectedType.value
    const matchesQuery = !query || item.name.toLowerCase().includes(query)
    return matchesType && matchesQuery
  })
  const sorted = visible.sort(compareRows)
  return timeBuckets
    .map((bucket) => ({
      ...bucket,
      items: sorted.filter((item) => bucket.match(item.daysAgo)),
    }))
    .filter((group) => group.items.length)
})
</script>

<template>
  <div class="h-screen w-full bg-surface-base text-ink-gray-9">
    <DesktopShell>
      <template #sidebar>
        <Sidebar width="14rem" class="border-r">
          <SidebarHeader
            title="Files"
            subtitle="kestrel.frappe.cloud"
            logo="https://api.dicebear.com/10.x/disco/svg?seed=Kestrel"
            :menu-items="[
              { label: 'Switch team', icon: 'lucide-arrow-left-right' },
              { label: 'Log out', icon: 'lucide-log-out' },
            ]"
          />

          <ScrollArea class="min-h-0 flex-1" viewport-class="px-2 pt-0.5 pb-10">
            <nav class="space-y-0.5">
              <SidebarItem
                v-for="item in nav"
                :key="item.label"
                :active="activeNav === item.label"
                @click="activeNav = item.label"
              >
                <template #prefix>
                  <span :class="item.icon" class="size-4" aria-hidden="true" />
                </template>
                <span class="flex-1 truncate text-sm">{{ item.label }}</span>
              </SidebarItem>
            </nav>
          </ScrollArea>

          <div class="mt-auto px-4 pb-4">
            <Progress :value="42" size="sm" label="Storage" hint />
            <div class="mt-1.5 text-xs text-ink-gray-5">
              4.2 GB of 10 GB used
            </div>
          </div>
        </Sidebar>
      </template>

      <PageHeader>
        <Breadcrumbs :items="breadcrumbs" />
        <div class="flex items-center gap-2">
          <Button label="New folder" icon-left="lucide-folder-plus" />
          <Button variant="solid" label="Upload" icon-left="lucide-upload" />
        </div>
      </PageHeader>

      <div class="px-3 pb-10 pt-4 sm:px-5">
        <div class="flex items-center gap-2 pb-3">
          <TextInput
            v-model="searchQuery"
            type="text"
            placeholder="Search files"
            class="w-64"
          >
            <template #prefix>
              <span
                class="lucide-search size-4 text-ink-gray-5"
                aria-hidden="true"
              />
            </template>
          </TextInput>
          <Select v-model="selectedType" :options="typeOptions">
            <template #item-prefix="{ item }">
              <span
                :class="typeIcon[item.value]"
                class="size-4 text-ink-gray-6"
                aria-hidden="true"
              />
            </template>
          </Select>
        </div>

        <!-- -mx-3 pairs with list-row-px-3: the row padding insets the content
             back to the toolbar's edge while the hover surface bleeds past it
             into the gutter, so headers and rows stay aligned with the search
             and filter controls above. -->
        <List
          class="-mx-3 list-row-px-3"
          :columns="['minmax(0,1fr)', '11rem', '7.5rem', '5.5rem', '3rem']"
          :row-height="40"
        >
          <ListHeader class="sticky top-0 z-10 bg-surface-base">
            <ListHeaderCellSort
              :direction="directionFor('name')"
              @click="toggleSort('name')"
            >
              Name
            </ListHeaderCellSort>
            <ListHeaderCell>Owner</ListHeaderCell>
            <ListHeaderCellSort
              :direction="directionFor('modified')"
              @click="toggleSort('modified')"
            >
              Modified
            </ListHeaderCellSort>
            <!-- Right-aligned column: `align="end"` right-aligns the header and
                 moves the sort glyph to the leading side, so "Size" stays flush
                 with the values below. -->
            <ListHeaderCellSort
              :direction="directionFor('size')"
              align="end"
              @click="toggleSort('size')"
            >
              Size
            </ListHeaderCellSort>
            <ListHeaderCell />
          </ListHeader>

          <!-- ListGroup wraps each time bucket in a labelled `role="rowgroup"`
               and keeps the rows as direct children, so the `list-row + list-row`
               dividers survive within a group. Folders and files interleave
               within a bucket, ordered by the active column sort. -->
          <ListGroup
            v-for="group in groups"
            :key="group.key"
            :label="group.label"
          >
            <ListRow
              v-for="item in group.items"
              :key="item.id"
              @click="onRowClick(item)"
            >
              <ListCell>
                <span
                  :class="item.icon"
                  class="size-4 shrink-0 text-ink-gray-5"
                />
                <span class="ml-3 truncate text-base text-ink-gray-8">
                  {{ item.name }}
                </span>
              </ListCell>
              <ListCell>
                <Avatar
                  :label="item.owner"
                  :image="item.ownerImage"
                  size="sm"
                />
                <span class="ml-2 truncate text-base text-ink-gray-7">
                  {{ item.owner }}
                </span>
              </ListCell>
              <ListCell>
                <span class="text-base text-ink-gray-6">
                  {{ relativeLabel(item.daysAgo) }}
                </span>
              </ListCell>
              <ListCell class="justify-end">
                <span class="text-base text-ink-gray-6">
                  {{
                    item.type === 'folder'
                      ? `${childrenOf(item.id).length} items`
                      : item.sizeLabel
                  }}
                </span>
              </ListCell>
              <ListCell class="justify-end">
                <Dropdown
                  :options="
                    item.type === 'folder' ? folderActions : fileActions
                  "
                >
                  <Button
                    variant="ghost"
                    icon="lucide-ellipsis"
                    :label="
                      item.type === 'folder' ? 'Folder actions' : 'File actions'
                    "
                  />
                </Dropdown>
              </ListCell>
            </ListRow>
          </ListGroup>
        </List>

        <div
          v-if="!groups.length"
          class="flex flex-col items-center gap-1 py-16 text-center"
        >
          <span
            :class="isFiltering ? 'lucide-search-x' : 'lucide-folder-open'"
            class="size-6 text-ink-gray-4"
            aria-hidden="true"
          />
          <p class="text-base font-medium text-ink-gray-7">
            {{ isFiltering ? 'No files found' : 'This folder is empty' }}
          </p>
          <p class="text-p-sm text-ink-gray-5">
            {{
              isFiltering
                ? 'Try a different search or file type.'
                : 'Upload a file or create a folder to get started.'
            }}
          </p>
        </div>
      </div>
    </DesktopShell>
  </div>
</template>
