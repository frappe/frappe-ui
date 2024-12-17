export let url = (path: string) =>
  new URL(path, 'http://example.com').toString()
