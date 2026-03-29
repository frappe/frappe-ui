import { reactive } from 'vue'
import { createGetDoc } from './getDoc'
import { createGetList } from './getList'
import { useFrappeFetch } from './useFrappeFetch'
import { syncFromDocs } from './cache'

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
  TControllerMethods extends ControllerMethods = {},
  TDocMethods extends ControllerMethods = {},
> {
  baseUrl?: string
  controllerMethods?: TControllerMethods
  docMethods?: TDocMethods
}

export type DoctypeDefinition<
  TControllerMethods extends ControllerMethods = {},
  TDocMethods extends ControllerMethods = {},
> = DoctypeOptions<TControllerMethods, TDocMethods> & {
  doctype: string
}

export type MappedMethod<TMethod extends ControllerMethodDef> = {
  submit: (...args: Parameters<TMethod['args']>) => Promise<void>
  loading: boolean
  error: any
  data: TMethod extends ControllerMethodDef<any, infer R> ? R : any
}

export type MappedControllerMethod<TMethod extends ControllerMethodDef> = {
  create: () => MappedMethod<TMethod>
}

export type MappedDocMethod<TDoc, TMethod extends ControllerMethodDef> = {
  submit: (...args: Parameters<TMethod['args']>) => {
    optimistic: (fn: (doc: TDoc) => TDoc) => Promise<void>
    then: <T>(
      onfulfilled?: ((value: void) => T | PromiseLike<T>) | null,
      onrejected?: ((reason: any) => T | PromiseLike<T>) | null,
    ) => Promise<T>
    catch: <T>(
      onrejected?: ((reason: any) => T | PromiseLike<T>) | null,
    ) => Promise<T>
    finally: (onfinally?: (() => void) | null) => Promise<void>
  }
  loading: boolean
  error: any
  data: TMethod extends ControllerMethodDef<any, infer R> ? R : any
}

export type MappedControllerMethods<
  TControllerMethods extends ControllerMethods,
> = {
  [K in keyof TControllerMethods]: MappedControllerMethod<TControllerMethods[K]>
}

export type MappedDocMethods<TDoc, TDocMethods extends ControllerMethods> = {
  [K in keyof TDocMethods]: MappedDocMethod<TDoc, TDocMethods[K]>
}

export function defineDoctype<TDoc extends { name: string }>() {
  return function <
    TControllerMethods extends ControllerMethods = {},
    TDocMethods extends ControllerMethods = {},
  >(definition: DoctypeDefinition<TControllerMethods, TDocMethods>) {
    const { doctype, baseUrl = '', controllerMethods, docMethods } = definition

    const getDoc = createGetDoc<TDoc, TDocMethods>({
      doctype,
      baseUrl,
      docMethods,
    })
    const getList = createGetList<TDoc>({ doctype, baseUrl })

    const mappedControllerMethods =
      {} as MappedControllerMethods<TControllerMethods>

    if (controllerMethods) {
      for (const [key, methodDef] of Object.entries(controllerMethods)) {
        const { method, httpMethod = 'POST', args } = methodDef

        const mappedMethod = {
          create: () => {
            const paramsRef = reactive<Record<string, any>>({})

            const result = useFrappeFetch({
              url: `/api/v2/method/${doctype}/${method}`,
              method: httpMethod,
              baseUrl,
              immediate: false,
              params: () => paramsRef,
              onSuccess: async (json) => {
                await syncFromDocs(json?.docs)
              },
            })

            return reactive({
              submit: async (...fnArgs: any[]) => {
                const newParams = args(...fnArgs)
                for (const k in paramsRef) delete paramsRef[k]
                Object.assign(paramsRef, newParams)

                await result.execute()
              },
              get loading() {
                return result.loading
              },
              get error() {
                return result.error
              },
              get data() {
                return result.json
              },
            }) as MappedMethod<typeof methodDef>
          },
        }

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
