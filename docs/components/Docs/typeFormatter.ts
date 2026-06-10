const IND = '  '

// Pretty-prints object types onto indented lines; objects inside `<>` stay inline.
export function formatTypeStr(type: string): string {
  if (!type || !type.includes('{')) return type

  let result = ''
  let objDepth = 0  // depth counting only { } outside generics
  let genDepth = 0  // depth counting < >
  let i = 0

  while (i < type.length) {
    const ch = type[i]

    if (ch === '<') {
      genDepth++
      result += ch
    } else if (ch === '>') {
      // Don't count the '>' that is part of '=>'
      if (genDepth > 0 && type[i - 1] !== '=') genDepth--
      result += ch
    } else if (ch === '{' && genDepth === 0) {
      objDepth++
      result += '{\n' + IND.repeat(objDepth)
      i++
      if (type[i] === ' ') i++ // skip the leading space after '{'
      continue
    } else if (ch === '}' && genDepth === 0 && objDepth > 0) {
      result = result.trimEnd()
      if (result.endsWith(';')) result = result.slice(0, -1) // no trailing ;
      objDepth--
      result += '\n' + IND.repeat(objDepth) + '}'
      i++
      continue
    } else if (ch === ';' && genDepth === 0 && objDepth > 0 && type[i + 1] === ' ') {
      // Property separator → new indented line
      result += ';\n' + IND.repeat(objDepth)
      i += 2
      continue
    } else {
      result += ch
    }
    i++
  }

  return result
}

/** True when the formatted type would need a Show-more / Show-less toggle. */
export function isLongType(type: string | undefined): boolean {
  if (!type) return false
  return formatTypeStr(type).split('\n').length > 5
}
