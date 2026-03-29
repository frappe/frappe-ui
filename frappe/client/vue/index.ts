export { createClient } from './createVueClient'
export type {
  CreateVueClientOptions,
  VueClientResult,
  VueDoctypeInstance,
  DoctypeDefinition,
  GetDocOptions,
  GetListOptions,
  MethodDef,
  ControllerMethods,
} from './createVueClient'

export {
  createVueDocHandle,
  type VueDocHandle,
  type VueDocHandleOptions,
  type FlatOperation,
} from './vueDocHandle'

export {
  createVueListHandle,
  type VueListHandle,
  type VueListHandleOptions,
  type ReactiveFilters,
  type FiltersOption,
  type InsertOperation,
  type InsertOptions,
  type InsertPosition,
} from './vueListHandle'

export { wrapOperation, type ReactiveOperation } from './ReactiveOperation'
