import fs from 'node:fs'
import path from 'node:path'

const components_path = path.resolve(__dirname, '../../src/components/')

export const getComponentItems = () => {
  const entries = fs.readdirSync(components_path, { withFileTypes: true })

  const items = []

  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const storiesPath = path.join(components_path, entry.name, 'stories')

    if (!fs.existsSync(storiesPath)) continue

    items.push(entry.name)
  }

  return items
}
