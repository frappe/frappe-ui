import {
  defineDoctype as baseDefineDoctype,
  type ControllerMethods,
  type DoctypeDefinition,
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
      TControllerMethods extends ControllerMethods = {},
      TDocMethods extends ControllerMethods = {},
    >(definition: DoctypeDefinition<TControllerMethods, TDocMethods>) {
      return defineForDoctype<TControllerMethods, TDocMethods>({
        ...definition,
        baseUrl: definition.baseUrl ?? baseUrl,
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
