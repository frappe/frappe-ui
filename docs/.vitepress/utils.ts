import fs from 'node:fs'
import path from 'node:path'

const components_path = path.resolve(__dirname, '../../src/components/')
const frappe_path = path.resolve(__dirname, '../../frappe/')

function listWithStories(rootPath: string): string[] {
  const entries = fs.readdirSync(rootPath, { withFileTypes: true })

  const items = []

  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const storiesPath = path.join(rootPath, entry.name, 'stories')
    const docsPath = path.join(rootPath, entry.name, `${entry.name}.md`)

    if (!fs.existsSync(storiesPath) || !fs.existsSync(docsPath)) continue

    items.push(entry.name)
  }

  return items
}

export const getComponentItems = () => listWithStories(components_path)

export const getFrappeItems = () => listWithStories(frappe_path)
