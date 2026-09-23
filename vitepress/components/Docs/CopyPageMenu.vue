<script setup lang="ts">
// The page's "Copy page" menu, for readers who build with an AI assistant
// next to the docs.
import { Dropdown, toast } from 'frappe-ui'
import { pageMarkdown } from './pageMarkdown'

function copyMarkdown() {
  navigator.clipboard?.writeText(pageMarkdown())
  toast.success('Page copied as Markdown')
}

function ask(base: string) {
  const q = `Read ${location.href} and help me use this frappe-ui component.`
  window.open(base + encodeURIComponent(q), '_blank', 'noopener')
}

const options = [
  {
    label: 'Copy page as Markdown',
    icon: 'lucide-copy',
    onClick: copyMarkdown,
  },
  {
    label: 'Open in Claude',
    icon: 'lucide-sparkles',
    onClick: () => ask('https://claude.ai/new?q='),
  },
  {
    label: 'Open in ChatGPT',
    icon: 'lucide-message-circle',
    onClick: () => ask('https://chatgpt.com/?q='),
  },
  {
    label: 'View llms.txt',
    icon: 'lucide-file-text',
    onClick: () => window.open('/llms.txt', '_blank', 'noopener'),
  },
]
</script>

<template>
  <Dropdown
    :options="options"
    align="end"
    :button="{
      label: 'Copy page',
      iconLeft: 'lucide-copy',
      iconRight: 'lucide-chevron-down',
      variant: 'ghost',
    }"
  />
</template>
