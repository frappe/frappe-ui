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

export {
  createVueNewDocHandle,
  type VueNewDocHandle,
  type VueNewDocHandleOptions,
} from './vueNewDocHandle'

export {
  createVueCountHandle,
  type VueCountHandle,
  type VueCountHandleOptions,
  type GetCountOptions,
} from './vueCountHandle'

export {
  uploadFile,
  type UploadHandle,
  type UploadFileOptions,
} from './uploadFile'

export { wrapOperation, type ReactiveOperation } from './ReactiveOperation'

export {
  createMemoryCacheAdapter,
  createIDBCacheAdapter,
  createDefaultCacheAdapter,
  connectCache,
  type CacheAdapter,
} from '../core/CacheAdapter'
