// @ts-check
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const TEMPLATES = fileURLToPath(new URL('../templates', import.meta.url))

/** @typedef {'frappe' | 'standalone'} Template */

/**
 * Values that replace the `__NAME__` placeholders in template files.
 *
 * @typedef {object} TemplateValues
 * @property {string} PACKAGE_NAME
 * @property {string} TITLE
 * @property {string} FRAPPE_UI_VERSION
 * @property {string} ROUTE
 * @property {string} ROUTE_NAME
 */

/**
 * The files a template writes, relative to the project folder.
 *
 * @param {Template} template
 * @returns {string[]}
 */
export function templateFiles(template) {
  return [...new Set(sourceFiles(template).map((file) => file.output))].sort()
}

/**
 * Copies a template into `target`, filling in its placeholders.
 *
 * @param {Template} template
 * @param {string} target
 * @param {TemplateValues} values
 */
export function copyTemplate(template, target, values) {
  for (const { source, output } of sourceFiles(template)) {
    const content = fs
      .readFileSync(source, 'utf8')
      .replace(/__([A-Z_]+)__/g, (match, /** @type {string} */ key) =>
        Object.hasOwn(values, key)
          ? values[/** @type {keyof TemplateValues} */ (key)]
          : match,
      )
    const destination = path.join(target, output)
    fs.mkdirSync(path.dirname(destination), { recursive: true })
    fs.writeFileSync(destination, content)
  }
}

/**
 * Every template starts from `templates/base`. A template file with the same
 * path comes later, so it replaces the base one.
 *
 * @param {Template} template
 */
function sourceFiles(template) {
  return ['base', template].flatMap((layer) => {
    const root = path.join(TEMPLATES, layer)
    return fs
      .readdirSync(root, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => {
        const source = path.join(entry.parentPath, entry.name)
        return { source, output: outputPath(path.relative(root, source)) }
      })
  })
}

/**
 * npm leaves dotfiles such as `.gitignore` out of a published package, so the
 * templates store them as `_gitignore`.
 *
 * @param {string} file
 */
function outputPath(file) {
  const base = path.basename(file)
  return base.startsWith('_')
    ? path.join(path.dirname(file), `.${base.slice(1)}`)
    : file
}

/**
 * Turns a folder name into a valid npm package name.
 *
 * @param {string} name
 */
export function toPackageName(name) {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/^[._]+/, '')
      .replace(/[^a-z0-9-~._]+/g, '-') || 'frappe-ui-app'
  )
}
