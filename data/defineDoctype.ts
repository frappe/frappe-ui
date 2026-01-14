import { reactive } from 'vue'
import { createGetDoc } from './getDoc'
import { createGetList } from './getList'
import { useFrappeFetch } from './useFrappeFetch'

export interface ControllerMethodDef<
  TArgs extends any[] = any[],
  TReturn = any,
> {
  method: string
  httpMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  args: (...args: TArgs) => Record<string, any>
}

export type ControllerMethods = Record<string, ControllerMethodDef>

export interface DoctypeOptions<
  TControllerMethods extends ControllerMethods = ControllerMethods,
> {
  baseUrl?: string
  controllerMethods?: TControllerMethods
}

export type MappedControllerMethod<TMethod extends ControllerMethodDef> = {
  submit: (...args: Parameters<TMethod['args']>) => Promise<void>
  loading: boolean
  error: any
  data: TMethod extends ControllerMethodDef<any, infer R> ? R : any
}

export type MappedControllerMethods<TControllerMethods extends ControllerMethods> =
  {
    [K in keyof TControllerMethods]: MappedControllerMethod<
      TControllerMethods[K]
    >
  }

export function defineDoctype<TDoc extends { name: string }>() {
  return function <
    TControllerMethods extends ControllerMethods = ControllerMethods,
  >(
    doctype: string,
    options: DoctypeOptions<TControllerMethods> = {},
  ) {
    const { baseUrl = '', controllerMethods } = options

    const getDoc = createGetDoc<TDoc>({ doctype, baseUrl })
    const getList = createGetList<TDoc>({ doctype, baseUrl })

    const mappedControllerMethods = {} as MappedControllerMethods<TControllerMethods>

    if (controllerMethods) {
      for (const [key, methodDef] of Object.entries(controllerMethods)) {
        const { method, httpMethod = 'POST', args } = methodDef

        // We need to reconstruct the object to properly bind the reactive properties from useFrappeFetch

        const paramsRef = reactive<Record<string, any>>({})

        const result = useFrappeFetch({
          url: `/api/v2/method/${doctype}/${method}`,
          method: httpMethod,
          baseUrl,
          immediate: false,
          params: () => paramsRef,
        })

        const mappedMethod = reactive({
          submit: async (...fnArgs: any[]) => {
            const newParams = args(...fnArgs)
            // Clear previous keys
            for (const k in paramsRef) delete paramsRef[k]
            Object.assign(paramsRef, newParams)

            await result.execute()
          },
          get loading() { return result.loading },
          get error() { return result.error },
          get data() { return result.json },
        })

        // @ts-ignore
        mappedControllerMethods[key] = mappedMethod
      }
    }

    return {
      getDoc,
      getList,
      ...mappedControllerMethods,
    }
  }
}
