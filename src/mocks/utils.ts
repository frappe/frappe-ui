import { watch } from 'vue'

export let baseUrl = 'http://example.com'

export let url = (path: string) => new URL(path, baseUrl).toString()

export function waitUntilValueChanges(
  getter: () => any,
  timeout = 1000,
): Promise<void> {
  return new Promise((resolve) => {
    let stop = watch(getter, () => {
      stop()
      resolve()
    })
    setTimeout(() => {
      stop()
      resolve()
    }, timeout)
  })
}
