const __resolved__virtual_storySource_srcComponentsDropdownDropdownStoryVue = `<script setup lang="ts">
import { Dropdown } from './index'
import { Button } from '../Button'

const actions = [
  {
    label: 'Edit',
    icon: LucideEdit,
    onClick: () => console.log('Edit clicked'),
  },
  {
    label: 'Delete',
    icon: LucideTrash2,
    onClick: () => console.log('Delete clicked'),
  },
]

const groupedActions = [
  {
    group: 'Actions',
    items: [
      {
        label: 'Edit',
        icon: LucideEdit,
        onClick: () => console.log('Edit clicked'),
      },
      {
        label: 'Duplicate',
        icon: LucideCopy,
        onClick: () => console.log('Duplicate clicked'),
      },
      {
        label: 'More Actions',
        icon: LucideMoreHorizontal,
        submenu: [
          {
            label: 'Archive',
            icon: LucideArchive,
            onClick: () => console.log('Archive clicked'),
          },
          {
            label: 'Export',
            icon: LucideDownload,
            submenu: [
              {
                label: 'Export as PDF',
                icon: LucideFileText,
                onClick: () => console.log('Export as PDF clicked'),
              },
              {
                label: 'Export as CSV',
                icon: LucideFile,
                onClick: () => console.log('Export as CSV clicked'),
              },
            ],
          },
          {
            label: 'Share',
            icon: LucideShare,
            onClick: () => console.log('Share clicked'),
          },
        ],
      },
    ],
  },
  {
    group: 'Danger',
    items: [
      {
        label: 'Delete',
        icon: LucideTrash2,
        onClick: () => console.log('Delete clicked'),
      },
    ],
  },
]

const submenuActions = [
  {
    label: 'New',
    icon: LucidePlus,
    submenu: [
      {
        group: 'Documents',
        items: [
          {
            label: 'New Document',
            icon: LucideFilePlus,
            onClick: () => console.log('New Document clicked'),
          },
          {
            label: 'New Template',
            icon: LucideFileText,
            onClick: () => console.log('New Template clicked'),
          },
        ],
      },
      {
        group: 'Organization',
        items: [
          {
            label: 'New Folder',
            icon: LucideFolderPlus,
            onClick: () => console.log('New Folder clicked'),
          },
          {
            label: 'New Project',
            icon: LucideBriefcase,
            onClick: () => console.log('New Project clicked'),
          },
        ],
      },
    ],
  },
  {
    label: 'Edit',
    icon: LucideEdit,
    onClick: () => console.log('Edit clicked'),
  },
  {
    label: 'Share',
    icon: LucideShare,
    submenu: [
      {
        label: 'Share with Link',
        icon: LucideLink,
        onClick: () => console.log('Share with Link clicked'),
      },
      {
        label: 'Share with Email',
        icon: LucideMail,
        onClick: () => console.log('Share with Email clicked'),
      },
      {
        group: 'Advanced',
        items: [
          {
            label: 'Share Settings',
            icon: LucideSettings,
            onClick: () => console.log('Share Settings clicked'),
          },
          {
            label: 'Permission Management',
            icon: LucideShield,
            onClick: () => console.log('Permission Management clicked'),
          },
        ],
      },
    ],
  },
]
<\/script>

<template>
  <Story title="Dropdown" :layout="{ type: 'grid', width: '200px' }">
    <Variant title="Default">
      <div class="asdf">
        <Dropdown :options="actions" />
      </div>
    </Variant>

    <Variant title="With Custom Button">
      <Dropdown :options="actions">
        <Button variant="solid">Custom Trigger</Button>
      </Dropdown>
    </Variant>

    <Variant title="With Groups">
      <Dropdown :options="groupedActions" />
    </Variant>

    <Variant title="Right Aligned">
      <Dropdown :options="actions" placement="right" />
    </Variant>

    <Variant title="Center Aligned">
      <Dropdown :options="actions" placement="center" />
    </Variant>

    <Variant title="With Submenus">
      <Dropdown :options="submenuActions" />
    </Variant>

    <Variant title="With Nested Submenus">
      <Dropdown :options="groupedActions" />
    </Variant>
  </Story>
</template>
`;
export {
  __resolved__virtual_storySource_srcComponentsDropdownDropdownStoryVue as default
};
