import { call } from 'frappe-ui'

export const silentCall = <T>(method: string): Promise<T> => {
  // To prevent console errors/logs from being shown
  // when method doesn't exist in older versions of Frappe
  const originalError = console.error
  const originalLog = console.log
  console.error = () => {}
  console.log = () => {}

  return call(method).finally(() => {
    console.log = originalLog
    console.error = originalError
  })
}
