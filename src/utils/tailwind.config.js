const preset = require('../tailwind/preset')
console.warn(
  '`frappe-ui/src/utils/tailwind.config.js` is deprecated. Use `frappe-ui/tailwind/preset.js` instead.',
)
// keep backwards compatible for now
module.exports = preset
