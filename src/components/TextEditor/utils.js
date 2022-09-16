import commands from './commands'

export function createEditorButton(option) {
  if (option instanceof Array) {
    return option.map(createEditorButton)
  }
  if (typeof option == 'object') {
    return option
  }
  return commands[option]
}
