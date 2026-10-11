import fs from 'fs'
import path from 'path'
import { findBenchPath } from './utils.js'

const SITES_IMPORT = /^(?:\.\.\/)+sites\/(.+)$/

// Apps read bench files with a relative import such as
// '../../../../sites/common_site_config.json', which only resolves while the app
// sits in the bench's apps/ folder. When it does not, as for an app linked into
// apps/ from elsewhere, resolve the file in the bench instead.
export function benchFiles() {
  return {
    name: 'frappeui-bench-files',
    enforce: 'pre',
    async resolveId(source, importer, options) {
      const match = source.match(SITES_IMPORT)
      if (!match) {
        return null
      }
      const resolved = await this.resolve(source, importer, {
        ...options,
        skipSelf: true,
      })
      if (resolved) {
        return resolved
      }
      const benchPath = findBenchPath()
      const file = benchPath && path.join(benchPath, 'sites', match[1])
      return file && fs.existsSync(file) ? file : null
    },
  }
}
