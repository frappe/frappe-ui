export function makeGetParams(params: { [key: string]: any }) {
  let url = new URLSearchParams()
  for (let key in params) {
    let value = params[key]
    if (value != null && !isEmptyObject(value)) {
      url.append(key, value)
    }
  }
  return url.toString()
}

export function isEmptyObject(obj: any) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}
