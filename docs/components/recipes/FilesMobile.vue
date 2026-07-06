<script setup>
import { computed, ref } from 'vue'
import {
  Avatar,
  BottomSheet,
  Button,
  Dropdown,
  MobileNav,
  MobileNavItem,
  MobileShell,
  PageHeaderMobile,
  Progress,
  Select,
  TextInput,
} from 'frappe-ui'
import { List, ListCell, ListRow } from 'frappe-ui/list'

// Desktop's sidebar navigation. On mobile it lives behind a bottom sheet
// (summoned from the header) rather than being permanently on screen.
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
// `size`; their meta line shows a derived child count instead. Copied verbatim
// from FilesDesktop so the two recipes stay in lockstep.
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

// Navigation: the id of the open folder (null = root). On mobile you drill into
// a folder *in place* — the same list screen updates and a back button appears
// in the header, the way iOS Files and Drive work — rather than pushing a
// separate detail screen.
const currentFolderId = ref(null)
const currentFolder = computed(() =>
  currentFolderId.value ? itemsById.get(currentFolderId.value) : null,
)

// Header title: the open folder's name once you drill in, otherwise the active
// sidebar section (Home / Recents / …).
const screenTitle = computed(() => currentFolder.value?.name || activeNav.value)

// Back target: the parent folder's name, or "Home" when one level deep at root.
const backLabel = computed(() => {
  const parentId = currentFolder.value?.parent
  return parentId ? itemsById.get(parentId).name : 'Home'
})

function childrenOf(folderId) {
  return allItems.filter((item) => item.parent === folderId)
}

function openFolder(folderId) {
  currentFolderId.value = folderId
  searchQuery.value = ''
}

function goBack() {
  openFolder(currentFolder.value?.parent ?? null)
}

function onRowClick(item) {
  // Folders drill in; tapping a file opens its action sheet (the mobile stand-in
  // for the desktop row's inline preview/menu).
  if (item.type === 'folder') openFolder(item.id)
  else openActions(item)
}

// Per-item overflow actions. On mobile these surface in a bottom sheet summoned
// by the trailing ellipsis (or by tapping a file row), not an inline dropdown.
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

const newActions = [
  { label: 'New folder', icon: 'lucide-folder-plus' },
  { label: 'Upload', icon: 'lucide-upload' },
]

// The item whose action sheet is open (null = closed). A single sheet is reused
// for whichever row you tap.
const activeItem = ref(null)
const showActions = computed({
  get: () => activeItem.value !== null,
  set: (open) => {
    if (!open) activeItem.value = null
  },
})
function openActions(item) {
  activeItem.value = item
}
const activeItemActions = computed(() =>
  activeItem.value?.type === 'folder' ? folderActions : fileActions,
)
function runAction(action) {
  const item = activeItem.value
  showActions.value = false
  // "Open" on a folder is the one action wired to do something — it drills in,
  // same as tapping the row. The rest are decorative in this recipe.
  if (item?.type === 'folder' && action.label === 'Open') openFolder(item.id)
}

// The nav sheet (desktop sidebar) — sections + storage meter.
const showNav = ref(false)
function selectNav(label) {
  activeNav.value = label
  openFolder(null)
  showNav.value = false
}

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
  { label: 'All types', value: 'all' },
  { label: 'Folders', value: 'folder' },
  { label: 'Documents', value: 'document' },
  { label: 'Images', value: 'image' },
  { label: 'Videos', value: 'video' },
  { label: 'Archives', value: 'archive' },
]
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

// The size/count shown on a row's meta line: byte size for files, a derived
// child count for folders.
function metaSize(item) {
  return item.type === 'folder'
    ? `${childrenOf(item.id).length} items`
    : item.sizeLabel
}

// Newest first, with a name tiebreaker so ties don't shuffle on re-sort.
function compareRows(a, b) {
  return a.daysAgo - b.daysAgo || a.name.localeCompare(b.name)
}

// A single flat, date-sorted list — the open folder's children after the
// search + type filters, ordered newest first (like iOS Files' Downloads).
const visibleItems = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return childrenOf(currentFolderId.value)
    .filter((item) => {
      const matchesType =
        selectedType.value === 'all' || categoryOf(item) === selectedType.value
      const matchesQuery = !query || item.name.toLowerCase().includes(query)
      return matchesType && matchesQuery
    })
    .sort(compareRows)
})

const navTab = ref('files')
function goHome() {
  navTab.value = 'files'
  selectNav('Home')
}
</script>

<template>
  <MobileShell>
    <PageHeaderMobile :title="screenTitle">
      <template #left>
        <!-- One level deep, the left slot is a back button; at the root it opens
             the nav sheet (the desktop sidebar). -->
        <Button
          v-if="currentFolder"
          variant="ghost"
          icon="lucide-chevron-left"
          :label="backLabel"
          @click="goBack"
        />
        <Button
          v-else
          variant="ghost"
          icon="lucide-panel-left"
          label="Menu"
          @click="showNav = true"
        />
      </template>
      <template #right>
        <Dropdown :options="newActions" align="end">
          <Button variant="ghost" icon="lucide-plus" label="New" />
        </Dropdown>
      </template>
    </PageHeaderMobile>

    <!-- Search + type filter, pinned under the header as the list scrolls. -->
    <div
      class="sticky top-0 z-10 flex items-center gap-2 border-b border-outline-gray-1 bg-surface-base px-4 py-2"
    >
      <TextInput
        v-model="searchQuery"
        type="text"
        placeholder="Search files"
        class="flex-1"
      >
        <template #prefix>
          <span
            class="lucide-search size-4 text-ink-gray-5"
            aria-hidden="true"
          />
        </template>
      </TextInput>
      <Select v-model="selectedType" :options="typeOptions" />
    </div>

    <div class="pb-6 pt-1">
      <!-- One flat, date-sorted list — no time-bucket group headers on mobile.
           Folders and files interleave, newest first. -->
      <List class="list-row-px-4">
        <ListRow
          v-for="item in visibleItems"
          :key="item.id"
          class="h-17"
          @click="onRowClick(item)"
        >
          <ListCell>
            <!-- Leading type glyph — the row's `icon` is a lucide class
                 (`lucide-folder` for folders, a file-type icon otherwise), so
                 folders and files share one element and every title lines up. -->
            <div class="size-7 grid place-content-center">
              <span
                :class="item.icon"
                class="size-5 shrink-0 text-ink-gray-5"
                aria-hidden="true"
              />
            </div>
          </ListCell>
          <ListCell>
            <div class="min-w-0 flex-1">
              <!-- Sized text in an inner span keeps its own line-height:
                   `leading-snug` + `truncate` on one element would shear off
                   descenders like the tail of "g". -->
              <div class="truncate leading-snug text-ink-gray-8">
                <span class="text-lg">{{ item.name }}</span>
              </div>
              <!-- Meta line, iOS "date · size" format: the desktop's Modified
                   column, then Size (or a derived child count for folders). -->
              <div class="mt-0.5 truncate text-sm text-ink-gray-5">
                {{ relativeLabel(item.daysAgo) }} · {{ metaSize(item) }}
              </div>
            </div>
          </ListCell>
          <ListCell class="justify-end">
            <!-- `@click.stop` so opening the action sheet doesn't also drill
                 into the folder / trigger the row tap. -->
            <Button
              variant="ghost"
              icon="lucide-ellipsis"
              :label="
                item.type === 'folder' ? 'Folder actions' : 'File actions'
              "
              @click.stop="openActions(item)"
            />
          </ListCell>
        </ListRow>
      </List>

      <div
        v-if="!visibleItems.length"
        class="flex flex-col items-center gap-1 px-4 py-16 text-center"
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

    <!-- Nav sheet — the desktop sidebar, surfaced on mobile as a sheet you pull
         up from the header. Sections on top, the storage meter pinned below. -->
    <BottomSheet v-model:open="showNav" title="Files">
      <div class="px-2 pb-4">
        <button
          v-for="item in nav"
          :key="item.label"
          class="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left transition"
          :class="
            item.label === activeNav
              ? 'bg-surface-gray-3'
              : 'hover:bg-surface-gray-2'
          "
          @click="selectNav(item.label)"
        >
          <span
            :class="item.icon"
            class="size-5 shrink-0 text-ink-gray-5"
            aria-hidden="true"
          />
          <span class="min-w-0 flex-1 truncate text-lg text-ink-gray-8">
            {{ item.label }}
          </span>
        </button>

        <div class="mt-4 border-t px-3 pt-4">
          <Progress :value="42" size="sm" label="Storage" hint />
          <div class="mt-1.5 text-xs text-ink-gray-5">4.2 GB of 10 GB used</div>
        </div>
      </div>
    </BottomSheet>

    <!-- Per-item action sheet — the desktop row's overflow dropdown, reused for
         whichever row you tap. -->
    <BottomSheet v-model:open="showActions" :title="activeItem?.name">
      <div class="px-2 pb-4">
        <button
          v-for="action in activeItemActions"
          :key="action.label"
          class="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left transition hover:bg-surface-gray-2"
          @click="runAction(action)"
        >
          <span
            :class="action.icon"
            class="size-5 shrink-0 text-ink-gray-5"
            aria-hidden="true"
          />
          <span class="min-w-0 flex-1 truncate text-lg text-ink-gray-8">
            {{ action.label }}
          </span>
        </button>
      </div>
    </BottomSheet>

    <template #nav>
      <MobileNav>
        <MobileNavItem
          label="Files"
          icon="lucide-folder"
          :active="navTab === 'files'"
          @click="goHome"
        />
        <MobileNavItem
          label="Shared"
          icon="lucide-users"
          :active="navTab === 'shared'"
          @click="navTab = 'shared'"
        />
        <MobileNavItem
          label="Search"
          icon="lucide-search"
          :active="navTab === 'search'"
          @click="navTab = 'search'"
        />
        <MobileNavItem
          label="You"
          :active="navTab === 'you'"
          @click="navTab = 'you'"
        >
          <template #default="{ active }">
            <Avatar
              image="https://i.pravatar.cc/150?img=5"
              label="Rhea Kapoor"
              size="md"
              :class="active ? 'ring-2 ring-outline-gray-4' : ''"
            />
          </template>
        </MobileNavItem>
      </MobileNav>
    </template>
  </MobileShell>
</template>
