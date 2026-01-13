import { computed, reactive, ref, Ref, MaybeRefOrGetter, toValue } from 'vue'
import { useFrappeFetch } from './useFrappeFetch'

interface DoctypeOptions {
  baseUrl?: string
}

interface GetDocResult<TDoc> {
  doc: TDoc | null
  loading: boolean
  error: any
  reload: () => void
}

export function defineDoctype<TDoc extends { name: string }>() {
  return function (doctype: string, options: DoctypeOptions = {}) {
    const { baseUrl = '' } = options

    function getDoc(name: MaybeRefOrGetter<string>): GetDocResult<TDoc> {
      const nameValue = toValue(name)
      const urlString = `/api/v2/document/${doctype}/${nameValue}`

      const result = useFrappeFetch({ url: urlString, baseUrl })

      return reactive({
        get doc() {
          if (result.data?.data) {
            return result.data.data as TDoc
          }
          return null
        },
        get loading() {
          return result.loading
        },
        get error() {
          return result.error
        },
        reload: result.execute,
      }) as GetDocResult<TDoc>
    }

    return {
      getDoc,
    }
  }
}
