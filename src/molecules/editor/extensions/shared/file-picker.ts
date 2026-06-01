export interface FilePickerOptions {
  accept?: string
  multiple?: boolean
}

export function pickFiles(options: FilePickerOptions = {}): Promise<File[]> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = options.accept ?? ''
    input.multiple = options.multiple ?? false
    input.onchange = () => resolve(Array.from(input.files ?? []))
    input.oncancel = () => resolve([])
    input.click()
  })
}
