/**
 * Validates if the given string is a valid URL, including common protocols,
 * relative paths, and anchor links. It also allows an empty string.
 *
 * @param url The URL string to validate.
 * @returns True if the URL is considered valid, false otherwise.
 */
export function isValidUrl(url: string): boolean {
  if (url === '') {
    return true // Allows empty string as per documentation
  }

  // Regex for absolute URLs with common schemes (http, https, mailto, tel, //)
  // Allows for paths, query strings, and fragments.
  if (/^(https?:\/\/|mailto:|tel:|\/\/)[^\s]+$/i.test(url)) {
    return true
  }

  // Regex for:
  // 1. Relative paths (starting with / or .)
  // 2. Anchor links (starting with #)
  // These allow for most characters except whitespace, as the initial characters
  // prevent misinterpretation as a scheme like 'javascript:'.
  if (/^([./#][^\s]*)$/i.test(url)) {
    return true
  }

  // Regex for "Schemeless" paths (e.g., page.html, my-document, slug-name)
  // Must start with a word character or hyphen.
  // Subsequent characters are restricted to common URL path/query/fragment characters
  // (alphanumeric, -, _, ., /, #, ?, =, &, %).
  // This prevents colons (avoiding 'javascript:' like schemes) and other problematic
  // characters like spaces, (, ), !, {, }.
  if (/^[\w\-]([\w\-./#?=&%]*)$/i.test(url)) {
    return true
  }

  return false
}
