// Back-compat shim: the code-block extension now lives in `./code-block/`.
// Kept so the legacy import path `extensions/code-block` keeps resolving until
// the Rewire step repoints importers to the folder barrel.
export * from './code-block/code-block'
