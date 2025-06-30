export function sanitizeHTML(
  msg: string,
  options: { allowedTags?: string[] } = {},
) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(msg, 'text/html')
  const allowedTags = options.allowedTags
  const elements = doc.body.querySelectorAll('*')
  elements.forEach((el) => {
    if (allowedTags && !allowedTags.includes(el.tagName.toLowerCase())) {
      el.replaceWith(...Array.from(el.childNodes)) // Replace with child nodes to keep text content
    }
  })
  return doc.body?.innerHTML || msg
}
