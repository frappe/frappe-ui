<script setup lang="ts">
import { Dropdown } from './index'
import { Button } from '../Button'

const actions = [
  {
    label: 'Edit',
    icon: 'edit',
    onClick: () => console.log('Edit clicked'),
  },
  {
    label: 'Delete',
    icon: 'trash-2',
    theme: 'red',
    onClick: () => console.log('Delete clicked'),
  },
]

const groupedActions = [
  {
    group: 'Actions',
    items: [
      {
        label: 'Edit',
        icon: 'edit',
        onClick: () => console.log('Edit clicked'),
      },
      {
        label: 'Duplicate',
        icon: 'copy',
        onClick: () => console.log('Duplicate clicked'),
      },
      {
        label: 'More Actions',
        icon: 'more-horizontal',
        submenu: [
          {
            label: 'Archive',
            icon: 'archive',
            onClick: () => console.log('Archive clicked'),
          },
          {
            label: 'Export',
            icon: 'download',
            submenu: [
              {
                label: 'Export as PDF',
                icon: 'file-text',
                onClick: () => console.log('Export as PDF clicked'),
              },
              {
                label: 'Export as CSV',
                icon: 'file',
                onClick: () => console.log('Export as CSV clicked'),
              },
            ],
          },
          {
            label: 'Share',
            icon: 'share',
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
        icon: 'trash-2',
        theme: 'red',
        onClick: () => console.log('Delete clicked'),
      },
    ],
  },
]

const submenuActions = [
  {
    label: 'New',
    icon: 'plus',
    submenu: [
      {
        group: 'Documents',
        items: [
          {
            label: 'New Document',
            icon: 'file-plus',
            onClick: () => console.log('New Document clicked'),
          },
          {
            label: 'New Template',
            icon: 'file-text',
            onClick: () => console.log('New Template clicked'),
          },
          {
            label: 'Delete',
            icon: 'trash-2',
            theme: 'red',
            onClick: () => console.log('Delete clicked'),
          },
        ],
      },
      {
        group: 'Organization',
        items: [
          {
            label: 'New Folder',
            icon: 'folder-plus',
            onClick: () => console.log('New Folder clicked'),
          },
          {
            label: 'New Project',
            icon: 'briefcase',
            onClick: () => console.log('New Project clicked'),
          },
        ],
      },
    ],
  },
  {
    label: 'Edit',
    icon: 'edit',
    onClick: () => console.log('Edit clicked'),
  },
  {
    label: 'Share',
    icon: 'share',
    submenu: [
      {
        label: 'Share with Link',
        icon: 'link',
        onClick: () => console.log('Share with Link clicked'),
      },
      {
        label: 'Share with Email',
        icon: 'mail',
        onClick: () => console.log('Share with Email clicked'),
      },
      {
        group: 'Advanced',
        items: [
          {
            label: 'Share Settings',
            icon: 'settings',
            onClick: () => console.log('Share Settings clicked'),
          },
          {
            label: 'Permission Management',
            icon: 'shield',
            onClick: () => console.log('Permission Management clicked'),
          },
        ],
      },
    ],
  },
  {
    label: 'Collaborate',
    switch: true,
    icon: 'file-text',
  },
]

const switchActions = [
  {
    label: 'Rename',
    icon: 'edit',
    onClick: () => console.log('Rename clicked'),
  },
  {
    label: 'Lock',
    icon: 'lock',
    switch: true,
    switchValue: true,
    onClick: (val) => console.log('Lock switch value:', val),
  },
  {
    label: 'Collaborate',
    switch: true,
    icon: 'users',
    onClick: (val) => console.log('Collaborate switch value:', val),
  },
]
</script>

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
    <Variant title="With Switches">
      <Dropdown :options="switchActions" />
    </Variant>

    <Variant title="With Nested Submenus">
      <Dropdown :options="groupedActions" />
    </Variant>
  </Story>
</template>
