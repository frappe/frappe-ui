<script setup lang="ts">
import { reactive } from 'vue'
import ContextMenu from './ContextMenu.vue'

const state = reactive({
  disabled: false,
  isUserLoggedIn: true,
  hasEditPermission: true,
  canDelete: false,
})

const contextMenuItems = [
  // File Operations Group
  {
    group: 'File Operations',
    items: [
      {
        label: 'Open',
        icon: 'folder-open',
        onClick: () => alert('Open clicked')
      },
      {
        label: 'Open in New Window with Very Long Label Text',
        icon: 'external-link',
        shortcut: '⌘⇧O',
        showTooltip: true, // Force tooltip for this item
        disabled: !state.hasEditPermission,
        onClick: () => alert('Open in New Window')
      },
      { separator: true },
      {
        label: 'Save',
        icon: 'save',
        shortcut: '⌘S',
        onClick: () => alert('Save clicked')
      },
      {
        label: 'Save As...',
        icon: 'file-plus',
        shortcut: '⌘⇧S',
        onClick: () => alert('Save As clicked')
      },
      {
        label: 'Save to Cloud Storage with Auto-Sync',
        icon: 'cloud',
        hidden: !state.isUserLoggedIn,
        onClick: () => alert('Save to Cloud')
      }
    ]
  },
  // Edit Group
  {
    group: 'Edit',
    items: [
      {
        label: 'Cut',
        icon: 'scissors',
        shortcut: '⌘X',
        hidden: !state.hasEditPermission,
        onClick: () => alert('Cut clicked')
      },
      {
        label: 'Copy',
        icon: 'copy',
        shortcut: '⌘C',
        onClick: () => alert('Copy clicked')
      },
      {
        label: 'Paste',
        icon: 'clipboard',
        shortcut: '⌘V',
        onClick: () => alert('Paste clicked')
      },
      { separator: true },
      {
        label: 'Find',
        icon: 'search',
        shortcut: '⌘F',
        onClick: () => alert('Find clicked')
      }
    ]
  },
  // Share Group with Nested Submenus
  {
    group: 'Share',
    items: [
      {
        label: 'Share',
        icon: 'share-2',
        submenu: [
          {
            label: 'Email',
            icon: 'mail',
            onClick: () => alert('Share via Email')
          },
          {
            label: 'Copy Link',
            icon: 'link',
            shortcut: '⌘⇧C',
            onClick: () => alert('Link copied')
          },
          { separator: true },
          {
            label: 'Social Media',
            icon: 'share',
            submenu: [
              {
                label: 'Twitter',
                icon: 'twitter',
                onClick: () => alert('Share on Twitter')
              },
              {
                label: 'Facebook',
                icon: 'facebook',
                onClick: () => alert('Share on Facebook')
              },
              {
                label: 'LinkedIn',
                icon: 'linkedin',
                onClick: () => alert('Share on LinkedIn')
              }
            ]
          }
        ]
      },
      {
        label: 'Export',
        icon: 'download',
        shortcut: '⌘E',
        onClick: () => alert('Export clicked')
      }
    ]
  },
  // Danger Zone
  {
    group: 'Danger Zone',
    items: [
      {
        label: 'Archive',
        icon: 'archive',
        onClick: () => alert('Archive clicked')
      },
      { separator: true },
      {
        label: 'Delete',
        icon: 'trash-2',
        theme: 'red',
        shortcut: '⌘⌫',
        disabled: !state.canDelete,
        onClick: () => alert('Delete clicked')
      }
    ]
  },
  // Theme Examples
  {
    group: 'Theme Examples',
    items: [
      {
        label: 'Blue Theme Item',
        icon: 'info',
        theme: 'blue',
        onClick: () => alert('Blue theme')
      },
      {
        label: 'Green Theme Item',
        icon: 'check-circle',
        theme: 'green',
        onClick: () => alert('Green theme')
      },
      {
        label: 'Red Theme Item',
        icon: 'alert-circle',
        theme: 'red',
        onClick: () => alert('Red theme')
      }
    ]
  }
]
</script>

<template>
  <Story title="ContextMenu" :layout="{ type: 'grid', width: '100%' }">
    <div class="p-8">
      <div class="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 class="font-semibold text-blue-900 mb-3">Interactive Controls</h3>
        <div class="space-y-2 text-sm">
          <div class="flex items-center gap-3">
            <input type="checkbox" v-model="state.isUserLoggedIn" class="form-checkbox" />
            <span>User Logged In (shows "Save to Cloud")</span>
          </div>
          <div class="flex items-center gap-3">
            <input type="checkbox" v-model="state.hasEditPermission" class="form-checkbox" />
            <span>Has Edit Permission (enables "Open in New Window", shows "Cut")</span>
          </div>
          <div class="flex items-center gap-3">
            <input type="checkbox" v-model="state.canDelete" class="form-checkbox" />
            <span>Can Delete (enables "Delete" button)</span>
          </div>
        </div>
      </div>

      <ContextMenu :items="contextMenuItems" :disabled="state.disabled">
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors cursor-context-menu active:bg-gray-50">
          <p class="text-gray-600 font-medium">
            <span class="hidden sm:inline">Right-click here</span>
            <span class="sm:hidden">Long-press here</span>
          </p>
          <p class="text-sm text-gray-500 mt-1">
            <span class="hidden sm:inline">Try the context menu with groups, submenus, themes, and conditional items</span>
            <span class="sm:hidden">Touch-optimized menu</span>
          </p>
        </div>
      </ContextMenu>

      <div class="mt-6 text-sm text-gray-600">
        <h4 class="font-semibold mb-2">Features Demonstrated:</h4>
        <ul class="list-disc list-inside space-y-1">
          <li>Group labels and separators</li>
          <li>Nested submenus (3 levels deep - see Social Media)</li>
          <li>Keyboard shortcuts display (hidden on mobile)</li>
          <li>Text truncation with tooltips for long labels</li>
          <li>Conditional visibility (hidden property)</li>
          <li>Disabled states</li>
          <li>Multiple themes (gray, red, green, blue)</li>
          <li>Icons and labels</li>
          <li>Fixed-width responsive design (192px → 224px → 240px)</li>
          <li>Collision detection prevents viewport overflow</li>
          <li>Mobile-optimized touch targets (40px height)</li>
          <li>Long-press support for mobile devices</li>
        </ul>
      </div>
    </div>

    <template #controls>
      <HstCheckbox v-model="state.disabled" title="Disabled" />
    </template>
  </Story>
</template>
