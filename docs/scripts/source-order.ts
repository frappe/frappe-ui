import fs from 'fs'

import ts from 'typescript'

import { splitUnionMembers } from './type-unions'

/**
 * Puts the generated tables back into source declaration order.
 *
 * vue-component-meta lists props and union members in the order TypeScript's
 * checker resolved them. String literal types are interned per program, so
 * `"top" | "right" | "bottom" | "left"` comes out as `"left" | "right" |
 * "bottom" | "top"` once another component has already claimed those literals.
 * The order therefore depends on how much of the program is loaded, not on the
 * source.
 *
 * Every entry carries the file and offset it was declared at, so the source
 * order is recoverable from the AST — the program is already loaded, so this
 * costs nothing. Both functions here fall back to the checker's order when they
 * cannot see the declaration, rather than guessing.
 */

export type SourceDeclaration = { file: string; range: [number, number] }

export type DocumentedEntry = {
  getDeclarations: () => SourceDeclaration[]
}

// A type alias can point at another alias, and an indexed access resolves
// through a property that is itself an alias. Real chains are two or three
// links; the cap is only there so a circular declaration cannot hang the run.
const MAX_DEPTH = 10

export function createSourceOrder(program: ts.Program) {
  const typeChecker = program.getTypeChecker()

  // Mirrors vue-component-meta's own type printing, so a member printed here
  // reads exactly like the same member in the type it came from.
  function printType(type: ts.Type) {
    const str = typeChecker.typeToString(
      type,
      undefined,
      ts.TypeFormatFlags.UseFullyQualifiedType |
        ts.TypeFormatFlags.NoTruncation,
    )
    return str.includes('import(') ? str.replace(/import\(.*?\)\./g, '') : str
  }

  const fileText = new Map<string, string>()
  function readFile(file: string) {
    const cached = fileText.get(file)
    if (cached !== undefined) return cached
    const text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
    fileText.set(file, text)
    return text
  }

  function isPropertyNode(node: ts.Node) {
    return ts.isPropertySignature(node) || ts.isPropertyAssignment(node)
  }

  /**
   * The property node a declaration points at.
   *
   * Offsets are reported against the file on disk, but the source file the
   * program holds for a `.vue` path is the TypeScript that Vue's tooling
   * generates from it, where nothing is at the same offset. So the offset is
   * only trusted when the node it lands on spells the declaration out; failing
   * that, the generated file is searched for the one property written exactly
   * that way. Two matches means the offset cannot pick between them, so neither
   * is used.
   */
  function nodeAt(declaration: SourceDeclaration) {
    const sourceFile = program.getSourceFile(declaration.file)
    if (!sourceFile) return undefined

    const [start, end] = declaration.range
    const text = readFile(declaration.file).slice(start, end)
    if (!text) return undefined

    let atOffset: ts.Node | undefined
    const visit = (node: ts.Node) => {
      if (node.getStart() > start || node.getEnd() < end) return
      atOffset = node
      ts.forEachChild(node, visit)
    }
    ts.forEachChild(sourceFile, visit)
    if (atOffset && isPropertyNode(atOffset) && atOffset.getText() === text) {
      return atOffset
    }

    const matches: ts.Node[] = []
    const search = (node: ts.Node) => {
      if (isPropertyNode(node) && node.getText() === text) matches.push(node)
      ts.forEachChild(node, search)
    }
    ts.forEachChild(sourceFile, search)
    return matches.length === 1 ? matches[0] : undefined
  }

  function typeNodeOf(node: ts.Node, depth = 0): ts.TypeNode | undefined {
    if (depth > MAX_DEPTH) return undefined

    if (
      ts.isPropertySignature(node) ||
      ts.isPropertyDeclaration(node) ||
      ts.isVariableDeclaration(node) ||
      ts.isParameter(node)
    ) {
      return node.type
    }
    // A runtime prop definition — `theme: { type: String as PropType<Theme> }`.
    if (ts.isPropertyAssignment(node)) {
      return runtimePropTypeNode(node.initializer, depth + 1)
    }
    return undefined
  }

  function runtimePropTypeNode(
    node: ts.Expression,
    depth: number,
  ): ts.TypeNode | undefined {
    if (depth > MAX_DEPTH) return undefined

    // `icon: iconProp`, where `iconProp` is a shared definition.
    if (ts.isIdentifier(node)) {
      const symbol = typeChecker.getSymbolAtLocation(node)
      const declaration = symbol?.declarations?.find(ts.isVariableDeclaration)
      return declaration?.initializer
        ? runtimePropTypeNode(declaration.initializer, depth + 1)
        : undefined
    }
    if (ts.isObjectLiteralExpression(node)) {
      const type = node.properties.find(
        (property): property is ts.PropertyAssignment =>
          ts.isPropertyAssignment(property) &&
          ts.isIdentifier(property.name) &&
          property.name.text === 'type',
      )
      return type ? runtimePropTypeNode(type.initializer, depth + 1) : undefined
    }
    // The declared type only exists inside the `PropType<…>` cast.
    if (ts.isAsExpression(node) && ts.isTypeReferenceNode(node.type)) {
      if (node.type.typeName.getText() === 'PropType') {
        return node.type.typeArguments?.[0]
      }
    }
    return undefined
  }

  /**
   * The nodes a union's members are written as, in the order they are written.
   * Two shapes declare one: a union type, and an index into a `const` array —
   * reka-ui writes its sides as `(typeof SIDE_OPTIONS)[number]`.
   */
  function unionMemberNodes(
    node: ts.TypeNode | undefined,
    depth = 0,
  ): readonly ts.Node[] | undefined {
    if (!node || depth > MAX_DEPTH) return undefined

    if (ts.isUnionTypeNode(node)) return node.types
    if (ts.isParenthesizedTypeNode(node)) {
      return unionMemberNodes(node.type, depth + 1)
    }
    if (ts.isTypeReferenceNode(node)) {
      const symbol = typeChecker.getSymbolAtLocation(node.typeName)
      const target =
        symbol && symbol.flags & ts.SymbolFlags.Alias
          ? typeChecker.getAliasedSymbol(symbol)
          : symbol
      const alias = target?.declarations?.find(ts.isTypeAliasDeclaration)
      return unionMemberNodes(alias?.type, depth + 1)
    }
    if (ts.isIndexedAccessTypeNode(node)) {
      return indexedAccessMemberNodes(node, depth)
    }
    return undefined
  }

  function indexedAccessMemberNodes(
    node: ts.IndexedAccessTypeNode,
    depth: number,
  ): readonly ts.Node[] | undefined {
    // `(typeof SIDE_OPTIONS)[number]` — the order lives in the array literal.
    if (node.indexType.kind === ts.SyntaxKind.NumberKeyword) {
      const objectType = ts.isParenthesizedTypeNode(node.objectType)
        ? node.objectType.type
        : node.objectType
      if (!ts.isTypeQueryNode(objectType)) return undefined

      const symbol = typeChecker.getSymbolAtLocation(objectType.exprName)
      const declaration = symbol?.declarations?.find(ts.isVariableDeclaration)
      if (!declaration) return undefined

      let initializer = declaration.initializer
      if (initializer && ts.isAsExpression(initializer)) {
        initializer = initializer.expression
      }
      if (initializer && ts.isArrayLiteralExpression(initializer)) {
        return initializer.elements
      }
      // A `.d.ts` has no initializer to read — the elements are in the emitted
      // type, `declare const SIDE_OPTIONS: readonly ["top", …]`.
      let annotation = declaration.type
      if (annotation && ts.isTypeOperatorNode(annotation)) {
        annotation = annotation.type
      }
      if (annotation && ts.isTupleTypeNode(annotation))
        return annotation.elements
      return undefined
    }

    // `TooltipContentProps['side']` — the union is declared on the property
    // being indexed, which is usually in another package.
    if (
      !ts.isLiteralTypeNode(node.indexType) ||
      !ts.isStringLiteral(node.indexType.literal)
    ) {
      return undefined
    }
    const property = typeChecker
      .getTypeAtLocation(node.objectType)
      .getProperty(node.indexType.literal.text)
    const declaration = property?.declarations?.[0]
    if (!declaration) return undefined
    return unionMemberNodes(typeNodeOf(declaration, depth + 1), depth + 1)
  }

  // Each member printed the way vue-component-meta prints it, in the order the
  // source declares them. A member that is itself an alias for a union prints
  // as that union, so the result is flattened the same way the checker flattens
  // it.
  function declaredUnionMembers(entry: DocumentedEntry) {
    let declaration: SourceDeclaration | undefined
    try {
      declaration = entry.getDeclarations()[0]
    } catch {
      return undefined
    }
    if (!declaration) return undefined

    const node = nodeAt(declaration)
    const members = node && unionMemberNodes(typeNodeOf(node))
    if (!members) return undefined

    return members.flatMap((member) =>
      splitUnionMembers(printType(typeChecker.getTypeAtLocation(member))),
    )
  }

  /**
   * Reprints a union with its members in the order the declaration lists them.
   *
   * The declaration may list more than is printed — `FormControl`'s `type`
   * spells out `'date'` and `'time'` next to the `TextInputTypes` that already
   * covers them, and only the alias survives printing. A printed member the
   * declaration does not mention is the other way round: the checker widened or
   * narrowed the type, the declaration no longer describes it, and the printed
   * order stands.
   */
  function orderUnion(printed: string, entry: DocumentedEntry) {
    const members = splitUnionMembers(printed)
    if (members.length < 2) return printed

    const declared = declaredUnionMembers(entry)
    if (!declared) return printed

    const positions = new Map(
      declared.map((member, index) => [member, index] as const),
    )
    if (members.some((member) => !positions.has(member))) return printed

    return [...members]
      .sort((a, b) => positions.get(a)! - positions.get(b)!)
      .join(' | ')
  }

  /**
   * Reorders entries to match their declarations: by offset within a file, and
   * by the file's first appearance across files, so a prop declared on the
   * component itself still comes before one it inherits. Entries whose
   * declaration the checker did not report keep the checker's order — all of
   * them, not just the ones missing it, since there is nowhere to put them.
   */
  function sortByDeclaration<T extends DocumentedEntry>(entries: T[]): T[] {
    const declarations = entries.map((entry) => {
      try {
        return entry.getDeclarations()[0]
      } catch {
        return undefined
      }
    })
    if (declarations.some((declaration) => !declaration)) return entries

    const files: string[] = []
    for (const declaration of declarations) {
      if (!files.includes(declaration!.file)) files.push(declaration!.file)
    }

    return entries
      .map((entry, index) => ({ entry, index, at: declarations[index]! }))
      .sort((a, b) => {
        const byFile = files.indexOf(a.at.file) - files.indexOf(b.at.file)
        if (byFile !== 0) return byFile
        return a.at.range[0] - b.at.range[0] || a.index - b.index
      })
      .map((sorted) => sorted.entry)
  }

  return { orderUnion, sortByDeclaration }
}
