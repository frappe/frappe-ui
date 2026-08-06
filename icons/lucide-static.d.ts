// `lucide-static` ships a 1.5 MB hand-rolled declaration file that its
// package.json never points at, so TypeScript cannot find types for it.
// Every export is the same shape — a full `<svg>…</svg>` string — so declare
// that once instead of parsing the shipped file.
declare module 'lucide-static' {
  const icons: { [exportName: string]: string }
  export = icons
}
