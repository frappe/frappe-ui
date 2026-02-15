import {
  defineDoctype as baseDefineDoctype,
  type ControllerMethods,
  type DoctypeOptions,
} from './defineDoctype'

export interface CreateClientOptions {
  baseUrl?: string
  realtime?: boolean
}

export interface ClientInstance {
  baseUrl: string
  realtime: boolean
}

export interface CreateClientResult {
  defineDoctype: typeof baseDefineDoctype
  client: ClientInstance
}

export function createClient(
  options: CreateClientOptions = {},
): CreateClientResult {
  const { baseUrl = '', realtime = false } = options

  const defineDoctype: typeof baseDefineDoctype = function <
    TDoc extends { name: string },
  >() {
    const defineForDoctype = baseDefineDoctype<TDoc>()

    return function <
      TControllerMethods extends ControllerMethods = ControllerMethods,
      TDocMethods extends ControllerMethods = ControllerMethods,
    >(
      doctype: string,
      doctypeOptions: DoctypeOptions<TControllerMethods, TDocMethods> = {},
    ) {
      return defineForDoctype<TControllerMethods, TDocMethods>(doctype, {
        ...doctypeOptions,
        baseUrl: doctypeOptions.baseUrl ?? baseUrl,
      })
    }
  }

  return {
    defineDoctype,
    client: {
      baseUrl,
      realtime,
    },
  }
}
