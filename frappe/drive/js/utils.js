
export function dynamicList(k) {
  return k.filter((a) => typeof a !== "object" || !("cond" in a) || a.cond)
}